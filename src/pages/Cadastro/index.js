import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container, WarningInputMessage } from "../../styles/GlobalStyles";
import {
  Form,
  Button,
  Content,
  RegisterButton,
  InputContainer,
} from "./styled";

import api from "../../api/axios";

import { toast } from "react-toastify";

export default function Cadastro() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
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
      await api.post("/user", { email, password });

      toast.info("Conta criada! Aguarde a aprovação de um administrador.");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.error || "Erro desconhecido");
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <Content>
      <Container>
        <h1 style={{ alignSelf: "center", textAlign: "center" }}>
          Cadastre-se
        </h1>
        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <InputContainer>
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
          </InputContainer>
          {/* Password */}
          <InputContainer>
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
            {userData.password !== confirmPassword ? (
              <WarningInputMessage>
                As senhas não coincidem.
              </WarningInputMessage>
            ) : (
              <></>
            )}
          </InputContainer>
          {/* Confirm Password */}
          <InputContainer>
            <label for="confirm-password">Confirme a Senha:</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />
            {userData.password !== confirmPassword ? (
              <WarningInputMessage>
                As senhas não coincidem.
              </WarningInputMessage>
            ) : (
              <></>
            )}
          </InputContainer>
          <div className="erro">{error ? error : ""}</div>
          <Button disabled={isLoading} type="submit">
            Criar conta
          </Button>
          <RegisterButton onClick={handleLoginClick}>Login</RegisterButton>
        </Form>
      </Container>
    </Content>
  );
}
