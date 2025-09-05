import styled from "styled-components";

export const MacroprocessoItemContainer = styled.div`
  width: 100%;
  height: 120px;
  background-color: ${(props) => (props.selected ? "#ddd" : "white")};
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  gap: 5px;
  justify-content: center;
  text-align: justify;
  cursor: pointer;
  border-top: ${(props) =>
    props.selected ? "1px solid #bbb" : "1px solid #ddd"};
  transition: background-color 0.15s ease-in-out;

  strong {
    font-size: 1em;
  }

  span {
    font-size: 0.8em;
    color: #666;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;
