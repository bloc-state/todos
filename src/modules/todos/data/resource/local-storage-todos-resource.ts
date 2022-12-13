import { ObservableResource } from "../../../modules-common/observable-resource"
import { Todo } from "../../domain"
import { TodosResource } from "./todos-resource"

export class LocalStorageTodosResource
  extends ObservableResource<Todo[]>
  implements TodosResource
{
  constructor() {
    super([])
    this.init()
  }

  init() {
    const todos = localStorage.getItem("todos")
    if (todos != null) {
      this.emit(JSON.parse(todos))
    }
  }

  getTodo = async (id: string) => {
    const todo = this.state.find((todo) => todo.id === id)

    if (!todo) {
      throw new TodoNotFoundException()
    }

    return todo
  }

  getTodos = () => this.state$

  saveTodo = async (todo: Todo) => {
    const todos = [...this.state]
    const id = todo.id
    const todoIndex = todos.findIndex((todo) => todo.id === id)
    if (todoIndex >= 0) {
      todos[todoIndex] = todo
    } else {
      todos.push(todo)
    }
    this.emit(todos)
    return localStorage.setItem("todos", JSON.stringify(todos))
  }

  deleteTodo = async (id: string) => {
    const todos = [...this.state]
    const todoIndex = todos.findIndex((todo) => todo.id === id)
    if (todoIndex === -1) {
      throw new TodoNotFoundException()
    } else {
      todos.splice(todoIndex, 1)
      this.emit(todos)
      return localStorage.setItem("todos", JSON.stringify(todos))
    }
  }

  async clearCompleted() {
    const todos = [...this.state]
    const completedTodosAmount = todos.filter((todo) => todo.isCompleted).length
    const newTodos = todos.filter((todo) => !todo.isCompleted)
    this.emit(newTodos)
    await localStorage.setItem("todos", JSON.stringify(newTodos))
    return completedTodosAmount
  }

  async completeAll(isCompleted: boolean) {
    const todos = [...this.state]
    const changedTodosAmount = todos.filter(
      (todo) => todo.isCompleted !== isCompleted,
    ).length
    const newTodos = todos.map((todo) => ({ ...todo, isCompleted }))
    this.emit(newTodos)
    await localStorage.setItem("todos", JSON.stringify(newTodos))
    return changedTodosAmount
  }
}

export class TodoNotFoundException extends Error {}
