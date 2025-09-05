import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  section: { marginBottom: 2 },
  numbersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  title: { fontSize: 16, marginBottom: 2 },
  tableRow: { flexDirection: "row", borderBottom: 1, paddingBottom: 4 },
  tableCol: { width: "33%", paddingLeft: 6, paddingRight: 6 },
  image: { height: 150, objectFit: "contain" },
});

const nomes = {
  gestao: "Gestão",
  inovacao: "Inovação/Impacto",
  analise: "Análise",
  sistematizacao: "Sistematização",
  auxilio: "Auxílio",
};

const RelatorioPDF = ({
  area,
  totais,
  total,
  macroprocessos,
  atividades,
  imagemPizza,
  imagemBarra,
  imagemBarraStackada,
  dadosTabelaCargo,
  dadosTabelaCategoria,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Relatório da Área: {area?.nome}</Text>

      <View style={styles.section}>
        <View style={styles.numbersContainer}>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <View style={{ marginBottom: 10 }}>
              <Text>Macroprocessos: {macroprocessos}</Text>
              <Text>Atividades: {atividades}</Text>
            </View>

            <View style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Text style={{ fontWeight: "bold" }}>Totais por atributo:</Text>
              <View>
                {Object.entries(totais).map(([key, value]) => (
                  <Text key={key}>{`${nomes[key] || key}: ${value}`}</Text>
                ))}
              </View>
              <Text>Total geral: {total}</Text>
            </View>
          </View>

          {imagemPizza && <Image src={imagemPizza} style={styles.image} />}
        </View>
      </View>

      {imagemBarra && (
        <View style={styles.section}>
          <Text>Gráfico de Tempo por Atributo:</Text>
          <Image src={imagemBarra} style={styles.image} />
        </View>
      )}

      {imagemBarraStackada && (
        <View style={styles.section}>
          <Text>Gráfico de Responsabilidades por Cargo:</Text>
          <Image
            src={imagemBarraStackada}
            style={{ ...styles.image, height: 300 }}
          />
        </View>
      )}
    </Page>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          Tabela por Cargo:
        </Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Cargo</Text>
          <Text style={styles.tableCol}>Qtd. Processos</Text>
          <Text style={styles.tableCol}>Tempo Total (h)</Text>
        </View>
        {dadosTabelaCargo.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCol}>{row.cargo}</Text>
            <Text style={styles.tableCol}>{row.qnt_processos}</Text>
            <Text style={styles.tableCol}>{row.tempo}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          Tabela por Macroprocesso:
        </Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Macroprocesso</Text>
          <Text style={styles.tableCol}>Qtd. Processos</Text>
          <Text style={styles.tableCol}>Tempo Total (h)</Text>
        </View>
        {dadosTabelaCategoria.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCol}>{row.macroprocesso}</Text>
            <Text style={styles.tableCol}>{row.qnt_processos}</Text>
            <Text style={styles.tableCol}>{row.tempo}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default RelatorioPDF;
