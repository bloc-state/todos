import { AppBar, createTheme, ThemeProvider, Toolbar } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import loadable from "@loadable/component";

const HomePage = loadable(() => import("./home/view/home"));
const StatsPage = loadable(() => import("./stats/view/stats"));
const TodosOverviewPage = loadable(() => import("./todos-overview/view/todos-overview"));
const EditTodoPage = loadable(() => import("./edit-todos/view/edit-todos"));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Scrollbars>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<TodosOverviewPage />} />
            <Route path="stats">
              <Route index element={<StatsPage />} />
            </Route>
          </Route>
          <Route path="edit" element={<EditTodoPage />}>
            <Route index path=":todoId" />
          </Route>
        </Routes>
      </Scrollbars>
      <AppBarPlaceHolder />
    </ThemeProvider>
  );
}

const AppBarPlaceHolder = () => (
  <AppBar position="fixed" sx={{ zIndex: -1}}>
    <Toolbar />
  </AppBar>
)
