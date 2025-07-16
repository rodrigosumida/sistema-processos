import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { ErroContainer, Form } from "../../styles/GlobalStyles";
import { InputContainer } from "./styled";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import api from "../../api/axios";
import { toast } from "react-toastify";

export const DefaultTableModal = ({ open, onClose, type, item, table }) => {
  const [values, setValues] = useState({
    nome: "",
  });

  const [error, setError] = useState("");

  const validate = (values) => {
    // Verifica se strings estão preenchidas (não vazias)
    if (!values.nome.trim()) return false;
    return true;
  };

  const handleSubmit = async () => {
    try {
      console.log(values);
      setError("");

      if (!validate(values)) {
        setError("Por favor, preencha todos os campos!");
        return;
      }

      await api.post(`/${table}`, values);

      resetValues();
      onClose();
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const handleEditSave = async () => {
    try {
      console.log(values);
      setError("");

      if (!validate(values)) {
        setError("Por favor, preencha todos os campos!");
        return;
      }

      await api.put(`/${table}/${item._id}`, values);

      resetValues();
      onClose();
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const handleDelete = async () => {
    try {
      setError("");

      await api.delete(`/${table}/${item._id}`);

      resetValues();
      onClose();
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const handleClose = () => {
    resetValues();
    setError("");
    onClose();
  };

  const resetValues = () => {
    setValues({
      area: "",
    });
  };

  const isEmpty = (obj) => {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    console.log("bbbb");
    if (!isEmpty(item)) setValues(item);
  }, [type, item]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open}>
        <DialogTitle textAlign="center">{`${
          type === "create"
            ? "Adicionar novo"
            : type === "edit"
            ? "Editar"
            : "Deseja remover este "
        } ${table}${
          type === "delete" ? "? (Essa ação é irreversível)" : ""
        }`}</DialogTitle>
        <DialogContent>
          <Form>
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
              }}
            >
              <InputContainer>
                <label htmlFor="nome">Nome:</label>
                <TextField
                  id="nome"
                  name="nome"
                  type="text"
                  value={values.nome}
                  disabled={type === "delete"}
                  onChange={(e) => {
                    setValues({ ...values, nome: e.target.value });
                    setError("");
                  }}
                />
              </InputContainer>
            </Stack>
          </Form>
          <ErroContainer>{error ? error : ""}</ErroContainer>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button sx={{ color: "#104467" }} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            sx={{ backgroundColor: "#104467", color: "white" }}
            onClick={
              type === "create"
                ? handleSubmit
                : type === "edit"
                ? handleEditSave
                : handleDelete
            }
            variant="contained"
          >
            {type === "delete" ? "Confirmar" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
