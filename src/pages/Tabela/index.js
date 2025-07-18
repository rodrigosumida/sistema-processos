import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Container, ContainerAreaInput, ContainerTable } from "./styled";
import { MaterialReactTable } from "material-react-table";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import { ProcessTableModal } from "../../components/ProcessTableModal";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { mudarHeader } from "../../store/modules/header/actions";
// import { BooleanCell } from "../../components/BooleanCell";

const Tabela = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [areaData, setAreaData] = useState([]);
  const [selectedArea, setSelectedArea] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [processo, setProcesso] = useState({});

  const dispatch = useDispatch();
  dispatch(mudarHeader("Tabela"));

  const getData = async () => {
    try {
      const { data: areas } = await api.get("/area");
      setAreaData(areas);

      const { data: processos } = await api.get("/processo");
      setTableData(processos);

      if (!selectedArea || !selectedArea._id) {
        const defaultArea = areas[0];
        setSelectedArea(defaultArea);

        const filtered = processos.filter(
          (item) => item.area?._id === defaultArea?._id
        );
        setFilteredData(filtered);
      } else {
        const filtered = processos.filter(
          (item) => item.area?._id === selectedArea._id
        );
        setFilteredData(filtered);
      }
      console.log("DONE");
    } catch (err) {
      toast.error("Ocorreu um erro!");
    }
  };

  const handleChangeArea = (value) => {
    setSelectedArea(value || {});

    const data = tableData.filter((item) => item.area?._id === value._id);
    setFilteredData(data);
  };

  const handleAddClick = () => {
    setModalOpen(true);
    setModalType("create");
  };

  const handleEditClick = (item) => {
    setProcesso(item);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setProcesso(item);
    setModalType("delete");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setProcesso({});
    getData();
  };

  const verticalHeaderStyle = {
    sx: {
      writingMode: "vertical-rl",
      transform: "rotate(180deg)",
      whiteSpace: "nowrap",
      padding: "4px",
      fontSize: "0.9rem",
      minWidth: "30px",
      textAlign: "center",
    },
  };

  const columns = [
    {
      accessorKey: "area",
      header: "Área",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
      Cell: ({ cell }) => cell.getValue()?.nome ?? "—",
    },
    {
      accessorKey: "categoria",
      header: "Categoria",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
    },
    {
      accessorKey: "processo",
      header: "Processo",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
    },
    {
      accessorKey: "gestao",
      header: "Gestão",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
      Cell: ({ cell }) => {
        return (
          <div style={{ textAlign: "center" }}>
            {cell.getValue() ? "x" : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "inovacao",
      header: "Inovação/Impacto",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
      Cell: ({ cell }) => {
        return (
          <div style={{ textAlign: "center" }}>
            {cell.getValue() ? "x" : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "analise",
      header: "Análise",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
      Cell: ({ cell }) => {
        return (
          <div style={{ textAlign: "center" }}>
            {cell.getValue() ? "x" : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "sistematizacao",
      header: "Sistematização",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
      Cell: ({ cell }) => {
        return (
          <div style={{ textAlign: "center" }}>
            {cell.getValue() ? "x" : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "auxilio",
      header: "Auxílio",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
      Cell: ({ cell }) => {
        return (
          <div style={{ textAlign: "center" }}>
            {cell.getValue() ? "x" : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "estruturaCargos",
      header: "Estrutura de Cargos",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
      Cell: ({ cell }) => {
        const valor = cell.getValue();
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {valor?.map((item, idx) => (
              <Chip
                key={item._id || idx}
                label={`${item.cargo?.nome ?? "Sem cargo"} (${
                  item.responsavel?.nome ?? "Sem responsável"
                })`}
                size="small"
              />
            ))}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
    console.log("FOI");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Header />
      <ContainerTable>
        <ContainerAreaInput>
          <Autocomplete
            disablePortal
            options={areaData}
            getOptionLabel={(option) => option.nome || ""}
            value={areaData.find((a) => a._id === selectedArea._id) || null}
            renderInput={(params) => <TextField {...params} />}
            onChange={(e, value) => handleChangeArea(value)}
          />
        </ContainerAreaInput>
        <MaterialReactTable
          enableRowActions
          displayColumnDefOptions={{
            "mrt-row-actions": {
              size: 120,
              header: "Ações",
              muiTableHeadCellProps: {
                sx: {
                  verticalAlign: "bottom",
                  paddingBottom: "8px",
                },
              },
            },
          }}
          columns={columns}
          data={filteredData}
          initialState={{ density: "compact" }}
          renderRowActions={({ row, table }) => (
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip arrow placement="left" title="Editar">
                <IconButton onClick={() => handleEditClick(row.original)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Excluir">
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(row.original)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                padding: "8px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => handleAddClick()}
                variant="contained"
                sx={{ backgroundColor: "#104467" }}
              >
                Adicionar Novo Processo
              </Button>
            </Box>
          )}
        />
      </ContainerTable>
      <ProcessTableModal
        open={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        processo={processo}
        selectedArea={selectedArea}
      />
    </Container>
  );
};

export default Tabela;
