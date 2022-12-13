import {
  AppBar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
	Typography,
} from "@mui/material";
import { StatsBloc } from "../bloc/stats.bloc";
import { StatsSubscriptionRequested } from "../bloc/stats.event";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Grid from "@mui/material/Unstable_Grid2";
import { BlocProvider, useBlocValue } from "@bloc-state/react-bloc";

export default function StatsPage() {
  return (
    <BlocProvider
      bloc={[StatsBloc]}
      onCreate={(get) => {
        get(StatsBloc).add(new StatsSubscriptionRequested());
      }}
    >
      <StatsView />
    </BlocProvider>
  );
}

export function StatsView() {
  const state = useBlocValue(StatsBloc);
  const { activeTodos, completedTodos } = state.data;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Stats
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction={"column"}
        sx={{ height: "100%" }}
        justifyContent={"center"}
      >
        <Grid>
          <List>
            <ListItem secondaryAction={<ListItemText primary={completedTodos} />}>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary={"Completed todos"} />
            </ListItem>
            <ListItem secondaryAction={<ListItemText primary={activeTodos} />}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon />
              </ListItemIcon>
              <ListItemText primary={"Active todos"} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </>
  );
}
