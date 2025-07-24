import styled, { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
    }

    body {
        font-family: sans-serif;
        background: #eee;
    }

    html, border-style, #root {
        height: 100%;
    }

    a {
        text-decoration: none;
        color: #000;
    }
`;

export const Container = styled.section`
  background: #fff;
  margin: 30px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  max-height: 40vh;
`;

export const Div = styled.div`
  width: 100%;
`;

export const Nav = styled.nav`
  display: flex;
  position: fixed;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.9rem;
    margin-bottom: 3px;
    color: #104467;
    align-self: flex-start;
  }

  .erro {
    color: red;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    font-size: 15px;
    align-self: start;
  }
`;

export const ErroContainer = styled.div`
  color: red;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  font-size: 15px;
  align-self: start;
`;

export const ContentContainer = styled.div`
  margin-left: ${(props) => (props.compact ? "90px" : "280px")};
  transition: margin-left 0.3s ease;

  position: relative;
  z-index: 1;
  overflow: visible;
`;
