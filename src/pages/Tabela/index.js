import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  ColumnContainer,
  Container,
  ContainerAreaInput,
  ContainerCheckCell,
  LeftTableContainer,
  MacroprocessoTable,
} from "./styled";
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
import { useDispatch, useSelector } from "react-redux";
import { mudarHeader } from "../../store/modules/header/actions";
import { ContentContainer } from "../../styles/GlobalStyles";
import { MacroprocessoModal } from "../../components/MacroprocessoModal";
import MacroprocessoItem from "../../components/MacroprocessoItem";
// import { BooleanCell } from "../../components/BooleanCell";

const Tabela = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [macroprocessoData, setMacroprocessoData] = useState([]);
  const [selectedMacro, setSelectedMacro] = useState(null);

  const [areaData, setAreaData] = useState([]);
  const [selectedArea, setSelectedArea] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [macroprocessoModalOpen, setMacroprocessoModalOpen] = useState(false);
  const [macroprocessoModalType, setMacroprocessoModalType] = useState(null);

  const [processo, setProcesso] = useState({});
  const [macroprocesso, setMacroprocesso] = useState({});

  const dispatch = useDispatch();
  dispatch(mudarHeader("Tabela"));

  const compact = useSelector((state) => state.header.compact);

  const buildTableData = (processos) => {
    return processos.flatMap((proc) =>
      proc.etapas.length
        ? proc.etapas.map((etapa, i) => ({
            _id: proc._id,
            processo: proc.processo,
            macroprocesso: proc.macroprocesso,
            area: proc.area,
            descricao: proc.descricao,
            etapaIndex: i + 1,
            ...etapa,
          }))
        : [
            {
              _id: proc._id,
              processo: proc.processo,
              macroprocesso: proc.macroprocesso,
              area: proc.area,
              descricao: proc.descricao,
              etapaIndex: null,
            },
          ]
    );
  };

  const getData = async () => {
    try {
      const { data: areas } = await api.get("/area");
      setAreaData(areas);

      const { data: processos } = await api.get("/processo");
      const { data: macroprocessos } = await api.get("/macroprocesso");

      setTableData(processos);
      setMacroprocessoData(macroprocessos);

      let currentArea = selectedArea;
      if (!selectedArea || !selectedArea._id) {
        currentArea = areas[0];
        setSelectedArea(currentArea);
      }

      const selectedAreaData = processos.filter(
        (item) => item.area?._id === currentArea._id
      );

      const flattened = buildTableData(selectedAreaData);
      setFilteredData(flattened);

      console.log("DONE");
    } catch (err) {
      toast.error("Ocorreu um erro!");
    }
  };

  const handleChangeArea = (value) => {
    setSelectedArea(value || {});

    const data = tableData.filter((item) => item.area?._id === value._id);
    setFilteredData(buildTableData(data));
  };

  const handleAddClick = () => {
    setModalOpen(true);
    setModalType("create");
  };

  const handleAddMacroprocessoClick = () => {
    setMacroprocessoModalType("create");
    setMacroprocessoModalOpen(true);
  };

  const handleEditClick = (item) => {
    setProcesso(item);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleEditMacroprocessoClick = (item) => {
    setMacroprocesso(item);
    setMacroprocessoModalType("edit");
    setMacroprocessoModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setProcesso(item);
    setModalType("delete");
    setModalOpen(true);
  };

  const handleDeleteMacroprocessoClick = (item) => {
    setMacroprocesso(item);
    setMacroprocessoModalType("delete");
    setMacroprocessoModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setMacroprocessoModalOpen(false);
    setModalType(null);
    setMacroprocessoModalType(null);
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
    // {
    //   accessorFn: (row) => row.macroprocesso?._id,
    //   id: "macroprocesso",
    //   header: "Macroprocesso",
    //   muiTableHeadCellProps: {
    //     sx: {
    //       verticalAlign: "bottom",
    //       paddingBottom: "8px",
    //     },
    //   },
    //   Cell: ({ row }) => {
    //     const macro = row.original.macroprocesso;

    //     return (
    //       <Box
    //         sx={{
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "space-between",
    //           gap: 2,
    //         }}
    //       >
    //         <Box>
    //           <strong>{macro?.nome}</strong>
    //           {macro?.descricao && (
    //             <div style={{ fontSize: "0.8em", color: "#666" }}>
    //               {macro.descricao}
    //             </div>
    //           )}
    //         </Box>

    //         <Box sx={{ display: "flex", gap: "0.5rem" }}>
    //           <Tooltip arrow placement="top" title="Editar Macroprocesso">
    //             <IconButton
    //               size="small"
    //               onClick={() =>
    //                 handleEditMacroprocessoClick(row.original.macroprocesso)
    //               }
    //             >
    //               <Edit fontSize="small" />
    //             </IconButton>
    //           </Tooltip>
    //           <Tooltip arrow placement="top" title="Excluir Macroprocesso">
    //             <IconButton
    //               size="small"
    //               color="error"
    //               onClick={() =>
    //                 handleDeleteMacroprocessoClick(row.original.macroprocesso)
    //               }
    //             >
    //               <Delete fontSize="small" />
    //             </IconButton>
    //           </Tooltip>
    //         </Box>
    //       </Box>
    //     );
    //   },
    // },
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
      accessorKey: "etapa",
      header: "Etapa",
      size: 10,
      Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : ""),
    },
    {
      accessorKey: "tempoGasto",
      header: "Tempo",
      size: 10,
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
      Cell: ({ cell }) => {
        return (
          <ContainerCheckCell>
            {cell.getValue() ? `${cell.getValue()} horas` : ""}
          </ContainerCheckCell>
        );
      },
    },
    {
      accessorKey: "gestao",
      header: "Gestão",
      muiTableHeadCellProps: verticalHeaderStyle,
      size: 10,
      Cell: ({ cell }) => {
        return (
          <ContainerCheckCell>{cell.getValue() ? "x" : ""}</ContainerCheckCell>
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
          <ContainerCheckCell>{cell.getValue() ? "x" : ""}</ContainerCheckCell>
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
          <ContainerCheckCell>{cell.getValue() ? "x" : ""}</ContainerCheckCell>
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
          <ContainerCheckCell>{cell.getValue() ? "x" : ""}</ContainerCheckCell>
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
          <ContainerCheckCell>{cell.getValue() ? "x" : ""}</ContainerCheckCell>
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
      <ContentContainer compact={compact}>
        <ColumnContainer>
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
            enableGrouping
            positionToolbarAlertBanner={"none"}
            enablePagination={false}
            columns={columns}
            data={filteredData}
            initialState={{ grouping: ["processo"], density: "compact" }}
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
            positionActionsColumn="last"
            muiTableHeadCellProps={{
              sx: {
                verticalAlign: "bottom",
                paddingBottom: "8px",
              },
            }}
            muiTableBodyCellProps={({ cell, row }) => {
              const colunasComEstilo = [
                "gestao",
                "inovacao",
                "analise",
                "sistematizacao",
                "auxilio",
              ];

              if (
                !row.getIsGrouped() &&
                colunasComEstilo.includes(cell.column.id)
              ) {
                return {
                  sx: {
                    borderLeft: "1px solid rgba(224, 224, 224, 1)",
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                  },
                };
              }

              return {};
            }}
            rowGroupingExpandMode="multiple"
            enableExpanding
            renderDetailPanel={({ row }) => {
              const etapas = row.original.etapas || [];
              return etapas.length ? (
                <Box sx={{ p: 2 }}>
                  {etapas.map((etapa, i) => (
                    <Box
                      key={i}
                      sx={{
                        mb: 1,
                        p: 1,
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    >
                      <strong>Etapa {i + 1}:</strong> {etapa.nome}
                      {console.log(etapa)}
                      {etapa.descricao && (
                        <div style={{ fontSize: "0.85em", color: "#666" }}>
                          {etapa.descricao}
                        </div>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 2, fontStyle: "italic", color: "#999" }}>
                  Nenhuma etapa cadastrada.
                </Box>
              );
            }}
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
        </ColumnContainer>
        <LeftTableContainer>
          <MacroprocessoTable>
            <Button
              onClick={() => handleAddMacroprocessoClick()}
              variant="contained"
              sx={{ backgroundColor: "#104467" }}
            >
              Adicionar Novo Macroprocesso
            </Button>
            {macroprocessoData
              .filter((item) => item.area === selectedArea._id)
              .map((macroprocesso) => (
                <MacroprocessoItem
                  key={macroprocesso._id}
                  macroprocesso={macroprocesso}
                  selected={macroprocesso._id === selectedMacro?._id}
                  onClick={() => {
                    setSelectedMacro(macroprocesso);
                    const processosDoMacro = tableData.filter(
                      (proc) => proc.macroprocesso?._id === macroprocesso._id
                    );
                    setFilteredData(buildTableData(processosDoMacro));
                  }}
                  onEditClick={handleEditMacroprocessoClick}
                  onDeleteClick={handleDeleteMacroprocessoClick}
                />
              ))}
          </MacroprocessoTable>
        </LeftTableContainer>
      </ContentContainer>
      <MacroprocessoModal
        open={macroprocessoModalOpen}
        onClose={handleCloseModal}
        type={macroprocessoModalType}
        macroprocesso={macroprocesso}
        selectedArea={selectedArea}
      />
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
