<template>
    <!-- 제목 -->
    <header>
        <h3>To Do List✔️</h3>
    </header>
    <!-- 입력 -->
    <div class="inputBox shadow">
        <input type="text" v-model="NewTodo" placeholder="할 일을 입력해 주세요" @keyup.enter="AddTodo()">
        <span class="addContainer" @click="AddTodo()">
            <i class="far fa-plus addBtn" aria-hidden="true"></i>
        </span>
    </div>
    <!-- 출력 -->
    <div class="MainTodoBox">
        <TransitionGroup name="list" tag="ul">
            <li class='TodoList' v-for="(Todo, index) in TodoList" :key="Todo.id">
                <span class="checkBtn" type="button" @click="CheckTodo(index)">
                    <i class="far fa-check" aria-hidden="true"></i>
                </span>
                <span class="Todo" >{{ Todo.Todo }}</span>
            </li>
        </TransitionGroup>
    </div>
</template>

<script>
    export default {
        emits: [
            'AddTodoBt',
            'CheckTodoBt'
        ],
        data() {
            return {
                NewTodo: '',
                TodoList: []
            }
        },
        mounted() {
            this.loadTodoList();
        },
        methods: {
            loadTodoList() {
                var savetodolist = localStorage.getItem('todolist');
                this.TodoList = (savetodolist) ? JSON.parse(savetodolist) : [];
            },
            AddTodo() {
                this.$emit("AddTodoBt", this.NewTodo)
                this.NewTodo="";
                this.loadTodoList();
            },
            CheckTodo(index) {
                this.$emit("CheckTodoBt", index)
                this.loadTodoList();
            }
        }
    }

</script>

<style>
    input {
        border-style: groove;
        width: 200px;
    }
    button {
        border-style: groove;
    }
    .shadow {
        box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.03);
    }
    input:focus {
        outline: none;
    }
    .inputBox {
        width: 100%;
        background: white;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        margin:0 auto; 
    }
    .inputBox input {
        float: left;
        width: calc(100% - 50px);
        height: 100%;
        border-style: none;
        font-size: 0.8rem;
        padding : 0;
        text-align: center;
    }
    .addContainer {
        float: right;
        background: rgb(200, 200, 200);
        display: block;
        width: 35px;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
    }
    .addBtn {
        color: white;
        vertical-align: middle;
    }
    ul {
        width: 100%;
        list-style-type: none;
        padding-left: 0;
        margin-top: 0;
        text-align: left;
        margin:0 auto; 
    }
    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }
    .list-enter-from, .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .TodoList {
        display: flex;
        min-height: 35px;
        height: 35px;
        line-height: 35px;
        margin: 0.5rem 0;
        padding: 0 0.9rem;
        background: white;
        border-radius: 5px;
    }
    .TodoList .checkBtn {
        color: #62acde;
        margin-right: 15px;
        cursor: pointer;
    }
    .Todo {
        margin-right: auto;
    }
    .MainTodoBox {
        height: 350px;
        overflow: scroll;
    }
    .MainTodoBox::-webkit-scrollbar {
        display:none;
    }
</style>