import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { FaArrowRight } from 'react-icons/fa'

const Container = styled.div`
  border: 2px dashed #d62828;
  margin: 40px ;
  padding: 30px 20px;
  border-radius: 16px;
  background-color: #ffffff;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 24px;
  font-weight: 500;
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: #d62828;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #b91c1c;
  }

  svg {
    margin-left: 8px;
    font-size: 14px;
  }
`;

function Untied() {
  return (
    <Container>
      <Message>
    You have solved this section, your answers have been sent to the admin.
      </Message>
      <StyledLink href="/user">
        Go to profile <FaArrowRight />
      </StyledLink>
    </Container>
  );
}

export default Untied;
