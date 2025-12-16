'use client'
import React from 'react'
import { GlobalContainer } from '@/globalStyle'
import styled from 'styled-components'

function SpeakingAdmin() {
  return (
    <GlobalContainer style={{ minHeight: '100vh' }}>
      <Wrapper>
        <Title>🎙️ Speaking Test</Title>
        <Description>
          Currently, all Speaking tests are conducted <Highlight>offline</Highlight>.  
          This section is for informational purposes only and does not provide an online test feature.  
          In the future, tests may be available online.
        </Description>
        <Note>⚠️ Admin: No speaking tests can be uploaded on this page.</Note>
      </Wrapper>
    </GlobalContainer>
  )
}

export default SpeakingAdmin

// ==== styled components ====
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 50px 20px;
  align-items: center;
  text-align: center;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
`

const Description = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 600px;
  line-height: 1.6;
`

const Highlight = styled.span`
  color: #e74c3c;
  font-weight: bold;
`

const Note = styled.div`
  margin-top: 20px;
  padding: 12px 20px;
  background: #fef3c7;
  border: 1px solid #facc15;
  border-radius: 12px;
  color: #92400e;
  font-size: 15px;
`
