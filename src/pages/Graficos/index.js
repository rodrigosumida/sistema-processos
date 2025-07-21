import { BarChart, PieChart } from "@mui/x-charts";
import Header from "../../components/Header";
import {
  BoxGrafico,
  Container,
  ContainerAreaInput,
  ContainerGraficos,
} from "./styled";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { mudarHeader } from "../../store/modules/header/actions";
import { ContentContainer } from "../../styles/GlobalStyles";

const Graficos = () => {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [areaData, setAreaData] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const [totalAtributos, setTotalAtributos] = useState({});
  const [total, setTotal] = useState(null);

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
        console.log(cargo);
        // const nome = `${cargo.cargo?.nome} (${cargo.responsavel?.nome})`;
        const nome = cargo.responsavel?.nome;
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

    return Object.entries(mapa).map(([nome, valores]) => {
      const total =
        valores.gestao +
        valores.inovacao +
        valores.analise +
        valores.sistematizacao +
        valores.auxilio;

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
    });
  };

  const handleChangeArea = (value) => {
    setSelectedArea(value || {});

    const data = rawData.filter((item) => item.area?._id === value._id);
    setFilteredData(data);
    calcularTotais(data);
  };

  useEffect(() => {
    console.log("asd");
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Header />
      <ContentContainer compact={compact}>
        <ContainerAreaInput>
          <Autocomplete
            disablePortal
            disableClearable
            options={areaData}
            getOptionLabel={(option) => option.nome || ""}
            value={areaData.find((a) => a._id === selectedArea._id) || null}
            renderInput={(params) => <TextField {...params} />}
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
            onChange={(e, value) => handleChangeArea(value)}
          />
        </ContainerAreaInput>
        <ContainerGraficos>
          <BoxGrafico>
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.percentual}%`,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  data: gerarDadosAtributosComPorcentagem(),
                },
              ]}
            />
          </BoxGrafico>
          <BoxGrafico>
            <BarChart
              dataset={gerarDadosCargosComPorcentagem(filteredData)}
              xAxis={[{ scaleType: "band", dataKey: "nome", label: "Cargo" }]}
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
                  label: "Inovação",
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
          </BoxGrafico>
        </ContainerGraficos>
      </ContentContainer>
    </Container>
  );
};

export default Graficos;
