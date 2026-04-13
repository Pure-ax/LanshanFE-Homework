import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Gallery from '../views/Gallery.vue'

const routes = [
  {
    path: '/',
    name: 'Gallery',
    component: Gallery,
    meta: { title: 'Gallery' }
  },
  {
    path: '/editor/:id?',
    name: 'Editor',
    component: Main,
    meta: { title: 'Axe' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
