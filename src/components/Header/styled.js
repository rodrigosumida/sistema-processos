import styled from "styled-components";

export const IconContainer = styled.div`
  display: flex;
  padding: 10px 0;
  width: 100%;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.04);
    transition: background-color 0.075s ease-in-out;
  }
`;
