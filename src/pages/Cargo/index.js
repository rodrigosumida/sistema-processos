import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Container } from "./styled";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import api from "../../api/axios";
import { toast } from "react-toastify";
import { DefaultTableModal } from "../../components/DefaultTableModal";
import { useDispatch, useSelector } from "react-redux";
import { mudarHeader } from "../../store/modules/header/actions";
import { ContentContainer } from "../../styles/GlobalStyles";
// import { BooleanCell } from "../../components/BooleanCell";

const Cargo = () => {
  const [tableData, setTableData] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [cargo, setCargo] = useState({});

  const dispatch = useDispatch();
  dispatch(mudarHeader("Cargo"));

  const compact = useSelector((state) => state.header.compact);

  const getData = async () => {
    try {
      const { data } = await api.get("/cargo");
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
    setCargo(item);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setCargo(item);
    setModalType("delete");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setCargo({});
    getData();
  };

  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
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
      <ContentContainer compact={compact}>
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
                Adicionar Novo cargo
              </Button>
            </Box>
          )}
        />
      </ContentContainer>
      <DefaultTableModal
        open={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        item={cargo}
        table={"cargo"}
      />
    </Container>
  );
};

export default Cargo;
