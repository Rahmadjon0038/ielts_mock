import styled, { css } from 'styled-components'

export const Title = styled.h2`
  font-weight: 500;
  margin-bottom: 40px;
  color: #1E293B;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  border-radius: 10px;
  border-left: 6px solid #B91613;
  border-top: 2px solid #B91613;
  border-right: 2px solid #B91613;
  border-bottom: 2px solid #B91613;

  @media(max-width:768px){
    font-size: 18px;
  }
`

export const SectionsWrapper = styled.div`
  display: grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap: 22px;

   @media(max-width:768px){
    gap: 20px;
   }
  `

export const SectionCard = styled.div`
  background:rgb(255, 255, 255);
  border-radius: 18px;
  padding: 28px 32px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  h3 {
    margin-bottom: 14px;
    font-size: 1.35rem;
    color: #1E293B;
    letter-spacing: 0.03em;
    font-weight: 700;
  }

  p {
    font-size: 1.15rem;
    color: ${({ status }) => (status ? '#1E293B' : '#6c757d')};
    font-weight: 600;
  }

   @media(max-width:768px){
  p {
    font-size: 16px;
  }
  }


  ${({ status }) =>
    status
      ? css`
          background-color: white;
          border-left: 8px solid #B91613;
          border-top: 2px solid #B91613;
          border-right: 2px solid #B91613;
          border-bottom: 2px solid #B91613;

          cursor: pointer;

          &:hover {
          transform: translateY(-7px);
}
`
      : css`
border: 2.5px dashed #adb5bd;
cursor: default ;
opacity: 0.75;
`}



`
