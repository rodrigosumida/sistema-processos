import React, { useEffect, useState } from "react";

import {
  Autocomplete,
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

export const MacroprocessoModal = ({ open, onClose, type, selectedArea }) => {
  const [values, setValues] = useState({
    area: "",
    nome: "",
    descricao: "",
  });
  const [areaData, setAreaData] = useState([]);

  const [error, setError] = useState("");

  const getAreas = async () => {
    try {
      const { data } = await api.get("/area");
      setAreaData(data);
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const validate = (values) => {
    // Verifica se strings estão preenchidas (não vazias)
    if (!values.area.trim()) return false;
    if (!values.nome.trim()) return false;
    if (!values.descricao.trim()) return false;

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

      await api.post("/macroprocesso", values);

      resetValues();
      onClose();
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  // const handleEditSave = async () => {
  //   try {
  //     console.log(values);
  //     setError("");

  //     if (!validate(values)) {
  //       setError("Por favor, preencha todos os campos!");
  //       return;
  //     }

  //     await api.put(`/processo/${processo._id}`, values);

  //     resetValues();
  //     onClose();
  //   } catch (err) {
  //     console.log("Erro: ", err);
  //     toast.error("Ocorreu um erro");
  //   }
  // };

  // const handleDelete = async () => {
  //   try {
  //     setError("");

  //     await api.delete(`/processo/${processo._id}`);

  //     resetValues();
  //     onClose();
  //   } catch (err) {
  //     console.log("Erro: ", err);
  //     toast.error("Ocorreu um erro");
  //   }
  // };

  const handleClose = () => {
    resetValues();
    setError("");
    onClose();
  };

  const resetValues = () => {
    setValues({
      area: "",
      nome: "",
      descricao: "",
    });
  };

  useEffect(() => {
    console.log("aaaa");
    getAreas();
  }, []);

  useEffect(() => {
    if (selectedArea && type === "create") {
      console.log("nbsdv");
      setValues((prev) => ({ ...prev, area: selectedArea._id }));
    }
  }, [selectedArea, areaData, type]);

  useEffect(() => {
    console.log("bbbb");
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open}>
        <DialogTitle textAlign="center">{`${
          type === "create"
            ? "Adicionar novo"
            : type === "edit"
            ? "Editar"
            : "Deseja remover este "
        } processo${
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
                <label htmlFor="area">Área:</label>
                <Autocomplete
                  disablePortal
                  options={areaData}
                  getOptionLabel={(option) => option.nome || ""}
                  value={areaData.find((a) => a._id === values.area) || null}
                  disabled={type === "delete"}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(e, value) => {
                    setValues({
                      ...values,
                      area: value?._id || "",
                      estruturaCargos: [], // zera os cargos ao trocar de área
                    });
                  }}
                />
              </InputContainer>
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
              <InputContainer>
                <label htmlFor="descricao">Descrição:</label>
                <TextField
                  id="descricao"
                  name="descricao"
                  type="text"
                  value={values.descricao}
                  disabled={type === "delete"}
                  onChange={(e) => {
                    setValues({ ...values, descricao: e.target.value });
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
            // onClick={
            //   type === "create"
            //     ? handleSubmit
            //     : type === "edit"
            //     ? handleEditSave
            //     : handleDelete
            // }
            onClick={handleSubmit}
            variant="contained"
          >
            {type === "delete" ? "Confirmar" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
