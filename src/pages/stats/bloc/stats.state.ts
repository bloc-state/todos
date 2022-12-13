import { State } from "@bloc-state/state"
import { StatsViewModel } from "../model/stats.model"

export class StatsState extends State<StatsViewModel> {
  constructor() {
    super({
      activeTodos: 0,
      completedTodos: 0,
    })
  }
}
