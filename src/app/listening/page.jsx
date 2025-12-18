"use client";
import React, { useEffect, useMemo, useState } from "react";
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
} from "./style";
import { GlobalContainer, TextBlock } from "@/globalStyle";
import { Introduction, Times } from "@/components/reading/style";
import {
  useAddListeningAnswers,
  useGetAudioListening,
  useGetListeningTask,
} from "@/hooks/listening";
import { useAuth } from "@/context/userData";
import { useLatestMonth } from "@/hooks/useLatestMonth";
import { useAddUntied, useGetUntied } from "@/hooks/untied";
import { usePathname } from "next/navigation";
import Untied from "@/components/untied";
import Loader from "@/components/loader/Loader";
import MiniLoader from "@/components/MiniLoader/MiniLoader";
import NoResult from "@/components/NoResult";
import Countdown from "react-countdown";
import TimerModal from "@/components/Timer/TimerComponent";
import usePreventRefresh from "@/components/BlockendReload";
import { useAddtimer, useGetTimer } from "@/hooks/timer";
import { checkListeningAnswers } from "./CheckListeningAnswers";
import { useAassessment } from "@/hooks/writing";

function Listening() {
  const [activeTab, setActiveTab] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { data: latesMonth, isLoading: monthLoading } = useLatestMonth();
  const { data: audios } = useGetAudioListening({ monthId: latesMonth?.id });
  const { data: listeningTask } = useGetListeningTask(latesMonth?.id);
  const data = listeningTask?.data?.test_data;

  const [answers, setAnswers] = useState({});
  const mutation = useAddListeningAnswers();
  const { user } = useAuth();
  const untiedmutation = useAddUntied();
  const pathname = usePathname();
  const section = pathname.split("/").pop();
  const untied = {
    monthId: latesMonth?.id,
    userId: user?.user?.id,
    section: section,
  };
  const { data: untieddata } = useGetUntied(untied);
  const timerMutation = useAddtimer();
  const { data: timer } = useGetTimer(user?.user?.id, section, latesMonth?.id);
  const paramdata = { id: latesMonth?.id, userid: user?.user?.id };
  const setAassessment = useAassessment();

  useEffect(() => {
    if (user?.user?.id && section && data && audios && !untieddata?.submitted) {
      timerMutation.mutate({
        userId: user?.user?.id,
        section: section,
        monthId: latesMonth?.id,
      });
    }
  }, [user?.user?.id, section, data, audios, untieddata?.submitted, latesMonth?.id]);

  usePreventRefresh();

  const endTime = useMemo(() => {
    if (!timer?.startTime) return null;
    return new Date(new Date(timer.startTime).getTime() + 60 * 60 * 1000);
  }, [timer?.startTime]);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <TimerModal untieddata={untieddata?.submitted} handleSubmit={handleSubmit} show={true} />;
    } else {
      return (
        <span>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      );
    }
  };

  const renderLabelWithInputs = (label, idx, task) => {
    const parts = label.split(/(\[\])/g);
    let inputCount = 0;

    return parts.map((part, i) => {
      if (part === "[]") {
        const inputNumber = ++inputCount;
        const key = `${activeTab}-${task.number}-${inputNumber - 1}`;
        return (
          <span key={`input-${task.number}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Input
              spellCheck={false}
              placeholder="Answer"
              style={{ margin: "0 5px", maxWidth: "150px" }}
              value={answers[key] || ""}
              onChange={(e) => handleAnswerChange(task.number, inputNumber - 1, e.target.value, activeTab)}
            />
          </span>
        );
      } else {
        return <span key={`text-${task.number}-${i}`}>{part}</span>;
      }
    });
  };

  const handleAnswerChange = (questionNumber, inputIndexOrValue, valueOrTabIndex, optionalTabIndex) => {
    if (optionalTabIndex !== undefined) {
      const key = `${optionalTabIndex}-${questionNumber}-${inputIndexOrValue}`;
      const value = valueOrTabIndex;
      setAnswers((prev) => ({ ...prev, [key]: value }));
    } else {
      const tabIndex = valueOrTabIndex;
      const value = inputIndexOrValue;
      const questionKey = `${tabIndex}-${questionNumber}`;
      const taskType = data?.sections[tabIndex]?.question?.flatMap((q) => q.questionsTask).find((t) => t.number === questionNumber)?.type;

      if (taskType === "checkbox") {
        const checked = value.target.checked;
        const optionValue = value.target.value;
        setAnswers((prev) => {
          const currentAnswers = prev[questionKey] || [];
          let newAnswers = checked ? [...currentAnswers, optionValue] : currentAnswers.filter((ans) => ans !== optionValue);
          return { ...prev, [questionKey]: newAnswers };
        });
      } else {
        setAnswers((prev) => ({ ...prev, [questionKey]: value }));
      }
    }
  };

  const handleSubmit = () => {
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
            correctAnswer: task.answer,
            options: task.options || [],
          };

          const key = `${tabIndex}-${task.number}`;

          if (task.type === "text") {
            const inputCount = (task.question.match(/\[\]/g) || []).length;
            for (let i = 0; i < inputCount; i++) {
              const textKey = `${key}-${i}`;
              questionObj.userAnswers.push(answers[textKey] || "");
            }
          } else if (task.type === "checkbox") {
            const checkboxAnswers = answers[key] || [];
            questionObj.userAnswers.push(checkboxAnswers.join(", ") || "");
          } else {
            questionObj.userAnswers.push(answers[key] || "");
          }
          submissionData.answers.push(questionObj);
        });
      });
    });

    let score = checkListeningAnswers(submissionData).correctCount;

    function getBandScore(rawScore) {
      if (rawScore >= 39) return 9;
      if (rawScore >= 37) return 8.5;
      if (rawScore >= 35) return 8;
      if (rawScore >= 32) return 7.5;
      if (rawScore >= 30) return 7;
      if (rawScore >= 26) return 6.5;
      if (rawScore >= 23) return 6;
      if (rawScore >= 18) return 5.5;
      if (rawScore >= 16) return 5;
      if (rawScore >= 13) return 4.5;
      if (rawScore >= 10) return 4;
      if (rawScore >= 8) return 3.5;
      if (rawScore >= 6) return 3;
      if (rawScore >= 4) return 2.5;
      return 0;
    }

    mutation.mutate(submissionData, {
      onSuccess: () => {
        untiedmutation.mutate(untied);
        setAassessment.mutate({
          section,
          score: getBandScore(score),
          comment: "Evaluation completed...",
          paramdata,
        });
      },
    });
  };

  if (monthLoading || !data) {
    return (
      <div style={{ position: "relative", height: "900px" }}>
        <Loader />
      </div>
    );
  }

  if (!latesMonth?.id || !latesMonth?.month) {
    return <NoResult writing={"writing"} message="There are no listening tests." />;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <GlobalContainer>
        {untieddata?.submitted ? (
          <Untied />
        ) : (
          <div>
            <Times>
              <p>{endTime ? <Countdown date={endTime} renderer={renderer} /> : <MiniLoader />}</p>
            </Times>
            <TabContent>
              <Introduction>
                <h3>{data?.sections[activeTab]?.part}</h3>
                <TextBlock>{data?.sections[activeTab]?.intro}</TextBlock>
                
                <TextBlock>
                  <strong>{data?.sections[activeTab]?.textTitle}</strong>
                  <br />
                  {data?.sections[activeTab]?.text}
                </TextBlock>

                <AudioSection>
                  {audios && audios?.length > 0 ? (
                    <audio style={{ width: "100%" }} key={audios[activeTab]?.id || activeTab} controls preload="auto">
                      <source src={`${baseUrl.replace(/\/$/, "")}/uploads/audio/${audios[activeTab]?.filename}`} type={audios[activeTab]?.mimetype === "audio/x-m4a" ? "audio/mp4" : audios[activeTab]?.mimetype} />
                      <source src={`${baseUrl.replace(/\/$/, "")}/uploads/audio/${audios[activeTab]?.filename}`} type="audio/mpeg" />
                      Your browser does not support the audio player.
                    </audio>
                  ) : (
                    <p>There is no song.</p>
                  )}
                </AudioSection>
              </Introduction>

              <QuestionBox>
                {data?.sections[activeTab]?.question?.map((questionGroup, qIdx) => (
                  <div key={qIdx}>
                    <h4>{questionGroup?.questionTitle} </h4>
                    <TextBlock>{questionGroup?.questionIntro}</TextBlock>
                    
                    {questionGroup?.questionsTask?.map((task, idx) => {
                      const questionKey = `${activeTab}-${task?.number}`;
                      const currentAnswers = answers[questionKey] || [];
                      return (
                        <QuestionItem key={idx}>
                          <TextBlock as="div">
                            {/* SHART: Agar tip 'text' bo'lmasa raqamni ko'rsat, bo'lsa raqam yashiriladi */}
                            {task.type !== "text" && <strong>{task?.number}. </strong>}
                            
                            {task.type === "text"
                              ? renderLabelWithInputs(task?.question, idx, task)
                              : task?.question}
                          </TextBlock>

                          {(task.type === "radio" || task.type === "checkbox") && (
                            <RadioGroup>
                              {task.options.map((opt, i) => {
                                const optionLabel = String.fromCharCode(65 + i);
                                return (
                                  <label key={i}>
                                    <input
                                      type={task.type}
                                      name={`${task.type}-${activeTab}-${task?.number}`}
                                      value={optionLabel}
                                      checked={task.type === "radio" ? answers[questionKey] === optionLabel : currentAnswers.includes(optionLabel)}
                                      onChange={(e) => handleAnswerChange(task?.number, task.type === "checkbox" ? e : e.target.value, activeTab)}
                                    />
                                    <RadioLabel>{opt}</RadioLabel>
                                  </label>
                                );
                              })}
                            </RadioGroup>
                          )}

                          {task?.type === "select" && (
                            <Select value={answers[questionKey] || ""} onChange={(e) => handleAnswerChange(task.number, e.target.value, activeTab)}>
                              <option value="">Select</option>
                              {task?.options?.map((opt, i) => (
                                <option key={i} value={String.fromCharCode(65 + i)}>{opt}</option>
                              ))}
                            </Select>
                          )}
                        </QuestionItem>
                      );
                    })}
                  </div>
                ))}
              </QuestionBox>
            </TabContent>

            <TabContainer>
              {data?.sections?.map((section, index) => (
                <TabButton key={index} onClick={() => setActiveTab(index)} $active={activeTab === index}>
                  {section?.part}
                </TabButton>
              ))}
            </TabContainer>

            {activeTab === data?.sections?.length - 1 && <Button onClick={handleSubmit}>Send</Button>}
          </div>
        )}
      </GlobalContainer>
    </div>
  );
}

export default Listening;