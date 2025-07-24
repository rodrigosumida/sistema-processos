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
import { ContainerBotoes, InputContainer, WarningText } from "./styled";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import api from "../../api/axios";
import { toast } from "react-toastify";
import CargoCard from "../CargoCard";

export const AreaTableModal = ({ open, onClose, type, item }) => {
  const [values, setValues] = useState({
    nome: "",
    cargos: [],
  });
  const [cargoData, setCargoData] = useState([]);
  const [responsavelData, setResponsavelData] = useState([]);

  const [cargoResponsavel, setCargoResponsavel] = useState({
    cargo: {},
    responsavel: {},
  });

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = () => {
    resetCargoResponsavel();
    setError("");
    setIsAdding(false);
  };

  const handleAdd = () => {
    setValues({ ...values, cargos: [...values.cargos, cargoResponsavel] });
    resetCargoResponsavel();
    setError("");
    setIsAdding(false);
  };

  const getCargos = async () => {
    try {
      const { data } = await api.get("/cargo");
      setCargoData(data);
    } catch (err) {
      toast.error("Ocorreu um erro!");
    }
  };

  const getResponsaveis = async () => {
    try {
      const { data } = await api.get("/responsavel");
      setResponsavelData(data);
    } catch (err) {
      toast.error("Ocorreu um erro!");
    }
  };

  const validate = (values) => {
    // Verifica se strings estão preenchidas (não vazias)
    if (!values.nome.trim()) return false;

    // Verifica se a lista cargos não está vazio
    if (!Array.isArray(values.cargos) || values.cargos.length === 0)
      return false;

    return true;
  };

  const handleAddCargoClick = () => {
    setError("");
    setIsAdding(true);
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!validate(values)) {
        setError("Por favor, preencha todos os campos!");
        return;
      }

      await api.post("/area-cargo-responsavel/grouped", values);

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

      const grouped = { _id: item.area._id, ...values };

      await api.put(
        `/area-cargo-responsavel/grouped/${item.area._id}`,
        grouped
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

      await api.delete(`/area/${item.area?._id}`);

      resetValues();
      onClose();
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const handleDeleteCargo = async (data) => {
    try {
      if (values.cargos.length === 1) {
        setError("A área deve possuir pelo menos 1 cargo");
        return;
      }

      await api.delete(`/area-cargo-responsavel/${data._id}`);

      setValues({
        ...values,
        cargos: values.cargos.filter((cargo) => cargo !== data),
      });
    } catch (err) {
      console.log("Erro: ", err);
      toast.error("Ocorreu um erro");
    }
  };

  const handleClose = () => {
    resetValues();
    resetCargoResponsavel();
    setIsAdding(false);
    setError("");
    onClose();
  };

  const resetValues = () => {
    setValues({
      nome: "",
      cargos: [],
    });
  };

  const resetCargoResponsavel = () => {
    setCargoResponsavel({
      cargo: "",
      responsavel: "",
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
    console.log("bbbb", item);
    getCargos();
    getResponsaveis();
    if (!isEmpty(item))
      setValues({ nome: item.area?.nome, cargos: item.cargos });
  }, [type, item]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open}>
        <DialogTitle textAlign="center">{`${
          type === "create"
            ? "Adicionar nova"
            : type === "edit"
            ? "Editar"
            : "Deseja remover esta "
        } área${
          type === "delete" ? "? (Essa ação é irreversível)" : ""
        }`}</DialogTitle>
        <WarningText>
          ATENÇÃO! TODOS OS PROCESSOS DESSA ÁREA TAMBÉM SERÃO EXCLUÍDOS
        </WarningText>
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

              <span
                style={{
                  fontSize: "0.9rem",
                  marginBottom: "3px",
                  color: "#104467",
                  alignSelf: "flex-start",
                }}
              >
                Cargos:
              </span>
              {values.cargos?.map((cargo, index) => (
                <CargoCard
                  key={index}
                  data={cargo}
                  handleDelete={handleDeleteCargo}
                  hideActions={type === "delete"}
                />
              ))}

              {isAdding ? (
                <>
                  <hr />
                  <InputContainer>
                    <label htmlFor="cargo">Cargo:</label>
                    <Autocomplete
                      disablePortal
                      options={cargoData}
                      getOptionLabel={(option) => option.nome || ""}
                      value={cargoData.find(
                        (a) => a._id === cargoResponsavel.cargo
                      )}
                      disabled={type === "delete"}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(e, value) => {
                        setCargoResponsavel({
                          ...cargoResponsavel,
                          cargo: value || "",
                        });
                      }}
                    />
                  </InputContainer>
                  <InputContainer>
                    <label htmlFor="cargo">Responsável:</label>
                    <Autocomplete
                      disablePortal
                      options={responsavelData}
                      getOptionLabel={(option) => option.nome || ""}
                      value={responsavelData.find(
                        (a) => a._id === cargoResponsavel.responsavel
                      )}
                      disabled={type === "delete"}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(e, value) => {
                        setCargoResponsavel({
                          ...cargoResponsavel,
                          responsavel: value || "",
                        });
                      }}
                    />
                  </InputContainer>
                  <ContainerBotoes>
                    <Button sx={{ color: "#104467" }} onClick={handleAdd}>
                      Adicionar
                    </Button>
                    <Button sx={{ color: "#104467" }} onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </ContainerBotoes>
                </>
              ) : (
                <>
                  <Button onClick={handleAddCargoClick}>
                    + Adicionar Cargo
                  </Button>
                </>
              )}
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
