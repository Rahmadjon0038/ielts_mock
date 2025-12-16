const { default: styled } = require("styled-components")

export const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`

export const HeaderSection = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 6px;
`

export const Subtitle = styled.p`
  color: #718096;
  font-size: 15px;
`

export const QuestionDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const QuestionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`

export const QuestionNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
`

export const QuestionText = styled.div`
  font-size: 17px;
  line-height: 1.6;
  color: #1f1f1f;
  white-space: pre-wrap;

  span.highlight {
    background-color: #d4edda;
    padding: 2px 4px;
    border-radius: 4px;
    color: #155724;
    font-weight: 600;
  }
`

export const AnswerSection = styled.div`
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
`

export const AnswerLabel = styled.div`
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const AnswerContent = styled.div`
  color: #34495e;
  font-size: 15px;
  line-height: 1.6;
`

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`

export const OptionItem = styled.div`
  padding: 10px 12px;
  border-radius: 6px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#d4edda' : '#f1f1f1')};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? '#c3e6cb' : '#e0e0e0')};
  color: ${({ $isSelected }) => ($isSelected ? '#155724' : '#333')};
  font-weight: ${({ $isSelected }) => ($isSelected ? '600' : '400')};
  transition: all 0.2s ease;
`

export const StatusMessage = styled.div`
  border: 1px solid #dee0e0;
  background-color: #f5fafd;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  font-size: 17px;
  color: #444;
  margin-top: 20px;
`
