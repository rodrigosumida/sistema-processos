import { MacroprocessoItemContainer } from "./styled";

const MacroprocessoItem = ({
  macroprocesso,
  selected,
  onClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <MacroprocessoItemContainer onClick={onClick} selected={selected}>
      <strong>{macroprocesso.nome}</strong>
      <span>{macroprocesso.descricao}</span>
    </MacroprocessoItemContainer>
  );
};

export default MacroprocessoItem;
