'use client'
import React from 'react'
import styled from 'styled-components'
import { GlobalContainer } from '@/globalStyle'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
  background:white;
  border-radius: 20px;
  border: 3px solid #BC1808;
`

const Message = styled.h3`
  font-size: 1.5rem;
  color: #333;
  line-height: 1.6;
  text-align: center;
  max-width: 800px;
  font-weight: 500;

  span {
    color: #1e40af; /* blue-800 */
    font-weight: 600;
  }
`

function Speaking() {
  return (
    <div style={{minHeight:'100vh'}}>
      <GlobalContainer>
        <Wrapper>
          <Message>
            The speaking test will be conducted <span>offline</span> for now, in the form of a <span>direct interview</span> by the instructors.
            Please make sure to be <span>prepared</span> and present at the scheduled time.
          </Message>
        </Wrapper>
      </GlobalContainer>
    </div>
  )
}

export default Speaking
