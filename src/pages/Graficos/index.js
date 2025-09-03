import { BarChart, PieChart } from "@mui/x-charts";
import Header from "../../components/Header";
import {
  BigNumber,
  BoxGrafico,
  Container,
  ContainerAreaInput,
  Content,
  DashboardContainer,
  DashboardLeft,
  DashboardRight,
  DinamicTableContainer,
  NumbersContainer,
  LowerDashboard,
  NumberContainer,
  TotalContainer,
  UpperDashboard,
  UpperLeftSection,
  UpperRightSection,
  IndicatorsContainer,
  BoxGraficoAlt,
  GerarPdfButton,
} from "./styled";
import api from "../../api/axios";
// eslint-disable-next-line no-unused-vars
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { mudarHeader } from "../../store/modules/header/actions";
import { ContentContainer } from "../../styles/GlobalStyles";
import { MaterialReactTable } from "material-react-table";
import dayjs from "dayjs";
import RelatorioPDF from "../../components/RelatorioPdf";
import { toast } from "react-toastify";

const Graficos = () => {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [areaData, setAreaData] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const [totalAtributos, setTotalAtributos] = useState({});
  const [total, setTotal] = useState(null);

  const [pdfData, setPdfData] = useState(null);
  const [gerandoPdf, setGerandoPDf] = useState(false);

  const refPizza = useRef();
  const refBarra = useRef();
  const refBarraStackada = useRef();

  const dispatch = useDispatch();
  dispatch(mudarHeader("Graficos"));

  const compact = useSelector((state) => state.header.compact);

  const getData = async () => {
    const { data } = await api.get("/processo");
    setRawData(data);

    const { data: areas } = await api.get("/area");
    setAreaData(areas);

    if (!selectedArea || !selectedArea._id) {
      const defaultArea = areas[0];
      setSelectedArea(defaultArea);

      const filtered = data.filter(
        (item) => item.area?._id === defaultArea?._id
      );
      setFilteredData(filtered);
      calcularTotais(filtered);
    } else {
      const filtered = data.filter(
        (item) => item.area?._id === selectedArea._id
      );
      setFilteredData(filtered);
      calcularTotais(filtered);
    }
  };

  const calcularTotais = (dados) => {
    const totais = {
      gestao: 0,
      inovacao: 0,
      analise: 0,
      sistematizacao: 0,
      auxilio: 0,
    };

    dados.forEach((item) => {
      totais.gestao += item.gestao || 0;
      totais.inovacao += item.inovacao || 0;
      totais.analise += item.analise || 0;
      totais.sistematizacao += item.sistematizacao || 0;
      totais.auxilio += item.auxilio || 0;
    });

    // Soma o total de todos os atributos
    const totalGeral = Object.values(totais).reduce((acc, val) => acc + val, 0);

    setTotalAtributos(totais);
    setTotal(totalGeral);
  };

  const gerarDadosAtributosComPorcentagem = () => {
    if (!total) return [];

    const map = [
      { key: "gestao", label: "Gestão", color: "#ff9900" },
      { key: "inovacao", label: "Inovação/Impacto", color: "#a50021" },
      { key: "analise", label: "Análise", color: "#9999ff" },
      { key: "sistematizacao", label: "Sistematização", color: "#669900" },
      { key: "auxilio", label: "Auxílio", color: "#ffff00" },
    ];

    return map.map((item, index) => {
      const valor = totalAtributos[item.key] || 0;
      const percentual = ((valor / total) * 100).toFixed(1);
      return {
        id: index,
        value: valor,
        label: item.label,
        percentual: percentual,
        color: item.color,
      };
    });
  };

  const gerarDadosCargosComPorcentagem = (dados) => {
    const mapa = {};

    dados.forEach((item) => {
      const {
        gestao = 0,
        inovacao = 0,
        analise = 0,
        sistematizacao = 0,
        auxilio = 0,
      } = item;

      item.estruturaCargos.forEach((cargo) => {
        // const nome = `${cargo.cargo?.nome} (${cargo.responsavel?.nome})`;
        const nome = cargo.cargo?.nome;
        if (!mapa[nome]) {
          mapa[nome] = {
            gestao: 0,
            inovacao: 0,
            analise: 0,
            sistematizacao: 0,
            auxilio: 0,
          };
        }

        mapa[nome].gestao += gestao;
        mapa[nome].inovacao += inovacao;
        mapa[nome].analise += analise;
        mapa[nome].sistematizacao += sistematizacao;
        mapa[nome].auxilio += auxilio;
      });
    });

    return Object.entries(mapa)
      .map(([nome, valores]) => {
        const total =
          valores.gestao +
          valores.inovacao +
          valores.analise +
          valores.sistematizacao +
          valores.auxilio;

        if (total === 0) return null;

        return {
          nome,
          gestao: parseFloat(((valores.gestao / total) * 100).toFixed(1)),
          inovacao: parseFloat(((valores.inovacao / total) * 100).toFixed(1)),
          analise: parseFloat(((valores.analise / total) * 100).toFixed(1)),
          sistematizacao: parseFloat(
            ((valores.sistematizacao / total) * 100).toFixed(1)
          ),
          auxilio: parseFloat(((valores.auxilio / total) * 100).toFixed(1)),
        };
      })
      .filter(Boolean);
  };

  const gerarDadosTempoPorAtributo = (dados) => {
    const totais = {
      gestao: 0,
      inovacao: 0,
      analise: 0,
      sistematizacao: 0,
      auxilio: 0,
    };

    dados.forEach((item) => {
      const tempo = item.tempoGasto || 0;

      if (item.gestao) totais.gestao += tempo;
      if (item.inovacao) totais.inovacao += tempo;
      if (item.analise) totais.analise += tempo;
      if (item.sistematizacao) totais.sistematizacao += tempo;
      if (item.auxilio) totais.auxilio += tempo;
    });

    return [
      { atributo: "Gestão", valor: totais.gestao, color: "#ff9900" },
      {
        atributo: "Inovação/Impacto",
        valor: totais.inovacao,
        color: "#a50021",
      },
      { atributo: "Análise", valor: totais.analise, color: "#9999ff" },
      {
        atributo: "Sistematização",
        valor: totais.sistematizacao,
        color: "#669900",
      },
      { atributo: "Auxílio", valor: totais.auxilio, color: "#ffff00" },
    ];
  };

  const gerarDadosTabelaPorCargo = (dados) => {
    const mapa = {};

    dados.forEach((processo) => {
      const { tempoGasto, estruturaCargos } = processo;

      estruturaCargos.forEach((item) => {
        const nomeCargo = item?.cargo?.nome;
        if (!nomeCargo) return;

        if (!mapa[nomeCargo]) {
          mapa[nomeCargo] = {
            cargo: nomeCargo,
            qnt_processos: 0,
            tempo: 0,
          };
        }

        mapa[nomeCargo].qnt_processos += 1;
        mapa[nomeCargo].tempo += tempoGasto || 0;
      });
    });

    return Object.values(mapa);
  };

  const gerarDadosTabelaPorCategoria = (dados) => {
    const mapa = {};

    dados.forEach((item) => {
      const categoria = item.macroprocesso?.nome || "Sem categoria";
      const tempo = item.tempoGasto || 0;

      if (!mapa[categoria]) {
        mapa[categoria] = {
          categoria,
          qnt_processos: 0,
          tempo: 0,
        };
      }

      mapa[categoria].qnt_processos += 1;
      mapa[categoria].tempo += tempo;
    });

    return Object.values(mapa);
  };

  const gerarDadosAtributosComPorcentagemPorCategoria = (dados, categoria) => {
    const filtrado = dados.filter(
      (item) => item.macroprocesso?.nome === categoria
    );

    const totalAtributos = {
      gestao: 0,
      inovacao: 0,
      analise: 0,
      sistematizacao: 0,
      auxilio: 0,
    };

    filtrado.forEach((item) => {
      totalAtributos.gestao += item.gestao || 0;
      totalAtributos.inovacao += item.inovacao || 0;
      totalAtributos.analise += item.analise || 0;
      totalAtributos.sistematizacao += item.sistematizacao || 0;
      totalAtributos.auxilio += item.auxilio || 0;
    });

    const total =
      totalAtributos.gestao +
      totalAtributos.inovacao +
      totalAtributos.analise +
      totalAtributos.sistematizacao +
      totalAtributos.auxilio;

    if (!total) return [];

    const map = [
      { key: "gestao", label: "Gestão", color: "#ff9900" },
      { key: "inovacao", label: "Inovação/Impacto", color: "#a50021" },
      { key: "analise", label: "Análise", color: "#9999ff" },
      { key: "sistematizacao", label: "Sistematização", color: "#669900" },
      { key: "auxilio", label: "Auxílio", color: "#ffff00" },
    ];

    return map.map((item, index) => {
      const valor = totalAtributos[item.key];
      const percentual = ((valor / total) * 100).toFixed(1);
      return {
        id: index,
        value: valor,
        label: item.label,
        percentual,
        color: item.color,
      };
    });
  };

  const handleChangeArea = (value) => {
    setSelectedArea(value || {});
    setPdfData(null);

    const data = rawData.filter((item) => item.area?._id === value._id);
    setFilteredData(data);
    calcularTotais(data);
  };

  const timeColumns = [
    {
      accessorKey: "cargo",
      header: "Cargo",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
    },
    {
      accessorKey: "qnt_processos",
      header: "Qtd. Processos",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
    },
    {
      accessorKey: "tempo",
      header: "Tempo total",
      size: 10,
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
      Cell: ({ cell }) => `${cell.getValue()} horas`,
    },
  ];

  const categoryColumns = [
    {
      accessorKey: "categoria",
      header: "Macroprocesso",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
    },
    {
      accessorKey: "qnt_processos",
      header: "Qtd. Processos",
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
    },
    {
      accessorKey: "tempo",
      header: "Tempo total",
      size: 10,
      muiTableHeadCellProps: {
        sx: {
          verticalAlign: "bottom",
          paddingBottom: "8px",
        },
      },
      Cell: ({ cell }) => `${cell.getValue()} horas`,
    },
  ];

  const capturarGraficoRef = async (ref) => {
    if (!ref.current) {
      console.warn("Elemento não encontrado via ref.");
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const canvas = await html2canvas(ref.current, {
        useCORS: true,
        backgroundColor: "#fff",
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Erro ao capturar gráfico por ref:", error);
      return null;
    }
  };

  const handleGerarPDF = async () => {
    setPdfData(null);
    setGerandoPDf(true);
    toast.info("Gerando PDF...");

    try {
      const imagemPizza = await capturarGraficoRef(refPizza);
      const imagemBarra = await capturarGraficoRef(refBarra);
      const imagemBarraStackada = await capturarGraficoRef(refBarraStackada);

      setPdfData({
        imagemPizza,
        imagemBarra,
        imagemBarraStackada,
        dadosTabelaCargo: gerarDadosTabelaPorCargo(filteredData),
        dadosTabelaCategoria: gerarDadosTabelaPorCategoria(filteredData),
      });
      toast.success("PDF Gerado!");
      setGerandoPDf(false);
    } catch (err) {
      toast.error("Erro: ", err);
    }
  };

  useEffect(() => {
    console.log("asd");
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const macroprocessos = new Set(
    filteredData.map((item) => item.macroprocesso?.nome)
  ).size;
  const atividades = filteredData.length;

  return (
    <Container>
      <Header />
      <ContentContainer compact={compact}>
        <Content>
          <DashboardContainer>
            <DashboardLeft>
              <UpperDashboard>
                <UpperLeftSection>
                  <ContainerAreaInput>
                    <Autocomplete
                      disablePortal
                      disableClearable
                      options={areaData}
                      getOptionLabel={(option) => option.nome || ""}
                      value={
                        areaData.find((a) => a._id === selectedArea._id) || null
                      }
                      renderInput={(params) => <TextField {...params} />}
                      sx={{
                        width: "100%",
                        ":hover": {
                          cursor: "pointer",
                        },
                      }}
                      onChange={(e, value) => handleChangeArea(value)}
                    />
                    <Box sx={{ display: "flex", gap: "8px" }}>
                      <GerarPdfButton
                        onClick={handleGerarPDF}
                        disabled={gerandoPdf}
                      >
                        Preparar Relatório
                      </GerarPdfButton>

                      {pdfData && (
                        <PDFDownloadLink
                          document={
                            <RelatorioPDF
                              area={selectedArea}
                              totais={totalAtributos}
                              total={total}
                              macroprocessos={macroprocessos}
                              atividades={atividades}
                              imagemPizza={pdfData.imagemPizza}
                              imagemBarra={pdfData.imagemBarra}
                              imagemBarraStackada={pdfData.imagemBarraStackada}
                              dadosTabelaCargo={pdfData.dadosTabelaCargo}
                              dadosTabelaCategoria={
                                pdfData.dadosTabelaCategoria
                              }
                            />
                          }
                          fileName={`${selectedArea?.nome}_${dayjs().format(
                            "YYYY-MM-DD"
                          )}.pdf`}
                          style={{
                            backgroundColor: "#0a6fa6",
                            padding: "6px 12px",
                            color: "white",
                            borderRadius: "5px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.8rem",
                          }}
                        >
                          {({ loading }) =>
                            loading ? "Gerando PDF..." : "Baixar PDF"
                          }
                        </PDFDownloadLink>
                      )}
                    </Box>
                  </ContainerAreaInput>
                  <IndicatorsContainer>
                    <NumbersContainer>
                      <NumberContainer>
                        <BigNumber>{macroprocessos}</BigNumber>
                        <span>MACROPROCESSOS</span>
                      </NumberContainer>
                      <NumberContainer>
                        <BigNumber>{atividades}</BigNumber>
                        <span>ATIVIDADES</span>
                      </NumberContainer>
                    </NumbersContainer>
                    <TotalContainer>
                      <div ref={refPizza} id="graficoPizza">
                        <PieChart
                          id="graficoPizza"
                          height={195}
                          series={[
                            {
                              arcLabel: (item) => `${item.percentual}%`,
                              arcLabelMinAngle: 35,
                              arcLabelRadius: "60%",
                              data: gerarDadosAtributosComPorcentagem(),
                            },
                          ]}
                        />
                      </div>
                    </TotalContainer>
                  </IndicatorsContainer>
                </UpperLeftSection>
                <UpperRightSection>
                  <BoxGrafico>
                    <div
                      ref={refBarra}
                      id="graficoBarra"
                      style={{ height: "100%" }}
                    >
                      <BarChart
                        id="graficoBarra"
                        dataset={gerarDadosTempoPorAtributo(filteredData)}
                        xAxis={[{ label: "Tempo Gasto (h)", dataKey: "valor" }]}
                        yAxis={[
                          {
                            scaleType: "band",
                            dataKey: "atributo",
                            label: "Atributo",
                          },
                        ]}
                        grid={{ vertical: true }}
                        series={[
                          {
                            dataKey: "valor",
                            label: "Tempo Gasto",
                            color: ({ color }) => color,
                            valueFormatter: (v) => `${v}h`,
                          },
                        ]}
                        layout="horizontal"
                      />
                    </div>
                  </BoxGrafico>
                </UpperRightSection>
              </UpperDashboard>
              <LowerDashboard>
                <BoxGrafico>
                  <div ref={refBarraStackada} id="graficoBarraStackada">
                    <BarChart
                      id="graficoBarraStackada"
                      height={240}
                      key={selectedArea?._id}
                      dataset={gerarDadosCargosComPorcentagem(filteredData)}
                      xAxis={[
                        { scaleType: "band", dataKey: "nome", label: "Cargo" },
                      ]}
                      yAxis={[{ label: "Porcentagem (%)" }]}
                      grid={{ horizontal: true }}
                      series={[
                        {
                          dataKey: "gestao",
                          label: "Gestão",
                          stack: "total",
                          color: "#ff9900",
                          valueFormatter: (v) => `${v.toFixed(1)}%`,
                        },
                        {
                          dataKey: "inovacao",
                          label: "Inovação/Impacto",
                          stack: "total",
                          color: "#a50021",
                          valueFormatter: (v) => `${v.toFixed(1)}%`,
                        },
                        {
                          dataKey: "analise",
                          label: "Análise",
                          stack: "total",
                          color: "#9999ff",
                          valueFormatter: (v) => `${v.toFixed(1)}%`,
                        },
                        {
                          dataKey: "sistematizacao",
                          label: "Sistematização",
                          stack: "total",
                          color: "#669900",
                          valueFormatter: (v) => `${v.toFixed(1)}%`,
                        },
                        {
                          dataKey: "auxilio",
                          label: "Auxílio",
                          stack: "total",
                          color: "#ffff00",
                          valueFormatter: (v) => `${v.toFixed(1)}%`,
                        },
                      ]}
                    />
                  </div>
                </BoxGrafico>
              </LowerDashboard>
            </DashboardLeft>
            <DashboardRight>
              <BoxGrafico>
                <MaterialReactTable
                  columns={timeColumns}
                  data={gerarDadosTabelaPorCargo(filteredData)}
                  enableTopToolbar={false}
                  muiTablePaperProps={{
                    sx: {
                      flex: 1,
                      height: "100%",
                    },
                  }}
                  initialState={{
                    density: "compact",
                  }}
                />
              </BoxGrafico>
            </DashboardRight>
          </DashboardContainer>
          <DinamicTableContainer>
            <BoxGraficoAlt>
              <MaterialReactTable
                columns={categoryColumns}
                data={gerarDadosTabelaPorCategoria(filteredData)}
                enableTopToolbar={false}
                muiTablePaperProps={{
                  sx: {
                    flex: 1,
                    height: "100%",
                  },
                }}
                initialState={{
                  density: "compact",
                }}
                enableExpanding
                muiTableBodyRowProps={{ sx: { verticalAlign: "top" } }}
                renderDetailPanel={({ row }) => {
                  const categoria = row.original.categoria;
                  const dataPie = gerarDadosAtributosComPorcentagemPorCategoria(
                    filteredData,
                    categoria
                  );

                  return (
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PieChart
                        id="graficoPizza"
                        series={[
                          {
                            arcLabel: (item) => `${item.percentual}%`,
                            arcLabelMinAngle: 35,
                            arcLabelRadius: "60%",
                            data: dataPie,
                            highlightScope: {
                              faded: "global",
                              highlighted: "item",
                            },
                            innerRadius: 40,
                            outerRadius: 80,
                          },
                        ]}
                        width={300}
                        height={200}
                      />
                    </Box>
                  );
                }}
              />
            </BoxGraficoAlt>
          </DinamicTableContainer>
          {/* {pdfData && (
            <PDFViewer width="100%" height="800px" style={{ border: "none" }}>
              <RelatorioPDF
                area={selectedArea}
                totais={totalAtributos}
                total={total}
                macroprocessos={macroprocessos}
                atividades={atividades}
                imagemPizza={pdfData.imagemPizza}
                imagemBarra={pdfData.imagemBarra}
                imagemBarraStackada={pdfData.imagemBarraStackada}
                dadosTabelaCargo={pdfData.dadosTabelaCargo}
                dadosTabelaCategoria={pdfData.dadosTabelaCategoria}
              />
            </PDFViewer>
          )} */}
        </Content>
      </ContentContainer>
    </Container>
  );
};

export default Graficos;
