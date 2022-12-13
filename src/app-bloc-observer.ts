import {
  BlocObserver,
  BlocBase,
  Bloc,
  Change,
  Transition,
} from "@bloc-state/bloc"

export class AppBlocObserver extends BlocObserver {
  override onCreate(bloc: BlocBase<any>): void {
    console.log(`created bloc: ${bloc.constructor.name}`)
  }
  override onEvent(bloc: Bloc<any, any>, event: any): void {
    //console.log(event)
  }

  override onError(bloc: BlocBase<any>, error: any): void {
    console.error(error)
  }

  override onChange(bloc: BlocBase<any>, change: Change<any>): void {
    console.log(change.nextState)
  }

  override onTransition(
    bloc: Bloc<any, any>,
    transition: Transition<any, any>,
  ): void {
    //console.log(transition.currentState)
    //console.log(transition.nextState)
  }

  override onClose(bloc: BlocBase<any>): void {
    console.log(`closed bloc: ${bloc.constructor.name}`)
  }
}
