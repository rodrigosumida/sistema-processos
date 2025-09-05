import { MacroprocessoItemContainer } from "./styled";

import { Delete, Edit } from "@mui/icons-material";

const MacroprocessoItem = ({
  macroprocesso,
  selected,
  onClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div style={{ border: "1px solid #bbb", borderRadius: 5 }}>
      <div style={{ display: "flex", justifyContent: "end", padding: 2 }}>
        <Delete
          sx={{ fontSize: 20, cursor: "pointer" }}
          onClick={() => onDeleteClick(macroprocesso)}
        />
        <Edit
          sx={{ fontSize: 20, cursor: "pointer" }}
          onClick={() => onEditClick(macroprocesso)}
        />
      </div>
      <MacroprocessoItemContainer onClick={onClick} selected={selected}>
        <strong>{macroprocesso.nome}</strong>
        <span>{macroprocesso.descricao}</span>
      </MacroprocessoItemContainer>
    </div>
  );
};

export default MacroprocessoItem;
