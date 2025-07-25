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
  background-position:  center;
  background-size: 250px;
  border-radius: 12px;
  background-color: #f9fafb;
  border: 2px dashed #e0e0e0;
  margin: ${({ writing }) => writing == 'writing' ? '50px 100px' : '0'};


  @media (max-width: 768px) {
    height: 300px;
    background-size: 100px;
    padding-bottom: 30px;
  }
`;

const Text = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  color: #444;
  text-align: center;
`;

const NoResult = ({ message = "Natija topilmadi", writing }) => {
  return (
    <Wrapper writing={writing}>
      <Text>{message}</Text>
    </Wrapper>
  );
};

export default NoResult;
