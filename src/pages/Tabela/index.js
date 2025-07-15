import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Container, ContainerTable } from "./styled";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import dadosJson from "../../data/tarefas.json";
import { ProcessTableModal } from "../../components/ProcessTableModal";
import api from "../../api/axios";
import { toast } from "react-toastify";

const Tabela = () => {
  const [tableData, setTableData] = useState(dadosJson);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [processo, setProcesso] = useState({});

  const getData = async () => {
    try {
      const { data } = await api.get("/processo");
      console.log(data);
      setTableData(data);
    } catch (err) {
      toast.error("Ocorreu um erro!");
    }
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
    },
    {
      accessorKey: "inovacao",
      header: "Inovação/Impacto",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
    },
    {
      accessorKey: "analise",
      header: "Análise",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
    },
    {
      accessorKey: "sistematizacao",
      header: "Sistematização",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
    },
    {
      accessorKey: "auxilio",
      header: "Auxílio",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
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
      Cell: ({ cell }) => (
        <Box sx={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {cell.getValue()?.map((cargo, idx) => (
            <Chip key={cargo._id || idx} label={cargo.nome} size="small" />
          ))}
        </Box>
      ),
    },
  ];

  useEffect(() => {
    getData();
    console.log("FOI");
  }, []);

  return (
    <Container>
      <Header />
      <ContainerTable>
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
          data={tableData}
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
      />
    </Container>
  );
};

export default Tabela;
