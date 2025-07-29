import styled from "styled-components";

const GAP = "20px";

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: white;
`;

export const ContainerContent = styled.div`
  margin-left: 280px;
`;

export const ContainerAreaInput = styled.div``;

export const BoxGrafico = styled.div`
  height: 100%;
  border-radius: 10px;
  box-shadow: 10px 10px 10px rgb(0, 0, 0, 0.08);
`;

export const BoxGraficoAlt = styled.div`
  height: fit-content;
  border-radius: 10px;
  box-shadow: 10px 10px 10px rgb(0, 0, 0, 0.08);
`;

export const Content = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: ${GAP};
  gap: ${GAP};
`;

export const DashboardContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  gap: ${GAP};

  @media (max-width: 1500px) {
    flex-direction: column;
  }
`;

export const DashboardLeft = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${GAP};

  @media (max-width: 1500px) {
    width: 100%;
  }
`;

export const UpperDashboard = styled.div`
  width: 100%;
  height: 50%;
  gap: ${GAP};
  display: flex;
`;

export const UpperLeftSection = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${GAP};
`;

export const IndicatorsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: ${GAP};
`;

export const NumbersContainer = styled.div`
  width: 35%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${GAP};
`;

export const NumberContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;

  span {
    font-size: 1rem;
  }
`;

export const BigNumber = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
`;

export const TotalContainer = styled.div`
  width: 65%;
  height: 100%;
`;

export const UpperRightSection = styled.div`
  width: 40%;
  height: 100%;
`;

export const LowerDashboard = styled.div`
  width: 100%;
  height: 50%;
`;

export const DashboardRight = styled.div`
  width: 40%;
  height: 100%;

  /* @media (max-width: 1615px) {
    width: 30%;
  } */

  @media (max-width: 1500px) {
    width: 100%;
    height: fit-content;
  }
`;

export const DinamicTableContainer = styled.div`
  width: 100%;
  height: 35%;

  @media (max-width: 1500px) {
    height: fit-content;
  }
`;
