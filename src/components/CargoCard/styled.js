import styled from "styled-components";

export const ContainerHistorico = styled.div`
  width: 100%;
  border: 2px solid #104467;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 15px 18px 18px -18px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  h3 {
    color: #104467;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TopBarActions = styled.div`
  height: 25px;
  display: flex;
  gap: 5px;
`;

export const IconContainer = styled.div`
  background-color: blanchedalmond;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;
