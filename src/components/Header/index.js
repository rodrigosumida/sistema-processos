import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useDispatch } from "react-redux";

import * as actions from "../../store/modules/auth/actions";

import { Nav } from "../../styles/GlobalStyles";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
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
        style={{
          height: "100vh",
          borderRadius: "7px",
          background: "#eee",
          width: "270px",
        }}
      >
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
            <MenuItem
              style={{ borderLeft: "none" }}
              onClick={() => navigate("/")}
            >
              Tabela
            </MenuItem>
            <MenuItem
              style={{ borderLeft: "none" }}
              onClick={() => navigate("/graficos")}
            >
              Gráficos
            </MenuItem>
            <MenuItem
              style={{ borderLeft: "none" }}
              onClick={() => navigate("/responsavel")}
            >
              Responsável
            </MenuItem>
            <MenuItem
              style={{ borderLeft: "none" }}
              onClick={() => navigate("/cargo")}
            >
              Cargo
            </MenuItem>
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
