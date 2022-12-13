import { Todo } from "../../domain/model";
import { TodosRepository } from "../../domain/repository/todos-repository";
import type { TodosResource } from "../resource";

export type TodosRepositoryProps = {
  todosResource: TodosResource;
};

export class TodosRepositoryImpl implements TodosRepository {
  #todosResource: TodosResource

  constructor ( { todosResource }: TodosRepositoryProps ) {
    this.#todosResource = todosResource
  }

  getTodos = () => this.#todosResource.getTodos();

  getTodo = (id: string) => this.#todosResource.getTodo(id);

  completeAll = async (isCompleted: boolean) =>
    await this.#todosResource.completeAll(isCompleted);

  clearCompleted = async () => await this.#todosResource.clearCompleted();

  saveTodo = async (todo: Todo) => await this.#todosResource.saveTodo(todo);

  deleteTodo = async (id: string) => await this.#todosResource.deleteTodo(id);
}
