import styled from 'styled-components'

export const SectionContainer = styled.div`
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 16px;
  margin-bottom: 32px;
`

export const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`

export const TaskText = styled.p`
  font-size: 16px;
  margin: 8px 0;
  color: #444;
  line-height: 24px;
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 4px;
  color: #555;
`
export const Images = styled.img`
  width: 600px;
`

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 12px;
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 12px;
  min-height: 200px;
`

export const SaveButton = styled.button`
  background: #2e86de;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #216bb0;
  }
`
