import { style } from "@mui/system";
import styled from "styled-components";

export const Container = styled.div`
  background-color:white;
  color: #111;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border-left: 8px solid #B91613;
  border-top: 2px solid #B91613;
  border-right: 2px solid #B91613;
  border-bottom: 2px solid #B91613;
  h2 {
    font-size: 18px;
  }

  p {
    font-size: 14px;
    font-weight: 500;
  }

  &:hover {
    transform: scale(1.03);
  }
`
