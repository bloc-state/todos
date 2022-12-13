import { AwilixContainer, asClass } from "awilix"
import { TodosRepositoryImpl } from "./data"
import { LocalStorageTodosResource } from "./data/resource"

export function TodosModule(container: AwilixContainer) {
  container.register({
    todosResource: asClass(LocalStorageTodosResource)
      .disposer((resource) => resource.close())
      .singleton(),
    todosRepository: asClass(TodosRepositoryImpl).scoped(),
  })
}
