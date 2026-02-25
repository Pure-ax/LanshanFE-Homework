<template>
  <div class="propertiesPanel">
    <h3>属性</h3>
    
    <div v-if="store.selectedElement" class="propertiesContent">
      <div class="propGroup">
        <label>类型</label>
        <span class="propValue">{{ store.selectedElement.type }}</span>
      </div>
      
      <div class="propGroup">
        <label>位置 X</label>
        <input 
          type="number" 
          v-model.number="store.selectedElement.x" 
          @input="updateAndSave"
        />
      </div>
      
      <div class="propGroup">
        <label>位置 Y</label>
        <input 
          type="number" 
          v-model.number="store.selectedElement.y" 
          @input="updateAndSave"
        />
      </div>
      
      <div class="propGroup">
        <label>宽度</label>
        <input 
          type="number" 
          v-model.number="store.selectedElement.width" 
          @input="updateAndSave"
        />
      </div>
      
      <div class="propGroup">
        <label>高度</label>
        <input 
          type="number" 
          v-model.number="store.selectedElement.height" 
          @input="updateAndSave"
        />
      </div>
      
      <div class="propGroup">
        <label>填充色</label>
        <input 
          type="color" 
          v-model="store.selectedElement.fill" 
          @input="updateAndSave"
        />
      </div>
      
      <div v-if="store.selectedElement.type === 'image'" class="propGroup">
        <label>滤镜</label>
        <select v-model="store.selectedElement.filter" @change="updateAndSave">
          <option value="none">无</option>
          <option value="grayscale(100%)">黑白</option>
          <option value="sepia(100%)">复古</option>
          <option value="blur(4px)">模糊</option>
          <option value="brightness(150%)">增亮</option>
          <option value="contrast(150%)">高对比</option>
          <option value="hue-rotate(90deg)">色相旋转</option>
        </select>
      </div>
      
      <div v-if="store.selectedElement.type === 'text'">
        <div class="propGroup">
          <label>内容</label>
          <textarea 
            v-model="store.selectedElement.content" 
            @input="updateAndSave"
            rows="3"
          ></textarea>
        </div>
        
        <div class="propGroup">
          <label>字号</label>
          <input 
            type="number" 
            v-model.number="store.selectedElement.fontSize" 
            @input="updateAndSave"
          />
        </div>
        
        <div class="propGroup">
          <label>加粗</label>
          <input 
            type="checkbox" 
            v-model="store.selectedElement.bold" 
            @change="updateAndSave"
          />
        </div>
        
        <div class="propGroup">
          <label>字体</label>
          <select v-model="store.selectedElement.fontFamily" @change="updateAndSave">
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Microsoft YaHei">微软雅黑</option>
          </select>
        </div>
      </div>
    </div>
    
    <div v-else class="emptyState">
      <p>选择元素以编辑属性</p>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from '../store/canvasStore'

const store = useCanvasStore()

function updateAndSave() {
  if (store.selectedElement) {
    store.updateElement(store.selectedElement.id, store.selectedElement)
  }
}
</script>

<style scoped>
.propertiesPanel {
  width: 280px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  position: fixed;
  z-index: 2;
  right: 0;
  top: 56px;
}

.propertiesPanel h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.propertiesContent {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.propGroup {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.propGroup label {
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 500;
}

.propGroup input[type="number"],
.propGroup input[type="text"],
.propGroup select,
.propGroup textarea {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.propGroup input:focus,
.propGroup select:focus,
.propGroup textarea:focus {
  outline: none;
  border-color: #3498db;
}

.propGroup input[type="color"] {
  width: 100%;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}

.propGroup input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.propValue {
  color: #2c3e50;
  font-weight: 500;
}

.emptyState {
  text-align: center;
  color: #95a5a6;
  padding: 40px 20px;
}
</style>
