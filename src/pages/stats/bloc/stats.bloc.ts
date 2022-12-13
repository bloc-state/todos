import { Bloc, Emitter } from "@bloc-state/bloc"
import { TodosRepository } from "../../../modules/todos/domain/repository/todos-repository"
import { StatsEvent, StatsSubscriptionRequested } from "./stats.event"
import { StatsState } from "./stats.state"

type StatsBlocProps = {
  todosRepository: TodosRepository
}

export class StatsBloc extends Bloc<StatsEvent, StatsState> {
  #todosRepository: TodosRepository
  constructor({ todosRepository }: StatsBlocProps) {
    super(new StatsState())

    this.#todosRepository = todosRepository
    this.on(StatsSubscriptionRequested, (event, emit) =>
      this.onSubscriptionRequested(event, emit),
    )
  }
  async onSubscriptionRequested(
    event: StatsSubscriptionRequested,
    emit: Emitter<StatsState>,
  ) {
    emit((state) => state.loading())

    await emit.forEach(this.#todosRepository.getTodos(), (todos) => {
      return this.state.ready({
        completedTodos: todos.filter((todo) => todo.isCompleted).length,
        activeTodos: todos.filter((todo) => !todo.isCompleted).length,
      })
    })
  }

  dispose(): void | Promise<void> {
    this.close()
  }
}
