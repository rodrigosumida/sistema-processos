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

export const ContainerGraficos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 10%;
`;

export const BoxGrafico = styled.div`
  height: 100%;
  border-radius: 10px;
  box-shadow: 10px 10px 10px rgb(0, 0, 0, 0.08);
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${GAP};
  gap: ${GAP};
`;

export const DashboardContainer = styled.div`
  width: 100%;
  height: 65%;
  display: flex;
  gap: ${GAP};
`;

export const DashboardLeft = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${GAP};
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
  flex: 1;
`;

export const UpperRightSection = styled.div`
  flex: 1;
`;

export const LowerDashboard = styled.div`
  flex: 1;
`;

export const DashboardRight = styled.div`
  flex: 1;
`;

export const DinamicTableContainer = styled.div`
  flex: 1;
`;
