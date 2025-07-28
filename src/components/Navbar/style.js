import styled from "styled-components";

export const NavbarConatiner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    width: 100%;
    background-color: white;

    @media(max-width:768px){
    padding: 10px 10px;
    }

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

    @media(max-width:768px){
    h3{
        font-size: 12px;
    }
    p{
        font-size: 10px;
        font-weight: bold;
    }

     .logoimg{ 
      width: 60px;
      height: 40px;
    }
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
        &:hover{
            background-color: #B61304;
            color: white;

        }
        &:active{
            background-color: #B61304;
            transform: scale(0.97) ;

        }
    }


    @media(max-width:768px){
    button{
        padding: 4px 10px;
        font-size: 12px;
        border: 1px solid #B61304;
        border-radius: 4px;
      
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
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  padding: 1rem 1rem;
  background: #ffffff;
  color: #111827;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #AEEDD6;

  .wave-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 140%; /* Shu yerda agar xohlasang dinamik balandlik bersang ham bo'ladi */
    z-index: 0;
    opacity: 0.4;
  }

  .user-content {
    position: relative;
    z-index: 2;
  }

  strong {
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  button {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 2;

    &:hover {
      background: #059669;
    }
  }

`;