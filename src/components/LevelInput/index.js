import { Checkbox } from "@mui/material";

export const LevelInput = ({ label, values, setValues, setError, type }) => {
  const labelText = {
    gestao: "Gestão",
    inovacao: "Inovação/Impacto",
    analise: "Análise",
    sistematizacao: "Sistematização",
    auxilio: "Auxílio",
  };

  return (
    <>
      <label for={label}>{`${labelText[label]}:`}</label>
      <div
        style={{
          width: "fit-content",
          height: "fit-content",
          alignSelf: "center",
        }}
      >
        <Checkbox
          id={label}
          name={label}
          checked={values[label]}
          disabled={type === "delete"}
          onChange={(e) => {
            setValues({ ...values, [label]: e.target.checked });
            setError("");
          }}
        />
      </div>
    </>
  );
};
