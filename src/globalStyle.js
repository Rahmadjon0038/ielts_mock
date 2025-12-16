import styled from "styled-components";

export const GlobalContainer = styled.div`
    padding-top:50px;
    margin: ${({ full }) => full == 'full' ? '30px 30px' : '30px 100px'};
    @media(max-width:768px){
    margin: ${({ full }) => full == 'full' ? '10px 10px' : '30px 10px'};
    padding-top:20px;
    }
`

export const TextBlock = styled.p`
  white-space: pre-line;
`;


export const Line = styled.div`
  height: 4px ;
  margin: 10px 0;
  background-color:gray;
  width: 100%;
`