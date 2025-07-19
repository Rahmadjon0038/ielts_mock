import styled from "styled-components";

export const Container = styled.div`
    border: 2px solid red;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: 60px;
    height:100vh;

    .section{
        border: 2px solid blue;
        padding: 10px;
        overflow: auto;
        height: 100%;
    }
`