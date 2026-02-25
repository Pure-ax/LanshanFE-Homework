<template>
    <bg></bg>
    <!-- <Navigate></Navigate> -->
    <toolbar></toolbar>
    <propertiesPanel></propertiesPanel>
</template>

<script setup>
    import { useCanvasStore } from '../store/canvasStore'
    import { onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import bg from '../components/canvas.vue'
    import Navigate from '../components/navigate.vue';
    import toolbar from '../components/toolbar.vue';
    import propertiesPanel from '../components/propertiesPanel.vue'

    const store = useCanvasStore()
    const route = useRoute()

    onMounted(() => {
    if (route.params.id) {
        store.openProject(route.params.id)
    } else {
        const project = store.createProject('未命名项目')
        store.openProject(project.id)
    }
    })
</script>

<style scoped>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body{
    background-color: #F3F4F7;
  }
</style>