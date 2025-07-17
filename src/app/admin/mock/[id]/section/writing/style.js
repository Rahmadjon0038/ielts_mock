import styled from 'styled-components'


export const Card = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

export const TaskTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`
export const Images = styled.img`
  width: 60%;
`

export const Message = styled.p`
  font-size: 1.1rem;
  color: #888;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

export const Input = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`

export const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #B31D0A;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color:rgb(142, 22, 6);
  }
`