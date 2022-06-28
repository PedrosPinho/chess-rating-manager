import Home from "../views/Home";
import Insert from "../views/Insert";
import HomeIcon from "@material-ui/icons/Home";
import BookIcon from "@material-ui/icons/Book";

export const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
    alias: "Home",
    icon: HomeIcon
  },
  {
    path: "/cadastro",
    exact: true,
    component: Insert,
    alias: "Cadastro",
    icon: BookIcon
  },
];
