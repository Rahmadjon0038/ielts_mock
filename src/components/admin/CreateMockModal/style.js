import styled from "styled-components";

export const CustomModal = styled.div`
  text-align: center;
`
export const AddBtn = styled.button`
    background-color:#B0100D;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    &:hover {
      background-color:rgb(153, 6, 4);
    }
    text-align: center;
    margin: 0 auto;
    width: ${({ modalBtn }) => modalBtn ? '140px' : ''};

      @media(max-width:600px){
    font-size: 10px;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 8px;
  background-color: #f9f9f9;
`

export const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`

export const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: rgb(153, 6, 4);
  }
`
export const Button = styled.button`
  padding: 10px 16px;
  background-color: rgb(153, 6, 4);
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:hover {
    background-color: rgb(114, 2, 0);
  }
`