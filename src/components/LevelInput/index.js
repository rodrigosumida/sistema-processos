import { TextField } from "@mui/material";

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
      <TextField
        id={label}
        name={label}
        type="number"
        value={values[label]}
        disabled={type === "delete"}
        onChange={(e) => {
          if (!e.target.value)
            setValues({
              ...values,
              [label]: null,
            });
          if (parseInt(e.target.value) < 0 || parseInt(e.target.value) > 5) {
            e.target.value = null;
            return;
          }
          setValues({
            ...values,
            [label]: parseInt(e.target.value),
          });
          setError("");
        }}
        onKeyDown={(e) => {
          if (
            ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
              e.key
            )
          ) {
            return;
          }

          if (!/^\d$/.test(e.key)) {
            e.preventDefault();
          }
        }}
        onPaste={(e) => {
          if (!/^\d+$/.test(e.clipboardData.getData("text"))) {
            e.preventDefault();
          }
        }}
      />
    </>
  );
};
