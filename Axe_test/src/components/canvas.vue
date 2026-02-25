<template>
    <div class="bg" ref="container" @wheel="handleWheel">
        <div class="block">
            <canvas 
              class="canvas"
              ref="canvas"
              @mousedown="handleMouseDown($event);DrawMousedown($event)"
              @mousemove="handleMouseMove($event);DrawMousemove($event)"
              @mouseup="handleMouseUp($event);DrawMouseup($event)"
              @mouseleave="handleMouseUp"
            ></canvas>
        </div>
    </div>
</template>

<script setup name="bg">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useCanvasStore } from '../store/canvasStore'
  import { storeToRefs } from 'pinia'

    const store = useCanvasStore()
    const canvas = ref(null)
    const container = ref(null)
    const ctx = ref(null)

    // 图片缓存
    const imageCache = new Map()

    // 拖拽状态
    const isDragging = ref(false)
    const isPanning = ref(false)
    const dragStart = ref({ x: 0, y: 0 })
    const panStart = ref({ x: 0, y: 0 })

    onMounted(() => {
        initCanvas()
        loadImages()
        render()
    })

    onUnmounted(() => {
    })

    // 监听元素变化自动重绘
    watch(() => store.elements, () => {
        loadImages()
        render()
    }, { deep: true })

    watch(() => store.canvasConfig, () => {
        render()
    }, { deep: true })

    function initCanvas() {
        const c = canvas.value
        c.width = store.canvasConfig.width
        c.height = store.canvasConfig.height
        ctx.value = c.getContext('2d')
    }

    // 预加载图片
    function loadImages() {
        store.elements.forEach(el => {
            if (el.type === 'image' && el.src && !imageCache.has(el.id)) {
            const img = new Image()
            img.src = el.src
            img.onload = () => {
                imageCache.set(el.id, img)
                render()
            }
            }
        })
    }

    function render() {
    const context = ctx.value
    const c = canvas.value
    
    // 清空画布
    context.clearRect(0, 0, c.width, c.height)
    
    // 绘制背景网格
    drawGrid(context)
    
    context.save()
    context.translate(store.canvasConfig.offsetX, store.canvasConfig.offsetY)
    context.scale(store.canvasConfig.scale, store.canvasConfig.scale)
    
    // 绘制所有元素
    store.elements.forEach(element => {
        drawElement(context, element)
    })
    
    // 绘制选中框
    if (store.selectedElement) {
        drawSelectionBox(context, store.selectedElement)
    }
    
    context.restore()
    }

    function drawGrid(context) {
        const gridSize = 20
        context.strokeStyle = '#e8e8e8'
        context.lineWidth = 0.5
        
        for (let x = 0; x < canvas.value.width; x += gridSize) {
            context.beginPath()
            context.moveTo(x, 0)
            context.lineTo(x, canvas.value.height)
            context.stroke()
        }
        
        for (let y = 0; y < canvas.value.height; y += gridSize) {
            context.beginPath()
            context.moveTo(0, y)
            context.lineTo(canvas.value.width, y)
            context.stroke()
        }
    }

    function drawElement(context, element) {
        context.fillStyle = element.fill
        context.strokeStyle = element.stroke || '#2c3e50'
        context.lineWidth = element.strokeWidth || 2
        
        context.beginPath()
        
        switch (element.type) {
            case 'rect':
            context.rect(element.x, element.y, element.width, element.height)
            break
            
            case 'roundRect':
            context.roundRect(element.x, element.y, element.width, element.height, element.radius || 10)
            break
            
            case 'circle':
            context.ellipse(
                element.x + element.width / 2,
                element.y + element.height / 2,
                element.width / 2,
                element.height / 2,
                0, 0, Math.PI * 2
            )
            break
            
            case 'triangle':
            context.moveTo(element.x + element.width / 2, element.y)
            context.lineTo(element.x, element.y + element.height)
            context.lineTo(element.x + element.width, element.y + element.height)
            context.closePath()
            break
            
            case 'image':
            const img = imageCache.get(element.id)
            if (img) {
                context.save()
                if (element.filter && element.filter !== 'none') {
                context.filter = element.filter
                }
                context.drawImage(img, element.x, element.y, element.width, element.height)
                context.restore()
            }
            return
            
            case 'text':
            context.font = `${element.bold ? 'bold ' : ''}${element.fontSize || 24}px ${element.fontFamily || 'Arial'}`
            context.fillStyle = element.fill
            context.textBaseline = 'top'
            const lines = (element.content || '').split('\n')
            lines.forEach((line, i) => {
                context.fillText(line, element.x, element.y + i * (element.fontSize || 24) * 1.2)
            })
            return
        }
        
        context.fill()
        context.stroke()
    }

    function drawSelectionBox(context, element) {
        context.strokeStyle = '#3498db'
        context.lineWidth = 2
        context.setLineDash([5, 5])
        context.strokeRect(
            element.x - 4,
            element.y - 4,
            element.width + 8,
            element.height + 8
        )
        context.setLineDash([])
    }

    function getMousePos(e) {
        const rect = canvas.value.getBoundingClientRect()
        return {
            x: (e.clientX - rect.left - store.canvasConfig.offsetX) / store.canvasConfig.scale,
            y: (e.clientY - rect.top - store.canvasConfig.offsetY) / store.canvasConfig.scale
        }
    }

    function isPointInElement(pos, element) {
        if (element.type === 'circle') {
            const centerX = element.x + element.width / 2
            const centerY = element.y + element.height / 2
            const dx = pos.x - centerX
            const dy = pos.y - centerY
            return dx * dx + dy * dy <= (element.width / 2) * (element.width / 2)
        }
        
        return (
            pos.x >= element.x &&
            pos.x <= element.x + element.width &&
            pos.y >= element.y &&
            pos.y <= element.y + element.height
        )
    }

    function handleMouseDown(e) {
        const pos = getMousePos(e)
        
        // 从后往前查找点击的元素
        const clicked = [...store.elements].reverse().find(el => isPointInElement(pos, el))
        
        if (clicked) {
            store.selectElement(clicked)
            isDragging.value = true
            dragStart.value = {
            x: pos.x - clicked.x,
            y: pos.y - clicked.y
            }
        } else {
            store.selectElement(null)
            isPanning.value = true
            panStart.value = {
            x: e.clientX - store.canvasConfig.offsetX,
            y: e.clientY - store.canvasConfig.offsetY
            }
        }
        
        render()
    }

    function handleMouseMove(e) {
        if (isDragging.value && store.selectedElement) {
            const pos = getMousePos(e)
            store.updateElement(store.selectedElement.id, {
            x: pos.x - dragStart.value.x,
            y: pos.y - dragStart.value.y
            })
            render()
        } else if (isPanning.value) {
            store.updateCanvasConfig({
            offsetX: e.clientX - panStart.value.x,
            offsetY: e.clientY - panStart.value.y
            })
            render()
        }
    }

    function handleMouseUp() {
        isDragging.value = false
        isPanning.value = false
    }

        function handleWheel(e) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newScale = Math.min(Math.max(store.canvasConfig.scale * delta, 0.2), 5)
        store.updateCanvasConfig({ scale: newScale })
        render()
    }

    const { painting } = storeToRefs(store)
    let startPoint = { x:undefined, y:undefined }
    let Enter = false

    function DrawMousedown(e){
 
        let x = e.offsetX
        let y = e.offsetY
        startPoint = { x:x, y:y }
        if(painting.value){
            isDragging.value = false
            isPanning.value = false
            Enter = true
        }
    }
    function DrawMousemove(e){
        
        // console.log(painting.value)
        let x = e?.offsetX
        let y = e?.offsetY
        let newPoint = { x:x, y:y }
        if(Enter){
            drawLine(startPoint.x,startPoint.y,newPoint.x,newPoint.y)
            startPoint = newPoint
            isDragging.value = false
            isPanning.value = false
        }
    }
    function DrawMouseup(e){
        Enter = false
    }
    function drawLine(xStart,yStart,xEnd,yEnd){
        ctx.value.beginPath()
        ctx.value.strokeStyle = 'black'
        ctx.value.lineWidth = 1 * devicePixelRatio
        ctx.value.moveTo(xStart,yStart)
        ctx.value.lineTo(xEnd,yEnd)
        ctx.value.stroke()
        ctx.value.closePath()
    }

    // clear.onclick = () => {
    //     ctx.fillStyle = '#ffffff'
    //     ctx.fillRect(0,0,canvas.width,canvas.height)
    // }
</script>

<style scoped>
    .bg{  
        background-color: #F3F4F7;
        position: absolute;
        z-index: -1;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
    }
    .block{
        background: #F3F4F7;
        position: relative;
        z-index: 0;
        width: 100vw;
        height: 100vh;
        /* top: 28px; */
        left: 36px;
    }
    .canvas{
        background-color: #fff;
        position: absolute;
        top: 48%;
        left: 42%;
        transform: translate(-50%,-50%);
        width: 800px;
        height: 600px;
        box-shadow: 4px 4px 8px rgba(220, 220, 220, 0.5),
                    -4px -4px 8px rgb(220, 220, 220,0.5);
    }
    canvas:hover{
        outline: solid 2px #8B3DFF;
    }
</style>