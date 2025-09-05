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

export const ProcessTableModal = ({
  open,
  onClose,
  type,
  processo,
  selectedArea,
  selectedMacro,
  macroprocessoData,
}) => {
  const [values, setValues] = useState({
    area: "",
    processo: "",
    macroprocesso: "",
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
    if (!values.processo.trim()) return false;
    if (!values.macroprocesso.trim()) return false;

    // Se passou por todas as validações, está válido
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

      await api.post("/processo", values);

      resetValues();
      onClose();
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const handleEditSave = async () => {
    try {
      setError("");

      if (!validate(values)) {
        setError("Por favor, preencha todos os campos!");
        return;
      }

      await api.put(`/processo/${processo.processoId}`, values);

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

      await api.delete(`/processo/${processo.processoId}`);

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
      processo: "",
      macroprocesso: "",
      descricao: "",
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
    getAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedArea && type === "create") {
      setValues((prev) => ({ ...prev, area: selectedArea._id }));
    }
    if (selectedMacro && type === "create") {
      setValues((prev) => ({ ...prev, macroprocesso: selectedMacro._id }));
    }
  }, [selectedArea, selectedMacro, areaData, type]);

  useEffect(() => {
    if (!isEmpty(processo))
      setValues({
        area: processo?.area._id,
        processo: processo?.processo,
        macroprocesso: processo?.macroprocesso._id,
        descricao: processo?.descricao,
      });
  }, [type, processo]);

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
                      macroprocesso: "", // zera ao trocar de área
                    });
                  }}
                />
              </InputContainer>
              <InputContainer>
                <label htmlFor="macroprocesso">Macroprocesso:</label>
                <Autocomplete
                  disablePortal
                  options={macroprocessoData.filter(
                    (item) => item.area === values.area
                  )}
                  getOptionLabel={(option) => option.nome || ""}
                  value={
                    macroprocessoData.find(
                      (a) => a._id === values.macroprocesso
                    ) || null
                  }
                  disabled={type === "delete"}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(e, value) => {
                    setValues({
                      ...values,
                      macroprocesso: value?._id || "",
                    });
                  }}
                />
              </InputContainer>
              <InputContainer>
                <label htmlFor="processo">Processo:</label>
                <TextField
                  id="processo"
                  name="processo"
                  type="text"
                  value={values.processo}
                  disabled={type === "delete"}
                  onChange={(e) => {
                    setValues({ ...values, processo: e.target.value });
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
                  multiline
                  rows={10} // define a altura inicial (em linhas)
                  fullWidth
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
