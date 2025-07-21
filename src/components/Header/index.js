import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../store/modules/auth/actions";
import * as headerActions from "../../store/modules/header/actions";

import { Nav } from "../../styles/GlobalStyles";
import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import { IconContainer } from "./styled";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pagina = useSelector((state) => state.header.pagina);
  const compact = useSelector((state) => state.header.compact);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
  };

  const handleCompact = () => {
    dispatch(headerActions.compactHeader());
  };

  return (
    <Nav>
      <div
        style={{
          color: "#555",
          borderRight: "1px solid #eee",
          borderLeft: "1px solid #eee",
          background: "#ccc",
          width: "10px",
        }}
      />
      <Sidebar
        collapsed={compact}
        style={{
          height: "100vh",
          borderRadius: "7px",
          background: "#eee",
          width: compact ? "80px" : "270px",
        }}
      >
        <IconContainer onClick={handleCompact}>
          <MenuIcon />
        </IconContainer>

        <Menu
          menuItemStyles={{
            root: {
              fontFamily: `"Radio Canada Big", sans-serif`,
              fontWeight: 400,
              fontStyle: "normal",
              fontOpticalSizing: "auto",
              fontSize: 14,
              color: "#555",
              borderTop: "1px solid #eee",
            },
          }}
        >
          <SubMenu label="Dashboard" defaultOpen={true}>
            <SubMenu defaultOpen={true}>
              <MenuItem
                style={{ borderLeft: "none" }}
                onClick={() => navigate("/")}
                rootStyles={{
                  background: pagina === "Tabela" ? "#eee" : undefined,
                }}
              >
                Tabela
              </MenuItem>
              <MenuItem
                style={{ borderLeft: "none" }}
                onClick={() => navigate("/graficos")}
                rootStyles={{
                  background: pagina === "Graficos" ? "#eee" : undefined,
                }}
              >
                Gráficos
              </MenuItem>
            </SubMenu>
            <SubMenu defaultOpen={true}>
              <MenuItem
                style={{ borderLeft: "none" }}
                onClick={() => navigate("/area")}
                rootStyles={{
                  background: pagina === "Area" ? "#eee" : undefined,
                }}
              >
                Area
              </MenuItem>
              <MenuItem
                style={{ borderLeft: "none" }}
                onClick={() => navigate("/cargo")}
                rootStyles={{
                  background: pagina === "Cargo" ? "#eee" : undefined,
                }}
              >
                Cargo
              </MenuItem>
              <MenuItem
                style={{ borderLeft: "none" }}
                onClick={() => navigate("/responsavel")}
                rootStyles={{
                  background: pagina === "Responsavel" ? "#eee" : undefined,
                }}
              >
                Responsável
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <MenuItem
            style={{ background: "#ccc", borderLeft: "none" }}
            onClick={handleLogout}
          >
            Sair
          </MenuItem>
        </Menu>
      </Sidebar>
    </Nav>
  );
}
