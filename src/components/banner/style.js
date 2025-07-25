import styled from "styled-components";

export const Container = styled.div`
`

export const Banner = styled.div`
    background: linear-gradient(135deg, #a60a06, #d62828);
    padding: 25px;
    color: white;
    border-radius: 12px;
    margin-bottom: 30px;
`
export const Title = styled.h1`
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
`
export const Subtitle = styled.p`
    font-size: 18px;
    margin-bottom: 8px;
    color: #ffe3e3;
`

export const LogOut = styled.div`
    border: 1px solid white;
    padding: 10px 20px;
    border-radius: 10px;
    outline: none;
    margin-top: 20px;
    display: inline-block;

    &:active{
        transform: scale(0.97);
    }
`