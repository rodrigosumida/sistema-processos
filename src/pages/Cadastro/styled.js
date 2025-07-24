import styled from "styled-components";

export const Content = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  label {
    font-size: 0.8rem;
    margin-bottom: 3px;
    color: #104467;
  }

  input {
    height: 40px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid rgba(16, 68, 103, 0.34);
  }

  .erro {
    color: red;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    font-size: 15px;
    align-self: start;
  }
`;

export const Button = styled.button`
  background: #104467;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 10px;
  margin: 3px;
  color: white;

  &:hover {
    background: rgb(9, 41, 61);
  }

  &:disabled {
    background-color: rgb(160, 160, 160);
    cursor: not-allowed;
  }
`;

export const RegisterButton = styled.button`
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 10px;
  margin: 3px;
  color: #104467;
`;
