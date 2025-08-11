'use client';

import { useGetUserReadingAnswer } from '@/hooks/user';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import styled from 'styled-components';

// JSON ma'lumotlarni xavfsiz o'qish
const safeParse = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : parsed.replace(/"/g, '');
  } catch {
    return str?.replace(/"/g, '');
  }
};

// Styled Components
const Page = styled.main`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
`;

const Subtitle = styled.p`
  color: #718096;
  margin-top: 8px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PartLabel = styled.span`
  display: inline-block;
  background-color: #4c51bf;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
`;

const Question = styled.div`
  font-size: 17px;
  color: #2d3748;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const AnswerLabel = styled.strong`
  color: #4a5568;
`;

const AnswerValue = styled.span`
  margin-left: 4px;
  margin-right: 4px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: #bee3f8;
  color: #2b6cb0;
  font-size: 14px;

  ${(props) =>
    props.missing &&
    `
    background-color: #fed7d7;
    color: #c53030;
    font-style: italic;
  `}
`;

const OptionsList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Option = styled.span`
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;

  ${(props) =>
    props.isCorrect &&
    `
    background-color: #c6f6d5;
    color: #276749;
    border-color: #48bb78;
  `}
`;

// Matndagi [] larni userAnswer orqali to'ldirish
const renderTextMulti = (text, userAnswer) => {
  
  const answers = Array.isArray(userAnswer)
    ? [...userAnswer].sort((a, b) => (a.number || 0) - (b.number || 0))
    : [{ number: null, answer: userAnswer }];

  let index = 0;
  const parts = text.split('[]');
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <AnswerValue>
          {answers[index] && answers[index].answer
            ? (
              <>
                <strong>{answers[index].number}.</strong> {answers[index++].answer}
              </>
            )
            : <i style={{ color: 'red' }}>[?]</i>
          }
        </AnswerValue>
      )}
    </React.Fragment>
  ));
};

const ReadingAnswer = () => {
  const params = useParams();
  const userId = Array.isArray(params.userid) ? params.userid[0] : params.userid;
  const monthId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, error } = useGetUserReadingAnswer(userId, monthId);
  console.log('ReadingAnswer data:', data);

  const filteredItems = useMemo(() => {
  if (!data) return [];

  const result = [];
  data.forEach((item, index) => {
    const prevItem = data[index - 1];
    const isNewPart = !prevItem || prevItem.part !== item.part;
    result.push({
      ...item,
      showPartHeader: isNewPart,
    });
  });

  // questionNumber bo‘yicha sort qilamiz
  result.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
  return result;
}, [data]);

  if (isLoading) {
    return <Page><p style={{ textAlign: 'center', color: '#718096' }}>Yuklanmoqda...</p></Page>;
  }

  if (error) {
    return <Page><p style={{ color: 'red', textAlign: 'center' }}>Xatolik: {error.message}</p></Page>;
  }
  
  if (!data || data.length === 0) {
    return <Page><p style={{ textAlign: 'center', color: '#718096' }}>Hech qanday javob topilmadi.</p></Page>;
  }

  return (
    <Page>
      <Header>
        <Title>O'quv Natijalari</Title>
        <Subtitle>Foydalanuvchi javoblari tahlili</Subtitle>
      </Header>

      {filteredItems.map((item) => {
        const options = Array.isArray(safeParse(item.options)) ? safeParse(item.options) : [];
        const userAnswer = safeParse(item.userAnswer);
        const isMissing = !userAnswer || userAnswer === 'jAVOB BER' || userAnswer === '';

        return (
          <Card key={item.id}>
            {item.showPartHeader && <PartLabel>{item.part.toUpperCase()}</PartLabel>}

            <Question>
              <strong>{item.questionNumber}.</strong> {item.questionText}
            </Question>

            <div>
              <AnswerLabel>Javob:</AnswerLabel>
              {isMissing ? (
                <AnswerValue missing>javob berilmagan</AnswerValue>
              ) : (
                <AnswerValue>{userAnswer}</AnswerValue>
              )}
            </div>

            {['radio', 'select', 'checkbox'].includes(item.type) && options.length > 0 && (
              <OptionsList>
                {options.map((opt, idx) => (
                  <Option key={opt + '-' + idx} isCorrect={userAnswer === opt}>
                    {opt}
                  </Option>
                ))}
              </OptionsList>
            )}
          </Card>
        );
      })}
    </Page>
  );
};

export default ReadingAnswer;