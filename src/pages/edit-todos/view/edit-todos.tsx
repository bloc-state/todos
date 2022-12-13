import {
  AppBar,
  Toolbar,
  Fab,
  TextField,
  Container,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { BlocListener, BlocProvider, useBloc} from "@bloc-state/react-bloc"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EditTodoBloc } from "../bloc/edit-todo.bloc";
import {
  EditTodoDescriptionChanged,
  EditTodoSubmitted,
  EditTodoSubscribed,
  EditTodoTitleChanged,
} from "../bloc/edit-todo.event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditTodoPage() {
  const { todoId } = useParams();

  return (
    <BlocProvider
      bloc={[EditTodoBloc]}
      onCreate={(get) => {
        if (todoId) get(EditTodoBloc).add(new EditTodoSubscribed(todoId));
      }}
    >
      <EditTodoView isNew={todoId === undefined} />
    </BlocProvider>
  );
}

export type EditTodoViewProps = {
  isNew: boolean;
};

export function EditTodoView({ isNew }: EditTodoViewProps) {
  const navigate = useNavigate();

  const [[title, description], { add }] = useBloc(EditTodoBloc, {
    selector: ({ title, description }) => [title, description],
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title,
      description,
    },
  });

  const onSubmit = (data: any) => add(new EditTodoSubmitted());

  return (
    <BlocListener
      bloc={EditTodoBloc}
      listenWhen={(previous, current) => current.submitSuccess}
      listener={(get, state) => {
        navigate("/");
      }}
    >
      <Container
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(7),
          top: (theme) => theme.spacing(8),
          paddingY: (theme) => theme.spacing(3),
          left: "0",
          right: "0",
        }}
      >
        <AppBar position={"fixed"}>
          <Toolbar>
            <Box sx={{ flex: 1 }}>
              <IconButton color="inherit" onClick={() => navigate("/")}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {isNew ? "Add Todo" : "Edit Todo"}
            </Typography>
            <Box sx={{ flex: 1 }} />
          </Toolbar>
        </AppBar>
        <form id="edit-todos-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Title must have at least one character.",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <TextField
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  name="title"
                  variant="standard"
                  id="title"
                  label="title"
                  value={value}
                  onChange={(event) => {
                    onChange(event);
                    add(new EditTodoTitleChanged(event.target.value));
                  }}
                />
              );
            }}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Description must have at least one character.",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                name="description"
                variant="standard"
                id="description"
                label="description"
                value={value}
                multiline
                rows={10}
                margin="dense"
                onChange={(event) => {
                  onChange(event);
                  add(new EditTodoDescriptionChanged(event.target.value));
                }}
              />
            )}
          />
        </form>
      </Container>
      <Fab
        form="edit-todos-form"
        color="primary"
        type="submit"
        sx={{
          position: "absolute",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
      >
        <CheckRoundedIcon />
      </Fab>
    </BlocListener>
  );
}
