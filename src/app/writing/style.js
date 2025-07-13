import styled from "styled-components"

export const Container = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit,minmax(400px,1fr));

`
export const TaskBox = styled.div`
  flex: 1;
  border: 2px solid #d62828;
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
  color: #1e293b;

  p{
    line-height: 24px;
  }
`

export const AnswerBox = styled.div`
  flex: 1;
  border: 2px solid rgb(30, 41, 59);
  padding: 1rem;
  border-radius: 10px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
`

export const StyledTextarea = styled.textarea`
  flex: 1;
  resize: none;
  padding: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  outline: none;
  line-height: 24px;
  &:focus {
    border-color: #1e293b;
  }
`

export const SubmitButton = styled.button`
  background: #d62828;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;
  transition: 0.2s ease;
  margin-top: 10px;
  &:hover {
    background: #d62828;
  }
`

export const WordCount = styled.p`
  margin-top: 0.5rem;
  color: #475569;
  font-size: 0.9rem;
  text-align: right;
`

export const TabRow = styled.div`
  display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
`
export const TabButton = styled.button`
  background: ${(props) => (props.active ? '#d62828' : '#f1f5f9')};
  color: ${(props) => (props.active ? '#fff' : '#1e293b')};
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #d62828;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #d62828;
    color: white;
  }
`
