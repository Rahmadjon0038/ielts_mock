import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  min-height: 00vh;
`

export const Times = styled.div`
  border: 1px solid rgb(222, 223, 223);
  background-color: rgb(245, 250, 251);
  border-radius: 10px;
  margin: 16px 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
`

export const Introduction = styled.div`
  border: 1px solid rgb(185, 182, 182);
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 0;
  padding: 20px;

  p {
    margin-top: 5px;
  }
`

export const LeftBox = styled.div`
  border: 1px solid rgb(185, 182, 182);
  background-color: #fff;
  padding: 20px;
  overflow: auto;
  p {
    margin-top: 5px;
    color: #1f1f1f;
    line-height: 26px;
  }
  h3{
    text-align: center;
  }
`

export const RightBox = styled.div`
  border: 1px solid rgb(185, 182, 182);
  background-color: #fff;
  padding: 20px;
  overflow: auto;

  .questionid{
    margin: 10px 0;
  }
  p{
    line-height: 30px;
  }

  .answerInput{
    margin-top: 7px;
    display: flex;
    gap: 10px;
  }

  .input-text{
    line-height: 24px;
  }

  .question-title{
    margin-top: 20px;
  }

`
export const Tables = styled.table`
  border-collapse: collapse;
  padding: 10px;
  width: 100%;

  tr{
    border: 1px solid;
  width: 100%;
  
}
  td ,th{
    padding: 10px;

  }
`
export const QuestionBox = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-top: 5px;
    cursor: pointer;
  }

  
 
`
export const Selectted = styled.select`
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 5px;
  max-width: 400px;
  width: 100%;
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


export const Parts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
    gap: 20px;
  `
export const Partsitem = styled.div`
  border: 1px solid rgb(185, 182, 182);
  background-color: ${({ isActive }) => isActive ? '#F5FAFB' : "#fff"};
  color:#333;
  border-radius: 10px;
  margin: 10px 0;
  padding: 20px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    border-color: red;
    background-color: #F5FAFB;
  }

  &:active {
    transform: scale(0.97);
  }
`;
export const SumbitButton = styled.div`
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  background-color: blue;
  display: inline-block;
`
