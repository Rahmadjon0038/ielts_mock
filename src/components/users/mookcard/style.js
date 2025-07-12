import { style } from "@mui/system";
import styled from "styled-components";

export const Container = styled.div`
    border: 2px solid red;
  background-color: ${({ status }) =>
    status === 'completed' ? '#d1fae5' :
    status === 'submitted' ? '#fef3c7' :
    '#f3f4f6'};
  color: #111;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: 0.2s ease-in-out;

  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    font-weight: 500;
  }

  &:hover {
    transform: scale(1.03);
  }
`
