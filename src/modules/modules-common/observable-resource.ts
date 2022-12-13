import { Cubit } from "@bloc-state/bloc"

export abstract class ObservableResource<T> extends Cubit<T> {
  constructor(initialState: T) {
    super(initialState)
  }

  /* override all bloc observer methods since we don't want them being used by a BlocObserver */
  protected override onError(error: Error): void {}

  protected override onChange() {}

  protected override onCreate(): void {}

  protected override onClose(): void {}
}
