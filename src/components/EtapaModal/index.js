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

export const EtapaModal = ({ open, onClose, type, processo, selectedArea }) => {
  const [values, setValues] = useState({
    etapa: "",
    tempoGasto: null,
    gestao: false,
    inovacao: false,
    analise: false,
    sistematizacao: false,
    auxilio: false,
    estruturaCargos: [],
  });
  const [cargoData, setCargoData] = useState([]);

  const [etapaIndex, setEtapaIndex] = useState(null);

  const [error, setError] = useState("");

  const getCargos = async () => {
    try {
      const { data } = await api.get(`/area-cargo-responsavel`);
      console.log("acr", data);
      setCargoData(data);
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const validate = (values) => {
    // Verifica se strings estão preenchidas (não vazias)
    if (!values.etapa.trim()) return false;

    // Verifica se os números/valores numéricos não são nulos ou undefined
    if (values.tempoGasto == null) return false;

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

      await api.put(
        `/processo/edit-etapa/${type}/${processo.processoId}`,
        values
      );

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

      await api.put(
        `/processo/edit-etapa/${type}/${processo.processoId}/${etapaIndex}`,
        values
      );

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

      if (!validate(values)) {
        setError("Por favor, preencha todos os campos!");
        return;
      }

      await api.put(
        `/processo/edit-etapa/${type}/${processo.processoId}/${etapaIndex}`,
        values
      );

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
      etapa: "",
      tempoGasto: null,
      gestao: false,
      inovacao: false,
      analise: false,
      sistematizacao: false,
      auxilio: false,
      estruturaCargos: [],
    });
    setEtapaIndex(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("bbbb");
    console.log(processo);
    if (
      type !== "create" &&
      !isEmpty(processo) &&
      Array.isArray(cargoData) &&
      cargoData.length > 0
    ) {
      setValues({
        etapa: processo?.etapa,
        tempoGasto: processo?.tempoGasto,
        gestao: processo?.gestao,
        inovacao: processo?.inovacao,
        analise: processo?.analise,
        sistematizacao: processo?.sistematizacao,
        auxilio: processo?.auxilio,
        estruturaCargos: processo?.estruturaCargos,
      });
      setEtapaIndex(Number(processo?.etapaIndex) - 1);
    }
  }, [type, processo, cargoData]);

  const filteredCargos = cargoData.filter(
    (c) => c.area?._id === selectedArea._id
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open}>
        <DialogTitle textAlign="center">{`${
          type === "create"
            ? "Adicionar nova"
            : type === "edit"
            ? "Editar"
            : "Deseja remover esta "
        } etapa${
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
                <label htmlFor="etapa">Etapa:</label>
                <TextField
                  id="etapa"
                  name="etapa"
                  type="text"
                  value={values.etapa}
                  disabled={type === "delete"}
                  onChange={(e) => {
                    setValues({ ...values, etapa: e.target.value });
                    setError("");
                  }}
                />
              </InputContainer>
              <InputContainer>
                <label htmlFor="tempo-gasto">
                  {"Tempo médio de execução (em horas):"}
                </label>
                <TextField
                  id="tempo-gasto"
                  name="tempo-gasto"
                  type="number"
                  value={values.tempoGasto}
                  disabled={type === "delete"}
                  onChange={(e) => {
                    setValues({ ...values, tempoGasto: e.target.value });
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
                <label htmlFor="cargo">Estrutura de Cargos:</label>
                <Autocomplete
                  disablePortal
                  multiple
                  filterSelectedOptions
                  options={filteredCargos}
                  getOptionLabel={(item) => item.cargo?.nome || ""}
                  value={values.estruturaCargos}
                  disabled={type === "delete"}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(e, value) => {
                    setValues({ ...values, estruturaCargos: value || [] });
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
