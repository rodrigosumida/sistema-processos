import React from "react";

import { Container } from "../../styles/GlobalStyles";
import Header from "../../components/Header";

export default function Page404() {
  return (
    <>
      <Header />
      <Container>
        <h1>Essa página não existe</h1>
      </Container>
    </>
  );
}
