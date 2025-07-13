import styled from "styled-components";

export const NavbarConatiner = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 40px;

`
export const Logocont = styled.div`
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


export const SectionList = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

export const SectionCard = styled.div`
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;

  h3 {
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`

export const UserList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const UserCard = styled.div`
  background: #fff;
  padding: 1rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: #10b981;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }
`
