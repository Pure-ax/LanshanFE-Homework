<template>

  <div class="toolbar">
    <div class="cube" v-for="item in init" :key="item.id">
        <button @click="init[item.id].toggle">
            <div class="icon"><i class="iconFont" v-html="init[item.id].icon"></i></div>
            <div class="option">{{init[item.id].option}}</div>
        </button>
    </div>
    <div class="cube">
        <button @click="drawEnter">
            <div class="icon" id="draw"><i class="iconFont" id="drawFont">&#xe606;</i></div>
            <div class="option">画笔</div>
        </button>
    </div>
    <div class="cube">
        <button @click="triggerImageUpload">
            <div class="icon"><i class="iconFont">&#xe8ba;</i></div>
            <div class="option">导入</div>
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/png, image/jpeg" 
              @change="handleImageUpload" 
              hidden 
            />
        </button>
    </div>
    <div class="cube" v-for="item in options" :key="item.id">
        <button @click="options[item.id].func">
            <div class="icon"><i class="iconFont" v-html="options[item.id].icon"></i></div>
            <div class="option">{{options[item.id].option}}</div>
        </button>
    </div>
  </div>

  <div class="EnterShape" v-show="init[0].Enter">
    <div class="title">类别</div>
    <div class="ShapeBox">
      <div class="ShapeOutfit" v-for="item in Shapes" :key="item.id">
        <button class="ShapeBtn">
          <i
           class="iconFont" id="iconShape" 
           v-html="Shapes[item.id].icon"
           @click="addShape(Shapes[item.id].Shape)"
          />
        </button>
      </div>
    </div>
    <div class="title">属性</div>
    <div class="PropertiesBox" v-if="store.selectedElement">
      <div class="PropertiesOutfit">
        <div class="lab">类型</div>
        <div class="ipt">{{ store.selectedElement?.type }}</div>
      </div>
      <div class="PropertiesOutfit">
        <div class="lab">位置</div>
        <div class="ipt">
          <span>x</span>:
          <input 
            class="iptA"
            type="number" 
            v-model.number="store.selectedElement.x" 
            @input="updateAndSave"
          />
          <span>y</span>:
          <input 
            class="iptA"
            type="number" 
            v-model.number="store.selectedElement.y" 
            @input="updateAndSave"
          />
        </div> 
      </div>
      <div class="PropertiesOutfit">
        <div class="lab">大小</div>
        <div class="ipt">
          <span style="font-size: 12px;">宽</span>:
          <input 
            class="iptA"
            style="width: 44px;"
            type="number" 
            v-model.number="store.selectedElement.width" 
            @input="updateAndSave"
          />
          <span style="font-size: 12px;">高</span>:
          <input 
            class="iptA"
            style="width: 44px;"
            type="number" 
            v-model.number="store.selectedElement.height" 
            @input="updateAndSave"
          />
        </div>
      </div>
      <div class="PropertiesOutfit">
        <div class="lab">填充</div>
        <input 
          class="fill"
          type="color" 
          v-model="store.selectedElement.fill" 
          @input="updateAndSave"
        />
      </div>
    </div>
  </div>

</template>

