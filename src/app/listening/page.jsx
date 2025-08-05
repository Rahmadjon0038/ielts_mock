'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  AudioSection,
  Button,
  Input,
  QuestionBox,
  QuestionItem,
  RadioGroup,
  RadioLabel,
  Select,
  TabButton,
  TabContainer,
  TabContent,
} from './style';
import { GlobalContainer } from '@/globalStyle';
import { Introduction, Times } from '@/components/reading/style';
import { useAddListeningAnswers } from '@/hooks/listening';
import { useAuth } from '@/context/userData';
import { useLatestMonth } from '@/hooks/useLatestMonth';
import { data } from './lsiteningData';
import { useAddUntied, useGetUntied } from '@/hooks/untied';
import { usePathname } from 'next/navigation';
import Untied from '@/components/untied';
import Loader from '@/components/loader/Loader';
import NoResult from '@/components/NoResult';
import Countdown from 'react-countdown';
import TimerModal from '@/components/Timer/TimerComponent';
import usePreventRefresh from '@/components/BlockendReload';
function Listening() {
  const [activeTab, setActiveTab] = useState(0);
  const [answers, setAnswers] = useState({});
  const mutation = useAddListeningAnswers()
  const { user } = useAuth()
  const { data: latesMonth, isLoading: monthLoading } = useLatestMonth()
  const untiedmutation = useAddUntied() //  bolimni yechgani haqida malumot
  const pathname = usePathname()
  const section = pathname.split('/').pop();
  const untied = {
    monthId: latesMonth?.id,
    userId: user?.user?.id,
    section: section,
  }
  const { data: untieddata, isLoading, error } = useGetUntied(untied); // bu yechilgan malumotni olish

  const endTimeRef = useRef(Date.now() + 60 * 60 * 1000);
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <TimerModal untieddata={untieddata?.submitted} handleSubmit={handleSubmit} show={true} />;;
    } else {
      return <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>;
    }
  };
  usePreventRefresh();

  const renderLabelWithInputs = (label, idx, task) => {
    const parts = label.split(/(\[\])/g);
    let inputCount = 0;

    return parts.map((part, i) => {
      if (part === '[]') {
        const inputNumber = ++inputCount;
        return (
          <span
            key={`input-${task.number}-${i}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            {/* <span style={{ fontWeight: 'bold' }}>{`${task.number}.${inputNumber}.`}</span> */}
            <Input
              placeholder="Answer"
              style={{ margin: '0 5px', maxWidth: '150px' }}
              value={
                answers[`${activeTab}-${task.number}-${inputNumber - 1}`] || ''
              }
              onChange={(e) =>
                handleAnswerChange(
                  task.number,
                  inputNumber - 1,
                  e.target.value,
                  activeTab
                )
              }
            />
          </span>
        );
      } else {
        return <span key={`text-${task.number}-${i}`}>{part}</span>;
      }
    });
  };

  const handleAnswerChange = (
    questionNumber,
    inputIndexOrValue,
    valueOrTabIndex,
    optionalTabIndex
  ) => {
    if (optionalTabIndex !== undefined) {
      const key = `${optionalTabIndex}-${questionNumber}-${inputIndexOrValue}`;
      const value = valueOrTabIndex;
      setAnswers((prev) => ({
        ...prev,
        [key]: value,
      }));
    } else {
      const key = `${valueOrTabIndex}-${questionNumber}`;
      const value = inputIndexOrValue;
      setAnswers((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (untieddata.submitted) return;
    const submissionData = {
      monthId: latesMonth?.id,
      userId: user?.user?.id,
      answers: [],
    };

    data.sections.forEach((section, tabIndex) => {
      section.question.forEach((questionGroup) => {
        questionGroup.questionsTask.forEach((task) => {
          const questionObj = {
            questionNumber: task.number,
            questionText: task.question,
            type: task.type,
            userAnswers: [],
            options: task.options || [],
          };

          if (task.type === 'text') {
            const inputCount = (task.question.match(/\[\]/g) || []).length;
            for (let i = 0; i < inputCount; i++) {
              const key = `${tabIndex}-${task.number}-${i}`;
              questionObj.userAnswers.push(answers[key] || '');
            }
          } else {
            const key = `${tabIndex}-${task.number}`;
            questionObj.userAnswers.push(answers[key] || '');
          }

          submissionData.answers.push(questionObj);
        });
      });
    });

    mutation.mutate(submissionData);
    untiedmutation.mutate(untied)
    console.log(submissionData)
  };

  if (monthLoading) {
    return <div style={{ position: 'relative', height: '500px' }}><Loader /></div>
  }

  if (!latesMonth?.id || !latesMonth?.month) {
    return <NoResult writing={'writing'} message="❌ There are no listening tests." />
  }


  return (
    <div style={{ minHeight: '100vh' }}>
      <GlobalContainer>
        {
          untieddata?.submitted ?
            <Untied />
            :
            <div>
              <Times>
                <p><Countdown date={endTimeRef.current} renderer={renderer} /></p>
              </Times>

              <TabContent>
                <Introduction>
                  <h3>{data.sections[activeTab].part}</h3>
                  <p>{data.sections[activeTab].intro}</p>
                  <p>
                    <strong>{data.sections[activeTab].textTitle}</strong>
                    <br />
                    {data.sections[activeTab].text}
                  </p>

                  <AudioSection>
                    <audio
                      key={data.sections[activeTab].audio}
                      controls
                      style={{ width: '100%' }}
                    >
                      <source
                        src={data.sections[activeTab].audio}
                        type="audio/mp3"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </AudioSection>
                </Introduction>

                <QuestionBox>
                  {data.sections[activeTab].question.map((questionGroup, qIdx) => (
                    <div key={qIdx}>
                      <h4>{questionGroup.questionTitle}</h4>
                      <p>{questionGroup.questionIntro}</p>
                      {questionGroup.questionsTask.map((task, idx) => (
                        <QuestionItem key={idx}>
                          <p>
                            <strong>{task.number}.</strong>{' '}
                            {task.type === 'text'
                              ? renderLabelWithInputs(task.question, idx, task)
                              : task.question}
                          </p>

                          {task.type === 'radio' && (
                            <RadioGroup>
                              {task.options.map((opt, i) => (
                                <label key={i}>
                                  <input
                                    type="radio"
                                    name={`radio-${activeTab}-${task.number}`}
                                    value={opt}
                                    checked={
                                      answers[`${activeTab}-${task.number}`] === opt
                                    }
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        task.number,
                                        e.target.value,
                                        activeTab
                                      )
                                    }
                                  />
                                  <RadioLabel>{opt}</RadioLabel>
                                </label>
                              ))}
                            </RadioGroup>
                          )}

                          {task.type === 'select' && (
                            <Select
                              value={answers[`${activeTab}-${task.number}`] || ''}
                              onChange={(e) =>
                                handleAnswerChange(
                                  task.number,
                                  e.target.value,
                                  activeTab
                                )
                              }
                            >
                              <option value="">Select</option>
                              {task.options.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                          )}
                        </QuestionItem>
                      ))}
                    </div>
                  ))}
                </QuestionBox>
              </TabContent>

              <TabContainer>
                {data.sections.map((section, index) => (
                  <TabButton
                    key={index}
                    onClick={() => setActiveTab(index)}
                    $active={activeTab === index}
                  >
                    {section.part}
                  </TabButton>
                ))}
              </TabContainer>

              <Button
                onClick={handleSubmit}
              >
                Send
              </Button>
            </div>}
      </GlobalContainer>
    </div>
  );
}

export default Listening;
