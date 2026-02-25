<template>
  <bg></bg>
  <Navigate></Navigate>
  <toolbar></toolbar>
  <propertiesPanel></propertiesPanel>
</template>

<script lang="ts" setup name="App">
  import bg from './components/canvas.vue';
  import Navigate from './components/navigate.vue';
  import toolbar from './components/toolbar.vue';
  import propertiesPanel from './components/propertiesPanel.vue'
</script>

<style>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body{
    background-color: #F3F4F7;
  }
</style>