<script setup name="toolbar">
  import { reactive,ref } from 'vue'
  import { useCanvasStore } from '../store/canvasStore'
  import { storeToRefs } from 'pinia'

  const store = useCanvasStore()
  const fileInput = ref(null)
  const init = reactive([
    {id:0, Enter:false, toggle:function(){init[0].Enter=!init[0].Enter}, option:'形状', icon:'&#xe636;'},
    // {id:1, Enter:false, toggle:function(){init[1].Enter=!init[1].Enter}, option:'画笔', icon:'&#xe606;'},
    {id:1, Enter:false, toggle:addText, option:'文字', icon:'&#xe620;'},
    // {id:3, Enter:false, toggle:function(){init[3].Enter=!init[3].Enter}, option:'导入', icon:'&#xe8ba;'},
  ])
  const options = reactive([
    {id:0, func:deleteSelected, option:'删除',icon:'&#xe67d;'},
    {id:1, func:clearCanvas, option:'清空',icon:'&#xe62a;'},
    {id:2, func:exportCanvas, option:'导出',icon:'&#xe60f;'},
  ])
  const Shapes = reactive([
    { Shape:'rect',icon:'&#xeb97;',id:0 },
    { Shape:'circle',icon:'&#xe629;',id:1 },
    { Shape:'triangle',icon:'&#xe652;',id:2 },
    { Shape:'roundRect',icon:'&#xe61d;',id:3 },
  ])
  const Properties = reactive([
    {Property:'类型',id:1},
    {Property:'位置',id:2},
    {Property:'大小',id:3},
    {Property:'填充',id:4},
  ])

  function addShape(type) {
    const baseElement = {
      type,
      x: 100 + store.elements.length * 20,
      y: 100 + store.elements.length * 20,
      width: 100,
      height: 100,
      fill: '#3498db',
      stroke: '#2c3e50',
      strokeWidth: 2,
      radius: 10
    }
    store.addElement(baseElement)
  }
  function triggerImageUpload() {
    fileInput.value?.click()
  }
  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        store.addElement({
          type: 'image',
          x: 100 + store.elements.length * 20,
          y: 100 + store.elements.length * 20,
          width: 200,
          height: 200,
          src: event.target.result,
          filter: 'none'
        })
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function addText() {
    store.addElement({
      type: 'text',
      x: 100 + store.elements.length * 20,
      y: 100 + store.elements.length * 20,
      width: 200,
      height: 50,
      content: '文字',
      fill: '#2c3e50',
      fontSize: 24,
      bold: false,
      fontFamily: 'Arial'
    })
  }

  function drawEnter(){
    const enter = document.querySelector('#draw');
    const font = document.querySelector('#drawFont')
    if (!enter) return;

    const isHoverStyle = enter.style.borderRadius === '6px';

    if (isHoverStyle) {
      enter.style.borderRadius = '';
      enter.style.backgroundColor = '';
      enter.style.boxShadow = '';
      enter.style.backgroundImage = '';
      font.style.color = '#53575D'
      store.painting = false
    } else {
      enter.style.borderRadius = '6px';
      enter.style.backgroundColor = '#fff';
      enter.style.boxShadow = '4px 4px 8px #d9dbdb';
      enter.style.backgroundImage = 'linear-gradient(to right, #00C4CC, #09B8CE)';
      font.style.color = '#fff'
      store.painting = true
    }
    // console.log(store.painting)
  }

  function deleteSelected() {
    if (store.selectedElement) {
      store.deleteElement(store.selectedElement.id)
    }
  }

  function clearCanvas() {
    if (confirm('确定要清空画布吗？')) {
      store.clearCanvas()
    }
  }
  function exportCanvas() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      if(confirm('确定要导出画布吗？')){
        const link = document.createElement('a')
        link.download = `${store.currentProject?.name || 'canvas'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    }
  }
  
</script>

<style scoped>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .toolbar{
    height: 100vh;
    width: 72px;
    padding-top: 55px;
    background-color: #F3F4F7;
    /* border: black solid 1px; */
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
  }
  .cube{
    padding-top: 10px;
    text-align: center;
    height: 72px;
    width: 72px;
    /* border: black solid 1px; */
  }
  .cube>button{
    appearance: none;
    display: block;
    padding-top: 10px;
    background-color: #F3F4F7;
    width: 72px;
    height: 60px;
    /* border-radius: 10px; */
    /* border: 1px solid black; */
    cursor: pointer;
    border: none;
    font-size: 11px;
    letter-spacing: 0.5px;
    font-weight: 600;
    color: #53575D;
    /* position: relative; */
  }
  .icon{
    margin: auto;
    width: 32px;
    height: 32px;
    padding-top: 4px;
    /* border: solid black 1px; */
    margin-bottom: 3px;
  }
  .el{
    width: 24px;
    height: 24px;
    color: #53575D;
  }
  .cube>button:hover .icon{
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 
        4px 4px 8px #d9dbdb;
        /* -2px -2px 4px #fafafd; */
    /* background-image: linear-gradient(145deg,#ffffff,#fafafd); */
    background-image: linear-gradient(to right,#00C4CC,#09B8CE);
  }
  .cube>button:hover .iconFont{
    color: #fff;
  }
  .option{
    height: 16px;
  }
  .EnterShape{
    position: fixed;
    top: 80px;
    left: 80px;
    background-color: #ffffff;
    width: 180px;
    height: 410px;
    border-radius: 10px;
    box-shadow: 4px 4px 8px rgba(220, 220, 220, 0.5),
                    -4px -4px 8px rgb(220, 220, 220,0.5);
  }
  .title{
    user-select: none;
    height: 30px;
    width: 160px;
    margin: auto;
    padding-top: 2px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #53575D;
    border-bottom: 1.2px solid #aaaaaa;
    margin-bottom: 10px;
  }
  .ShapeBox{
    height: 100px;
    /* background-color: #9a9a9a; */
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    flex-wrap: wrap;
  }
  .ShapeOutfit{
    width: 80px;
    height: 50px;
    /* background-color: #e6e6e6; */
    /* border: 1px solid black; */
    padding-top: 5px;
    padding-left: 20px;
  }
  .ShapeBtn{
    background-color: #fff;
    border: 1px solid #d3d5d6;
    border-radius: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  .ShapeBtn:hover{
    background-image: linear-gradient(to right,#00C4CC,#09B8CE);
  }
  .ShapeBtn:hover #iconShape{
    color: #fff
  }
  .PropertiesBox{
    height: 200px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    /* background-color: #9a9a9a; */
  }
  .PropertiesOutfit{
    width: 160px;
    height: 50px;
    margin-bottom: 5px;
    /* background-color: #e6e6e6; */
    /* border: 1px solid black; */
  }
  .lab{
    height: 18px;
    font-size:12px;
    color: #53575D;
    font-weight: 500;
    text-indent: 2px;
    letter-spacing: 0.5px;
  }
  .ipt{
    font-weight: 500;
    text-indent: 2px; 
    font-size: 15px; 
    height: 32px;
    color: #2b2b2b;
  }
  .iptA{
    font-weight: 500;
    text-indent: 1px; 
    font-size: 13px; 
    height: 18px;
    width: 48px;
    color: #2b2b2b;
    margin-right: 10px;
  }
  .fill{
    border: none;
    width: 144px;
  }
</style>