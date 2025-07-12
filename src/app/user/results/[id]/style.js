import styled, { css } from 'styled-components'

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #1E293B;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

export const SectionsWrapper = styled.div`
  display: grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap: 22px;
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

  ${({ status }) =>
    status
      ? css`
          border: 2.5px solid rgb(240, 72, 25);
          cursor: pointer;

          &:hover {
            transform: translateY(-7px);
          }
        `
      : css`
          border: 2.5px dashed #adb5bd;
          cursor: default;
          opacity: 0.75;
        `}
`
