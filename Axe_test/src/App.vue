<template>
    <div class="navigate">
        <div class="nav1"> 
            <button class="admin" title="个人(ToDoList...)">
                    <UserFilled class="el"/>
            </button>
            <router-link to="/">
                <button class="home" title="首页(ToDoList...)">
                    <House class="el"/>
                </button>
            </router-link>
            <router-link to="/editor">
                <button class="colorChange" title="创建(ToDoList...)">
                    <CirclePlus class="el"/>
                </button>
            </router-link>
            <button class="together" title="协同(ToDoList...)">
                <OfficeBuilding class="el"/>
                <div></div>
            </button>
        </div>
        <div class="nav2">
            <div class="LineBox"><div class="line"></div></div>
            <button class="back" title="ToDoList...">
                <CaretLeft class="el"/>
            </button>
            <button class="next" title="ToDoList...">
                <CaretRight class="el"/>
            </button>
            <div class="LineBox"><div class="line"></div></div>
        </div>
        <div class="nav3">
            <button class="save" title="保存" @click="saveProject">
                <UploadFilled class="el"/>
            </button>
        </div>
        <div class="Axe">Axe</div>
    </div>
    <router-view></router-view>
</template>

<script setup name="Navigate">
    import { useCanvasStore } from './store/canvasStore'
    const store = useCanvasStore()

    function saveProject() {
        store.saveCurrentProject()
        alert('保存成功！')
    }

</script>

<style scoped>
    .navigate{
        width: 100vw;
        height: 56px;
        background-image: linear-gradient(to right,#00C4CC,#7C2AE8);
        position: fixed;
        z-index: 3;
        display: flex;
        top: 0;
        left: 0;
    }
    .el{
        width: 24px;
        height: 24px;
        color: #ffffff; 
    }
    .Axe{
        user-select: none;
        color: #ffffff;
        height: 56px;
        width: 56px;
        text-align: center;
        line-height: 52px;
        letter-spacing: 1px;
        font-size: 32px;
        font-weight: 600;
        position: absolute;
        left: 750px;
        transform: translateX(-50%);
        /* margin: auto; */
    }
    .nav1{
        height: 56px;
        width: 336px;
        /* border: 1px solid black; */
        padding-left: 2px;
    }
    .nav2{
        height: 56px;
        width: 96px;
        /* border: 1px solid black; */
        display: flex;
        /* margin-left: 24px; */
    }
    .nav3{
        height: 56px;
        width: 72px;
        /* border: 1px solid black; */
    }
    button{
        appearance: none;
        border: none;
        cursor: pointer;
    }
    .admin,.home,.colorChange,.save{
        height: 40px;
        width: 56px;
        margin: 8px 6px;
        background-color: #ffffff00;
        border-radius: 6px;
        /* border: 1px solid black; */
    }
    .admin:hover,.home:hover,.colorChange:hover,.save:hover,.back:hover,.next:hover,.together:hover{
        background-color: #ffffff30;
    }
    .back,.next{
        height: 40px;
        width: 56px;
        margin-top: 8px ;
        background-color: #ffffff00;
        border-radius: 6px;
        /* border: 1px solid black; */
    }
    .together{
        height: 40px;
        width: 112px;
        margin: 8px;
        background-color: #ffffff00;
        border-radius: 6px;
        /* border: 1px solid black; */
    }
    .LineBox{
        height: 56px;
        width: 16px;
    }
    .line{
        height: 18px;
        width: 1px;
        background-color: #ffffff50;
        margin: 18px auto;
        border-radius: 50%;
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