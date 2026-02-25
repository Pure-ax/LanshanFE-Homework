import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'canvas_projects'

export const useCanvasStore = defineStore('canvas', () => {
  // 项目列表
  const projects = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  
  // 当前编辑的项目 ID
  const currentProjectId = ref(null)
  
  // 当前画布元素
  const elements = ref([])
  
  // 选中元素
  const selectedElement = ref(null)
  
  // 画布配置
  const canvasConfig = ref({
    width: 800,
    height: 600,
    scale: 1,
    offsetX: 0,
    offsetY: 0
  })
  
  // 画笔开关
  const painting = ref(false)
  function paintingChange(){
    painting.value = !painting.value
  }

  // 计算属性 - 当前项目
  const currentProject = computed(() => {
    return projects.value.find(p => p.id === currentProjectId.value)
  })

  // 保存项目到 localStorage
  function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
  }

  // 创建新项目
  function createProject(name = '未命名项目') {
    const project = {
      id: Date.now().toString(),
      name,
      elements: [],
      canvasConfig: { ...canvasConfig.value },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects.value.push(project)
    saveProjects()
    return project
  }

  // 打开项目
  function openProject(projectId) {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      currentProjectId.value = projectId
      elements.value = JSON.parse(JSON.stringify(project.elements))
      canvasConfig.value = { ...project.canvasConfig }
    }
  }

  // 保存当前项目
  function saveCurrentProject() {
    if (!currentProjectId.value) return
    
    const project = projects.value.find(p => p.id === currentProjectId.value)
    if (project) {
      project.elements = JSON.parse(JSON.stringify(elements.value))
      project.canvasConfig = { ...canvasConfig.value }
      project.updatedAt = new Date().toISOString()
      saveProjects()
    }
  }

  // 删除项目
  function deleteProject(projectId) {
    projects.value = projects.value.filter(p => p.id !== projectId)
    saveProjects()
    if (currentProjectId.value === projectId) {
      currentProjectId.value = null
      elements.value = []
    }
  }

  // 添加元素
  function addElement(element) {
    const newElement = {
      id: Date.now().toString(),
      ...element
    }
    elements.value.push(newElement)
    selectedElement.value = newElement
    saveCurrentProject()
    return newElement
  }

  // 更新元素
  function updateElement(id, updates) {
    const element = elements.value.find(e => e.id === id)
    if (element) {
      Object.assign(element, updates)
      saveCurrentProject()
    }
  }

  // 删除元素
  function deleteElement(id) {
    elements.value = elements.value.filter(e => e.id !== id)
    if (selectedElement.value?.id === id) {
      selectedElement.value = null
    }
    saveCurrentProject()
  }

  // 选择元素
  function selectElement(element) {
    selectedElement.value = element
  }

  // 清空画布
  function clearCanvas() {
    elements.value = []
    selectedElement.value = null
    saveCurrentProject()
  }

  // 更新画布配置
  function updateCanvasConfig(config) {
    Object.assign(canvasConfig.value, config)
    saveCurrentProject()
  }

  return {
    projects,
    currentProjectId,
    currentProject,
    elements,
    selectedElement,
    canvasConfig,
    painting,
    createProject,
    openProject,
    saveCurrentProject,
    deleteProject,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    clearCanvas,
    updateCanvasConfig
  }
})
