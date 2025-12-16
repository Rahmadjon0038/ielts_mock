import { GlobalContainer } from "@/globalStyle";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 40px;
  background-image: url('https://cdn-icons-png.flaticon.com/512/6195/6195678.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 250px;
  border-radius: 12px;
  background-color: #f9fafb;
  border: 2px dashed #e0e0e0;
  margin: ${({ writing }) => (writing === 'writing' ? '50px 100px' : '0')};
  transition: all 0.3s ease-in-out;

  @media (max-width: 1024px) {
    margin: ${({ writing }) => (writing === 'writing' ? '40px 50px' : '10px')};
    background-size: 180px;
  }

  @media (max-width: 768px) {
    height: 300px;
    background-size: 120px;
    padding-bottom: 30px;
    margin: ${({ writing }) => (writing === 'writing' ? '30px 20px' : '10px')};
  }

  @media (max-width: 480px) {
    height: 250px;
    background-size: 90px;
    padding-bottom: 20px;
    margin: ${({ writing }) => (writing === 'writing' ? '20px 10px' : '5px')};
  }
`;

const Text = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  color: #444;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const NoResult = ({ message = "Natija topilmadi", writing }) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Wrapper writing={writing}>
        <Text>{message}</Text>
      </Wrapper>
    </div>
  );
};

export default NoResult;
