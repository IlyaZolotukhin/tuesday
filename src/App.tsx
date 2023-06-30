import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListsType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TaskStateType = {
    [todoListId: string]: Array<TaskType>
}

function App() {
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    let [todoLists, setTodoLists] = useState<Array<TodoListsType>>(
        [
            {id: todoListId_1, title: 'What to learn', filter: 'all'},
            {id: todoListId_2, title: 'What to buy', filter: 'all'},
        ]
    )
    let [tasks, setTasks] = useState<TaskStateType>({
        [todoListId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todoListId_2]: [
            {id: v1(), title: "Ice Cream", isDone: true},
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Water", isDone: false},
            {id: v1(), title: "Beer", isDone: false},
            {id: v1(), title: "Meat", isDone: false},
        ]
    });

    function changeTodoListFilter(value: FilterValuesType, todoListId: string) {
        const updateTodoLists: Array<TodoListsType> =
            todoLists.map(tl => tl.id === todoListId ? {...tl, filter: value} : tl)
        setTodoLists(updateTodoLists)
    }

    function removeTask(id: string, todoListId: string) {
        const tasksForTodoList: Array<TaskType> = tasks[todoListId]
        const updatedTasks: Array<TaskType> = tasksForTodoList.filter((t) => t.id !== id)
        const copyTasks: TaskStateType = {...tasks}
        copyTasks[todoListId] = updatedTasks
        setTasks(copyTasks)
        /* ИЛИ
        setTasks({...tasks, [todoListId]: tasks[todoListId].filter((t)=> t.id !==id)})*/
    }

    function addTask(title: string, todoListId: string) {
        const tasksForTodoList: Array<TaskType> = tasks[todoListId]
        const newTask: TaskType = {id: v1(), title: title, isDone: false};
        const updatedTasks: Array<TaskType> = [newTask, ...tasksForTodoList]
        const copyTasks: TaskStateType = {...tasks}
        copyTasks[todoListId] = updatedTasks
        setTasks(copyTasks)
        /* ИЛИ const newTask: TaskType = {id: v1(), title: title, isDone: false};
        setTasks({...tasks, [todoListId]: [newTask,...tasks[todoListId]]})*/
    }

    function changeStatus(taskId: string, isDone: boolean, todoListId: string) {
        const tasksForTodoList: Array<TaskType> = tasks[todoListId]
        const updatedTasks: Array<TaskType> = tasksForTodoList.map(t => t.id === taskId ? {...t, isDone: isDone} : t)
        const copyTasks: TaskStateType = {...tasks}
        copyTasks[todoListId] = updatedTasks
        setTasks(copyTasks)
        /* ИЛИ setTasks({...tasks, [todoListId]: tasks[todoListId].map(t=> t.id === taskId ?
        {...t, isDone: isDone}: t)});*/
    }

    const removeTodoList = (todoListId: string) => {
        const updateTodoLists: Array<TodoListsType> = todoLists.filter(tl => tl.id !== todoListId)
        setTodoLists(updateTodoLists)
        delete tasks[todoListId]
    }


    const getFilteredTasks = (allTasks: Array<TaskType>,
                              currentFilterValue: FilterValuesType): Array<TaskType> => {
        switch (currentFilterValue) {
            case "completed":
                return allTasks.filter(t => t.isDone)
            case "active":
                return allTasks.filter(t => !t.isDone)
            default:
                return allTasks
        }
    }
    const todoListsComponents: Array<JSX.Element> = todoLists.map((tl) => {
        const filteredTasks: Array<TaskType> = getFilteredTasks(tasks[tl.id], tl.filter)
        return (
            <Todolist key={tl.id}
                      todoListId={tl.id}
                      title={tl.title}
                      filter={tl.filter}
                      tasks={filteredTasks}
                      addTask={addTask}
                      removeTask={removeTask}
                      removeTodoList={removeTodoList}
                      changeFilter={changeTodoListFilter}
                      changeTaskStatus={changeStatus}
            />
        )
    })
    return (
        <div className="App">
            {todoListsComponents}
        </div>
    );
}

export default App;
