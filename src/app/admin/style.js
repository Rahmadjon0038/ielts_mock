import styled from 'styled-components'

export const Container = styled.div`
  margin-top: 2rem;

  h2{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

`

export const CardList = styled.div`
  gap: 1.5rem;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(250px,1fr));

 
`

export const CardItem = styled.div`
  background-color:rgb(255, 255, 255);
  border: 3px solid #B0100D;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  .btnbox{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }
  p{
    font-size: 18px;
    margin-bottom: 14px;
    color: #1E293B;
  }
`

export const CardTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 1rem;
  color: #1E293B;
`

export const ViewButton = styled.button`
  background-color:green;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color:rgb(153, 6, 4);
  }
`


// --------------------------- [ id] -------------------------
export const SectionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
`

export const SectionCard = styled.div`
  padding: 1.5rem;
  background:rgb(253, 253, 253);
  border-radius: 10px;
  text-align: center;
  border: 3px solid rgb(200, 8, 5);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  h3 {
    margin-bottom: 1rem;
  color: #1E293B;
    font-size: 18px;
  }

  button {
    background:rgb(200, 8, 5) ;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: rgb(174, 5, 3);
    }
  }
`