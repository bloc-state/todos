import { Observable } from "rxjs"
import { Todo } from "../model"

export abstract class TodosRepository {
  abstract getTodos(): Observable<Todo[]>
  abstract saveTodo(todo: Todo): Promise<void>
  abstract deleteTodo(id: string): Promise<void>
  abstract getTodo(id: string): Promise<Todo>
  abstract completeAll(isCompleted: boolean): Promise<number>
  abstract clearCompleted(): Promise<number>
}
