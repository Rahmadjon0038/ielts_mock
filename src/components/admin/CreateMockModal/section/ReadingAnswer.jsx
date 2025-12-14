'use client';

import { useGetUserReadingAnswer } from '@/hooks/user';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import styled from 'styled-components';

// ======================================================================
// safeParse funksiyasi
const safeParse = (value) => {
  if (value === null || typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '')) {
      return null;
  }
  
  if (typeof value === 'object') return value;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value.trim();
    }
  }

  return value;
};
// ======================================================================

const Page = styled.main`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  padding: 24px;
  background-color: #f7fafc;
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
  white-space: pre-line; /* qator o‘tishlarni ko‘rsatadi */
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

const ReadingAnswer = () => {
  const params = useParams();
  const userId = Array.isArray(params.userid) ? params.userid[0] : params.userid;
  const monthId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, error } = useGetUserReadingAnswer(userId, monthId);

  const filteredItems = useMemo(() => {
    if (!data) return [];

    const result = [];
    data.forEach((item, index) => {
      const prevItem = data[index - 1];
      const isNewPart = !prevItem || prevItem.part !== item.part;
      result.push({ ...item, showPartHeader: isNewPart });
    });

    result.sort((a, b) => (a.questionnumber || 0) - (b.questionnumber || 0));
    return result;
  }, [data]);

  if (isLoading) return <Page><p style={{ textAlign: 'center', color: '#718096' }}>Yuklanmoqda...</p></Page>;
  if (error) return <Page><p style={{ color: 'red', textAlign: 'center' }}>Xatolik: {error.message}</p></Page>;
  if (!data || data.length === 0) return <Page><p style={{ textAlign: 'center', color: '#718096' }}>Hech qanday javob topilmadi.</p></Page>;

  return (
    <Page>
      <Header>
        <Title>O'quv Natijalari</Title>
        <Subtitle>Foydalanuvchi javoblari tahlili</Subtitle>
      </Header>

      {filteredItems.map((item) => {
        const options = safeParse(item.options) || [];
        const rawUserAnswer = safeParse(item.useranswer); // note: API may be `useranswer`

        const trimmedAnswer = rawUserAnswer ? String(rawUserAnswer).trim() : '';
        const isMissing = !rawUserAnswer || trimmedAnswer === '' || trimmedAnswer.toLowerCase() === 'javob ber';

        return (
          <Card key={item.id}>
            {item.showPartHeader && <PartLabel>{item.part.toUpperCase()}</PartLabel>}

            <Question>
              <strong>{item.questionnumber}.</strong> {String(item.questiontext).replace(/\\"/g, '"')}
            </Question>

            <div>
              <AnswerLabel>Javob:</AnswerLabel>
              {isMissing ? (
                <AnswerValue missing>javob berilmagan</AnswerValue>
              ) : (
                <AnswerValue>{trimmedAnswer}</AnswerValue>
              )}
            </div>

            {['radio', 'select', 'checkbox'].includes(item.type) && options.length > 0 && (
              <OptionsList>
                {options.map((opt, idx) => {
                  const trimmedOption = String(opt).trim();
                  const isCorrect = item.type === 'checkbox'
                    ? trimmedAnswer.includes(trimmedOption)
                    : trimmedAnswer === trimmedOption;

                  return <Option key={idx} isCorrect={isCorrect}>{opt}</Option>;
                })}
              </OptionsList>
            )}
          </Card>
        );
      })}
    </Page>
  );
};

export default ReadingAnswer;
