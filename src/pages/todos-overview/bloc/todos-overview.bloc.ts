import { Bloc, Emitter } from "@bloc-state/bloc"
import { TodosRepository } from "../../../modules/todos/domain/repository"

import {
  TodosOverviewClearCompletedRequested,
  TodosOverviewEvent,
  TodosOverviewFilterChanged,
  TodosOverviewSubscriptionRequested,
  TodosOverviewTodoCompletionToggled,
  TodosOverviewTodoDeleted,
  TodosOverviewToggleAllRequested,
  TodosOverviewUndoDeletionRequested,
} from "./todos-overview.event"
import { TodosOverviewState } from "./todos-overview.state"

type TodosOverviewBlocProps = {
  todosRepository: TodosRepository
}

export class TodosOverviewBloc extends Bloc<
  TodosOverviewEvent,
  TodosOverviewState
> {
  #todosRepository: TodosRepository

  constructor({ todosRepository }: TodosOverviewBlocProps) {
    super(new TodosOverviewState())

    this.#todosRepository = todosRepository

    this.on(TodosOverviewSubscriptionRequested, this.onSubscriptionRequested)
    this.on(TodosOverviewTodoCompletionToggled, this.onTodoCompletionToggled)
    this.on(TodosOverviewFilterChanged, this.onFilterChanged)
    this.on(TodosOverviewToggleAllRequested, this.onToggleAllRequested)
    this.on(
      TodosOverviewClearCompletedRequested,
      this.onClearCompletedRequested,
    )
    this.on(TodosOverviewTodoDeleted, this.onTodoDeleted)
    this.on(TodosOverviewUndoDeletionRequested, this.onUndoDeletionRequsted)
  }

  private async onUndoDeletionRequsted(
    event: TodosOverviewUndoDeletionRequested,
    emit: Emitter<TodosOverviewState>,
  ) {
    const todo = this.state.data.lastDeletedTodo

    if (!todo) {
      return
    }

    await this.#todosRepository.saveTodo(todo)
    emit((state) =>
      state.ready((data) => {
        data.lastDeletedTodo = undefined
      }),
    )
  }

  private async onTodoDeleted(
    event: TodosOverviewTodoDeleted,
    emit: Emitter<TodosOverviewState>,
  ) {
    await this.#todosRepository.deleteTodo(event.todo.id)
    emit((state) =>
      state.ready((data) => {
        data.lastDeletedTodo = event.todo
      }),
    )
  }

  private async onClearCompletedRequested(
    event: TodosOverviewClearCompletedRequested,
    emit: Emitter<TodosOverviewState>,
  ) {
    await this.#todosRepository.clearCompleted()
  }

  private async onToggleAllRequested(
    event: TodosOverviewToggleAllRequested,
    emit: Emitter<TodosOverviewState>,
  ): Promise<void> {
    const areAllCompleted = this.state.data.todos.every(
      (todo) => todo.isCompleted,
    )
    await this.#todosRepository.completeAll(!areAllCompleted)
  }

  private onFilterChanged(
    event: TodosOverviewFilterChanged,
    emit: Emitter<TodosOverviewState>,
  ) {
    emit((state) =>
      state.ready((data) => {
        data.filter = event.filter
      }),
    )
  }

  private async onSubscriptionRequested(
    event: TodosOverviewSubscriptionRequested,
    emit: Emitter<TodosOverviewState>,
  ) {
    emit((state) => state.loading())

    await emit.forEach(
      this.#todosRepository.getTodos(),
      (todos) => {
        return this.state.ready((data) => {
          data.todos = todos
        })
      },
      (error) => this.state.failed(),
    )
  }

  private async onTodoCompletionToggled(
    event: TodosOverviewTodoCompletionToggled,
    emit: Emitter<TodosOverviewState>,
  ) {
    const todo = { ...event.todo, isCompleted: event.isCompleted }
    await this.#todosRepository.saveTodo(todo)
  }
}
