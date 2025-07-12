import styled from "styled-components";

export const Conatiner = styled.div`
  padding: 40px;
  margin: 30px 100px;
`
export const TitleInfo = styled.div`
  text-align: center;

  h1{
    font-size: 44px;
    color: #1E293B;
  }
  p{
    font-size: 20px;
    margin-top: 10px;
    color: #000000;
  }
`
export const Title = styled.h1`
  text-align: center;
    color: #1E293B;
    margin-top: 30px;
    font-size: 36px;

`
export const Cards = styled.div`
  padding: 10px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
  gap: 20px;
  
  
  `
export const Card = styled.div`
  background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhgL3So75MzL-qzZM0Zfz8_sCZMaJ5UQHJQ&s');
  background-size: cover;
  background-position: center;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
export const CardInfo = styled.div`
  background-color:${({ id }) => id == 1 ? 'rgba(177, 20, 4, 0.8)' : id == 2 ? 'rgba(173, 95, 183,0.8)' : id == 3 ? 'rgba(19, 146, 690,.8)' : id == 4 ? 'rgba(19, 146, 69,0.8)' : 'blue'};
  margin: 40px;
  color: white;
  text-align: center;
  font-size:20px;
  padding: 10px;
  border-radius:inherit;
`