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
import { LevelContainer, LevelsContainer, InputContainer } from "./styled";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { LevelInput } from "../LevelInput";
import api from "../../api/axios";
import { toast } from "react-toastify";

export const ProcessTableModal = ({ open, onClose, type, processo }) => {
  const [values, setValues] = useState({
    processo: "",
    categoria: "",
    gestao: null,
    inovacao: null,
    analise: null,
    sistematizacao: null,
    auxilio: null,
    estruturaCargos: [],
  });
  const [cargoData, setCargoData] = useState({});

  const [error, setError] = useState("");

  const getCargos = async () => {
    try {
      const { data } = await api.get("/cargo");
      setCargoData(data);
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const validate = (values) => {
    // Verifica se strings estão preenchidas (não vazias)
    if (!values.processo.trim()) return false;
    if (!values.categoria.trim()) return false;

    // Verifica se os números/valores numéricos não são nulos ou undefined
    if (values.gestao == null) return false;
    if (values.inovacao == null) return false;
    if (values.analise == null) return false;
    if (values.sistematizacao == null) return false;
    if (values.auxilio == null) return false;

    // Verifica se a lista estruturaCargos não está vazia
    if (
      !Array.isArray(values.estruturaCargos) ||
      values.estruturaCargos.length === 0
    )
      return false;

    // Se passou por todas as validações, está válido
    return true;
  };

  const handleSubmit = async () => {
    try {
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

      await api.put(`/processo/${processo._id}`, values);

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

      await api.delete(`/processo/${processo._id}`);

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
      processo: "",
      categoria: "",
      gestao: null,
      inovacao: null,
      analise: null,
      sistematizacao: null,
      auxilio: null,
      estruturaCargos: [],
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
    console.log("aaaa");
    getCargos();
  }, []);

  useEffect(() => {
    console.log("bbbb");
    if (!isEmpty(processo) && Array.isArray(cargoData) && cargoData.length > 0)
      setValues(processo);
  }, [type, processo, cargoData]);

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
                <label htmlFor="categoria">Categoria:</label>
                <TextField
                  id="categoria"
                  name="categoria"
                  type="text"
                  value={values.categoria}
                  disabled={type === "delete"}
                  onChange={(e) => {
                    setValues({ ...values, categoria: e.target.value });
                    setError("");
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
              <LevelsContainer>
                <LevelContainer>
                  <LevelInput
                    label={"gestao"}
                    values={values}
                    setValues={setValues}
                    type={type}
                    setError={setError}
                  />
                </LevelContainer>
                <LevelContainer>
                  <LevelInput
                    label={"inovacao"}
                    values={values}
                    setValues={setValues}
                    setError={setError}
                    type={type}
                  />
                </LevelContainer>
                <LevelContainer>
                  <LevelInput
                    label={"analise"}
                    values={values}
                    setValues={setValues}
                    type={type}
                    setError={setError}
                  />
                </LevelContainer>
                <LevelContainer>
                  <LevelInput
                    label={"sistematizacao"}
                    values={values}
                    setValues={setValues}
                    type={type}
                    setError={setError}
                  />
                </LevelContainer>
                <LevelContainer>
                  <LevelInput
                    label={"auxilio"}
                    values={values}
                    setValues={setValues}
                    type={type}
                    setError={setError}
                  />
                </LevelContainer>
              </LevelsContainer>
              <InputContainer>
                <label htmlFor="technologies">Estrutura de Cargos:</label>
                <Autocomplete
                  disablePortal
                  multiple
                  filterSelectedOptions
                  options={cargoData}
                  getOptionLabel={(cargo) => cargo.nome}
                  value={values.estruturaCargos}
                  disabled={type === "delete"}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(e, value) => {
                    setValues({ ...values, estruturaCargos: value });
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
