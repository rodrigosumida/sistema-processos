import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../styles/GlobalStyles";
import { Form, Button, Content, RegisterButton } from "./styled";

import api from "../../api/axios";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/modules/auth/actions";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { email, password } = userData;

    if (!email || !password) {
      setError("Por favor, preencha todos os campos!");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/user/login", { email, password });

      dispatch(
        actions.loginRequest({
          email,
          password,
        })
      );
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.error || "Erro desconhecido");
    }
  }

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/cadastro");
  };

  // Prevents code breaking by manually changing the redux state
  useEffect(() => {
    async function checkTokenAndRedirect() {
      try {
        await api.get("/user/me");
        navigate("/");
      } catch (err) {
        dispatch(actions.loginFailure());
      }
    }

    if (isLoggedIn) {
      checkTokenAndRedirect();
    }
  }, [isLoggedIn, navigate, dispatch]);

  return (
    <Content>
      <Container>
        <h1 style={{ alignSelf: "center", textAlign: "center" }}>
          Faça seu Login
        </h1>
        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <label for="email">E-mail:</label>
          <input
            id="email"
            name="email"
            type="text"
            value={userData.email}
            onChange={(e) => {
              setUserData({ ...userData, email: e.target.value });
              setError("");
            }}
          />
          {/* Password */}
          <label for="password">Senha:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={userData.password}
            onChange={(e) => {
              setUserData({ ...userData, password: e.target.value });
              setError("");
            }}
          />
          <div className="erro">{error ? error : ""}</div>
          <Button disabled={isLoading} type="submit">
            Entrar
          </Button>
          <RegisterButton onClick={handleRegisterClick}>
            Cadastre-se
          </RegisterButton>
        </Form>
      </Container>
    </Content>
  );
}
