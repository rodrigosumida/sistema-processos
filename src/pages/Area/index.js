import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Container, ContainerTable } from "./styled";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import api from "../../api/axios";
import { toast } from "react-toastify";
import { AreaTableModal } from "../../components/AreaTableModal";

const Area = () => {
  const [tableData, setTableData] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [area, setArea] = useState({});

  const getData = async () => {
    try {
      const { data } = await api.get("/area-cargo-responsavel/group-area");
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
    setArea(item);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setArea(item);
    setModalType("delete");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setArea({});
    getData();
  };

  const columns = [
    {
      accessorKey: "area",
      header: "Área",
      Cell: ({ cell }) => cell.getValue()?.nome ?? "—",
      muiTableHeadCellProps: {
        sx: { verticalAlign: "bottom", paddingBottom: "8px" },
      },
    },
    {
      accessorKey: "cargos",
      header: "Cargos",
      muiTableHeadCellProps: {
        sx: { verticalAlign: "bottom", paddingBottom: "8px" },
      },
      Cell: ({ cell }) => {
        const valor = cell.getValue();
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {valor?.map((item, idx) => (
              <Chip
                key={idx}
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
  }, []);

  return (
    <Container>
      <Header />
      <ContainerTable>
        <MaterialReactTable
          enableRowActions
          displayColumnDefOptions={{
            "mrt-row-actions": {
              header: "Ações",
              size: 50,
              minSize: 40,
              maxSize: 80,
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
                Adicionar Nova Área
              </Button>
            </Box>
          )}
        />
      </ContainerTable>
      <AreaTableModal
        open={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        item={area}
      />
    </Container>
  );
};

export default Area;
