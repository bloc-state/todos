import { Fab, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/menu";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Outlet, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";


export default function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      <Outlet />
      <AppBar
        color="primary"
        position="fixed"
        sx={{ bottom: 0, top: "auto", paddingX: (theme) => theme.spacing(8) }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-around",
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => {
              navigate("/");
            }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/stats")}>
            <ShowChartIcon />
          </IconButton>
        </Toolbar>
        <Fab
          color="primary"
          onClick={() => navigate("/edit")}
          sx={{
            position: "absolute",
            zIndex: 9999,
            top: -30,
            left: 0,
            right: 0,
            margin: "0 auto",
          }}
        >
          <AddIcon />
        </Fab>
      </AppBar>
    </>
  );
}
