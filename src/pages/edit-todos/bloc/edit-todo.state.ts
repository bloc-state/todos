import { State } from "@bloc-state/state";
import { EditTodoViewModel } from "../model/edit-todo.model";


export class EditTodoState extends State<EditTodoViewModel> {
	submitSuccess = false

	constructor () {
		super( {
			title: "",
			description: ""
		})
	}
}
