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
  gap: 10px;
  margin: 60px 0;
  flex-wrap: wrap;
`
// ✅ Bu JS (yoki JSX) fayl uchun to‘g‘ri:
export const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${({ $active }) => ($active ? '#007bff' : '#ddd')};
  color: ${({ $active }) => ($active ? '#fff' : '#000')};
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`;


export const TabContent = styled.div`
  margin-top: 20px;
`
