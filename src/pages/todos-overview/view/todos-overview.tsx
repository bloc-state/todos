import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TodosOverviewBloc,
  TodosOverviewSubscriptionRequested,
  TodosOverviewTodoCompletionToggled,
  TodosOverviewTodoDeleted,
  TodosOverviewUndoDeletionRequested,
} from "../bloc";
import { useNavigate } from "react-router-dom";
import { TodosOverviewOptionsButton } from "../components/todos-overview-options-button";
import { TodosOverviewFilterButton } from "../components/todos-overview-filter-button";
import { TodosOverviewEmptyText } from "../components/todos-overview-empty-text";
import { useMemo, useState } from "react";
import { TodosOverviewFilter } from "../model";
import { Todo } from "../../../modules/todos/domain/model/todo";
import { BlocProvider, useBloc, BlocListener } from "@bloc-state/react-bloc";

export default function TodosOverviewPage() {
  return (
    <BlocProvider
      bloc={[TodosOverviewBloc]}
      onCreate={(get) => {
        get(TodosOverviewBloc).add(new TodosOverviewSubscriptionRequested());
      }}
    >
      <TodosOverviewView />
    </BlocProvider>
  );
}

export function TodosOverviewView() {
  const [isSnackbarOpen, openSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [filteredTodos, { add }] = useBloc(TodosOverviewBloc, {
    selector: ({ todos, filter }) => todos.filter((todo) => todoFilterMap(todo, filter)),
    suspend: false,
  });

  const navigate = useNavigate();

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    openSnackbar(false);
  };

  const action = useMemo(() => {
    return (
      <>
        <Button
          color="secondary"
          size="small"
          onClick={(e) => {
            handleCloseSnackbar(e);
            add(new TodosOverviewUndoDeletionRequested());
          }}
        >
          UNDO
        </Button>
      </>
    );
  }, []);

  return (
    <BlocListener
      bloc={TodosOverviewBloc}
      listenWhen={(previous, current) => {
        return (
          previous.data.lastDeletedTodo !== current.data.lastDeletedTodo &&
          current.data.lastDeletedTodo != undefined
        );
      }}
      listener={(get, state) => {
        const deletedTodo = state.data.lastDeletedTodo!;
        setSnackbarMessage(`Todo "${deletedTodo.title}" deleted.`);
        openSnackbar(false); // close snackbar if already open
        openSnackbar(true); // open snackbar
      }}
    >
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bloc Todos
          </Typography>
          <TodosOverviewFilterButton />
          <TodosOverviewOptionsButton />
        </Toolbar>
      </AppBar>
      <Container>
        {filteredTodos.length > 0 ? (
          <List sx={{ paddingY: (theme) => theme.spacing(8) }}>
            {filteredTodos.map((todo) => {
              const labelId = `checkbox-list-label-${todo.id}`;
              return (
                <ListItem
                  key={todo.id}
                  secondaryAction={
                    <IconButton
                      color="inherit"
                      edge="end"
                      aria-label="delete"
                      onClick={() => add(new TodosOverviewTodoDeleted(todo))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.isCompleted}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={() =>
                          add(
                            new TodosOverviewTodoCompletionToggled(
                              todo,
                              !todo.isCompleted
                            )
                          )
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={todo.title}
                      sx={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
                      onClick={() => navigate(`/edit/${todo.id}`)}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <TodosOverviewEmptyText />
        )}
      </Container>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={action}
        sx={{ bottom: { xs: 100, sm: 100 } }}
      />
    </BlocListener>
  );
}

export const todoFilterMap = (todo: Todo, filter: TodosOverviewFilter) =>
  filter === "all" ? true : filter === "completed" ? todo.isCompleted : !todo.isCompleted;
