import { IconButton, Menu, MenuItem } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { TodosOverviewBloc, TodosOverviewFilterChanged } from "../bloc";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useBlocInstance } from "@bloc-state/react-bloc";

export function TodosOverviewFilterButton() {
  const { add } = useBlocInstance(TodosOverviewBloc);

  return (
    <PopupState variant="popover" popupId="todos-overview-filter-menu">
      {(popupState) => (
        <>
          <IconButton color="inherit" {...bindTrigger(popupState)}>
            <FilterListIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              key="filterChangedAll"
              onClick={() => {
                add(new TodosOverviewFilterChanged("all"));
                popupState.close();
              }}
            >
              All
            </MenuItem>
            <MenuItem
              key="filterChangedIncomplted"
              onClick={() => {
                add(new TodosOverviewFilterChanged("incompleted"));
                popupState.close();
              }}
            >
              Active only
            </MenuItem>
            <MenuItem
              key="filterChangedCompleted"
              onClick={() => {
                add(new TodosOverviewFilterChanged("completed"));
                popupState.close();
              }}
            >
              Completed only
            </MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
  );
}
