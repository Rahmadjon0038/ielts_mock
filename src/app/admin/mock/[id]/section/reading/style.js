import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  gap: 40px;
  padding: 30px 30px 100px 30px;
`

export const Column = styled.div`
  flex: 1;
  min-width: 300px;
`

export const Section = styled.div`
  margin-bottom: 20px;
`

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`

export const Input = styled.input`
  width: 100%;
  padding: 8px;
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
`

export const Select = styled.select`
  width: 100%;
  padding: 8px;
`

export const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 14px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
`

export const RemoveButton = styled.button`
  background: red;
  color: white;
  padding: 4px 8px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
`

export const QuestionCard = styled.div`
  background: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
`

export const Tabs = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #eee;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
  z-index: 100;
`

export const Tab = styled.button`
  background: ${props => props.active ? '#007bff' : '#ccc'};
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 6px;
`
