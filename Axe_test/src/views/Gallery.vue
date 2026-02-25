<template>
  <div class="gallery">
    <h1>我的项目</h1>
    <div class="project-list">
      <div 
        v-for="project in store.projects" 
        :key="project.id"
        class="project-card"
        @click="openProject(project.id)"
      >
        <div class="project-info">
          <h3>{{ project.name }}</h3>
          <p>元素数量：{{ project.elements.length }}</p>
          <p class="date">更新于：{{ formatDate(project.updatedAt) }}</p>
        </div>
        <div class="project-actions">
          <button @click.stop="editProject(project.id)">编辑</button>
          <button class="danger" @click.stop="deleteProject(project.id)">删除</button>
        </div>
      </div>
      
      <div v-if="store.projects.length === 0" class="empty-state">
        <p>暂无项目，点击右下角创建新项目</p>
      </div>
    </div>
    
    <button class="fab" @click="createNewProject">+</button>
  </div>
</template>

<script setup>
import { useCanvasStore } from '../store/canvasStore'
import { useRouter } from 'vue-router'

const store = useCanvasStore()
const router = useRouter()

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function createNewProject() {
  const name = prompt('请输入项目名称:', '未命名项目')
  if (name) {
    const project = store.createProject(name)
    router.push(`/editor/${project.id}`)
  }
}

function openProject(projectId) {
  store.openProject(projectId)
  router.push(`/editor/${projectId}`)
}

function editProject(projectId) {
  store.openProject(projectId)
  router.push(`/editor/${projectId}`)
}

function deleteProject(projectId) {
  if (confirm('确定要删除这个项目吗？')) {
    store.deleteProject(projectId)
  }
}
</script>

<style scoped>
.gallery {
  padding: 40px;
  max-width: 1200px;
  margin: 60px auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.project-info h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.project-info p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 5px 0;
}

.date {
  font-size: 12px !important;
}

.project-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.project-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.project-actions button:first-child {
  background: #3498db;
  color: white;
}

.project-actions button:first-child:hover {
  background: #2980b9;
}

.project-actions button.danger {
  background: #e74c3c;
  color: white;
}

.project-actions button.danger:hover {
  background: #c0392b;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px;
  color: #95a5a6;
}

.fab {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  border: none;
  font-size: 32px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.4);
  transition: transform 0.2s;
}

.fab:hover {
  transform: scale(1.1);
}
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
body{
    background-color: #F3F4F7;
}
</style>
