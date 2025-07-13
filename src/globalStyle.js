import styled from "styled-components";

export const GlobalContainer = styled.div`
    margin: ${({ full }) => full=='full' ? '30px 30px' : '30px 100px'};
`