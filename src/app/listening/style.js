import styled from 'styled-components'

export const Times = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: right;
  margin-bottom: 20px;
`

export const Introduction = styled.div`
  margin-bottom: 20px;
`

export const AudioSection = styled.div`
  margin: 10px 0;
`

export const QuestionBox = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  background: #f9f9f9;
`

export const QuestionItem = styled.div`
  margin: 15px 0;
`

export const Input = styled.input`
  margin-top: 5px;
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 6px;
  width: 100%;
  max-width: 400px;
`

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  gap: 5px;
`

export const RadioLabel = styled.span`
  margin-left: 6px;
`

export const Select = styled.select`
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 5px;
  max-width: 400px;
  width: 100%;
`

export const TabContainer = styled.div`
display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`
export const TabButton = styled.button`
  padding: 0.5rem 1.25rem;
  border: none;
  background-color: ${({ $active }) => ($active ? '#d62828' : '#f1f5f9')};
  color: ${({ $active }) => ($active ? '#fff' : '#1e293b')};
  border-radius: 6px;
  border: 2px solid #d62828;
  cursor: pointer;
  transition: 0.2s ease;
   &:hover {
    background: #d62828;
    color: white;
  }
`;


export const TabContent = styled.div`
  margin-top: 20px;
`
export const Button = styled.button`
  background: #d62828;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;
  transition: 0.2s ease;
  margin-top: 30px;
  margin: 30px auto;
  &:hover {
    background: #d62828;
  }
`