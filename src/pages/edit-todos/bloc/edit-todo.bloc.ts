import { Bloc, Emitter } from "@bloc-state/bloc";
import { Todo } from "../../../modules/todos/domain/model/todo";
import { TodosRepository } from "../../../modules/todos/domain/repository/todos-repository";
import {
  EditTodoDescriptionChanged,
  EditTodoEvent,
  EditTodoSubmitted,
  EditTodoSubscribed,
  EditTodoTitleChanged,
} from "./edit-todo.event";
import { EditTodoState } from "./edit-todo.state";

type EditTodoBlocProps = {
  todosRepository: TodosRepository;
};

export class EditTodoBloc extends Bloc<EditTodoEvent, EditTodoState> {
  #todosRepository: TodosRepository

  constructor({ todosRepository }: EditTodoBlocProps) {
    super(new EditTodoState());

    this.#todosRepository = todosRepository
    this.on(EditTodoSubscribed, this.onSubscribed);
    this.on(EditTodoTitleChanged, this.onTitleChanged);
    this.on(EditTodoDescriptionChanged, this.onDescriptionChanged);
    this.on(EditTodoSubmitted, this.onSubmitted);
  }

  async onSubmitted(event: EditTodoSubmitted, emit: Emitter<EditTodoState>) {
    emit((state) => state.loading());

    try {
      const { title, description, id, isCompleted } = this.state.data;
      await this.#todosRepository.saveTodo(new Todo(title, description, isCompleted, id));
      emit((state) =>
        state.copyWith((draft) => {
          draft.status = "ready";
          draft.submitSuccess = true;
        })
      );
    } catch (e) {
      emit((state) => state.failed());
    }
  }

  onDescriptionChanged(event: EditTodoDescriptionChanged, emit: Emitter<EditTodoState>) {
    emit((state) =>
      state.ready((data) => {
        data.description = event.description;
      })
    );
  }

  onTitleChanged(event: EditTodoTitleChanged, emit: Emitter<EditTodoState>) {
    emit((state) =>
      state.ready((data) => {
        data.title = event.title;
      })
    );
  }

  async onSubscribed(event: EditTodoSubscribed, emit: Emitter<EditTodoState>) {
    emit((state) => state.loading());

    try {
      const todo = await this.#todosRepository.getTodo(event.todoId);
      emit((state) =>
        state.ready({
          ...todo,
        })
      );
    } catch (e: any) {
    }
  }

  dispose(): void | Promise<void> {
    this.close();
  }
}
