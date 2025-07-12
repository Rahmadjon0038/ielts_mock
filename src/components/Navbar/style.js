import styled from "styled-components";

export const NavbarConatiner = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 40px;

`
export const Logo = styled.div`
    color: #B61304;
    text-align: center;
    display: flex;
    align-items: center;
    .logoimg{   
    }
    h3{
        font-size: 24px;
    }
    p{
        font-size: 14px;
        font-weight: bold;
        margin-top: 3px;
    }
`
export const Buttons = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    button{
        padding: 10px 30px;
        font-weight: bold;
        border-radius: 10px;
        border: 2px solid #B61304;
        background-color: white;
        color: #B61304;
        transition: 0.3s;
        &:hover{
            background-color: #B61304;
            color: white;

        }
        &:active{
            background-color: #B61304;
            transform: scale(0.97) ;

        }
    }

`
export const Profile = styled.div`
    padding-inline-start: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 18px;
    cursor: pointer;
        color: #A60A06;
    .icon{
        font-size: 36px;
        color: #A60A06;
    }
`