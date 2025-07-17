import React from "react";
import {
  ContainerHistorico,
  IconContainer,
  TitleContainer,
  TopBarActions,
  TopContainer,
} from "./styled";

import DeleteIcon from "@mui/icons-material/Delete";

const CargoCard = ({ data, handleDelete, hideActions }) => {
  const handleDeleteClick = () => {
    handleDelete(data);
  };

  return (
    <ContainerHistorico>
      <TopContainer>
        <TitleContainer>
          <h3>{data.cargo?.nome}</h3>
          <span style={{ fontSize: "0.9rem" }}>
            {`Responsável: ${data.responsavel?.nome}`}
          </span>
        </TitleContainer>
        {hideActions ? (
          <></>
        ) : (
          <TopBarActions>
            <IconContainer onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconContainer>
          </TopBarActions>
        )}
      </TopContainer>
    </ContainerHistorico>
  );
};

export default CargoCard;
