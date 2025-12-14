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
import { GlobalContainer } from "@/globalStyle";
import { Introduction, Times } from "@/components/reading/style";
import {
  useAddListeningAnswers,
  useGetAudioListening,
  useGetListeningTask,
} from "@/hooks/listening";
import { useAuth } from "@/context/userData";
import { useLatestMonth } from "@/hooks/useLatestMonth";
// import { data } from './lsiteningData';
import { useAddUntied, useGetUntied } from "@/hooks/untied";
import { usePathname } from "next/navigation";
import Untied from "@/components/untied";
import Loader from "@/components/loader/Loader";
import NoResult from "@/components/NoResult";
import Countdown from "react-countdown";
import TimerModal from "@/components/Timer/TimerComponent";
import usePreventRefresh from "@/components/BlockendReload";
import { useAddtimer, useGetTimer } from "@/hooks/timer";
import MiniLoader from "@/components/MiniLoader/MiniLoader";
import { checkListeningAnswers } from "./CheckListeningAnswers";
import { useAassessment } from "@/hooks/writing";

function Listening() {
  const [activeTab, setActiveTab] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { data: latesMonth, isLoading: monthLoading } = useLatestMonth();
  const {
    data: audios,
    isLoading: audioLoader,
    error: audioErr,
    refetch,
  } = useGetAudioListening({ monthId: latesMonth?.id });

  const {
    data: listeningTask,
    error: listeningError,
    isLoading: listeningLoading,
  } = useGetListeningTask(latesMonth?.id);

  const data = listeningTask?.data?.test_data;

  const [answers, setAnswers] = useState({});
  const mutation = useAddListeningAnswers();
  const { user } = useAuth();
  const untiedmutation = useAddUntied(); //  bolimni yechgani haqida malumot
  const pathname = usePathname();
  const section = pathname.split("/").pop();
  const untied = {
    monthId: latesMonth?.id,
    userId: user?.user?.id,
    section: section,
  };
  const { data: untieddata, isLoading, error } = useGetUntied(untied); // bu yechilgan malumotni olish

  const timerMutation = useAddtimer();
  const {
    data: timer,
    isLoading: timerLoading,
    error: timerError,
  } = useGetTimer(user?.user?.id, section, latesMonth?.id); // vaqtni olish

  const paramdata = { id: latesMonth?.id, userid: user?.user?.id };
  const setAassessment = useAassessment();

  useEffect(() => {
    if (
      user?.user?.id &&
      section &&
      data &&
      audios &&
      !untieddata?.submitted // ✅ agar hali yechilmagan bo‘lsa
    ) {
      timerMutation.mutate({
        userId: user?.user?.id,
        section: section,
        monthId: latesMonth?.id,
      });
    }
  }, [
    user?.user?.id,
    section,
    data,
    audios,
    untieddata?.submitted,
    latesMonth?.id,
  ]);

  usePreventRefresh();

  const endTime = useMemo(() => {
    if (!timer?.startTime) return null; // hali kelmagan bo‘lsa
    return new Date(new Date(timer.startTime).getTime() + 60 * 60 * 1000);
  }, [timer?.startTime]);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return (
        <TimerModal
          untieddata={untieddata?.submitted}
          handleSubmit={handleSubmit}
          show={true}
        />
      );
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
        return (
          <span
            key={`input-${task.number}-${i}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            {/* <span style={{ fontWeight: 'bold' }}>{`${task.number}.${inputNumber}.`}</span> */}
            <Input
              spellCheck={false}
              placeholder="Answer"
              style={{ margin: "0 5px", maxWidth: "150px" }}
              value={
                answers[`${activeTab}-${task.number}-${inputNumber - 1}`] || ""
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
            correctAnswer: task.answer, // admin javobi
            options: task.options || [],
          };

          // Har qanday turdagi savollar uchun javob yig'ish
          if (task.type === "text") {
            const inputCount = (task.question.match(/\[\]/g) || []).length;
            for (let i = 0; i < inputCount; i++) {
              const key = `${tabIndex}-${task.number}-${i}`;
              questionObj.userAnswers.push(answers[key] || "");
            }
          } else {
            const key = `${tabIndex}-${task.number}`;
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
      return 0; // agar 0–3 oralig‘ida bo‘lsa
    }

    mutation.mutate(submissionData, {
      onSuccess: () => {
        untiedmutation.mutate(untied);
        setAassessment.mutate({
          section,
          score: getBandScore(score),
          comment:
            "Evaluation completed ✅ Your result has been automatically calculated by the system. If there are any shortcomings, they will be reviewed and corrected by the admin.",
          paramdata,
        });
      },
    });
  };

  if (monthLoading) {
    return (
      <div style={{ position: "relative", height: "900px" }}>
        <Loader />
      </div>
    );
  }

  if (!latesMonth?.id || !latesMonth?.month || !data) {
    return (
      <NoResult writing={"writing"} message="There are no listening tests." />
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <GlobalContainer>
        {untieddata?.submitted ? (
          <Untied />
        ) : (
          <div>
            <Times>
              <p>
                {endTime ? (
                  <>
                    <Countdown date={endTime} renderer={renderer} />
                  </>
                ) : (
                  <MiniLoader /> // yoki hech narsa
                )}
              </p>
            </Times>
            <TabContent>
              <Introduction>
                <h3>{data?.sections[activeTab]?.part}</h3>
                <p>{data?.sections[activeTab]?.intro}</p>
                <p>
                  <strong>{data?.sections[activeTab]?.textTitle}</strong>
                  <br />
                  {data?.sections[activeTab]?.text}
                </p>

                <AudioSection>
                  {audios && audios?.length > 0 ? (
                    <audio
                      style={{ width: "100%" }}
                      key={audios[activeTab]?.id || activeTab}
                      controls
                      preload="auto"
                    >
                      <source
                        src={`${baseUrl.replace(/\/$/, "")}/uploads/audio/${
                          audios[activeTab]?.filename
                        }`}
                        type={
                          audios[activeTab]?.mimetype === "audio/x-m4a"
                            ? "audio/mp4"
                            : audios[activeTab]?.mimetype
                        }
                      />
                      <source
                        src={`${baseUrl.replace(/\/$/, "")}/uploads/audio/${
                          audios[activeTab]?.filename
                        }`}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio player.
                    </audio>
                  ) : (
                    <p>There is no song.</p>
                  )}
                </AudioSection>
              </Introduction>

              <QuestionBox>
                {data?.sections[activeTab]?.question?.map(
                  (questionGroup, qIdx) => (
                    <div key={qIdx}>
                      <h4>{questionGroup?.questionTitle}</h4>
                      <p>{questionGroup?.questionIntro}</p>
                      {questionGroup?.questionsTask?.map((task, idx) => (
                        <QuestionItem key={idx}>
                          <p>
                            <strong>{task?.number}.</strong>{" "}
                            {task.type === "text"
                              ? renderLabelWithInputs(task?.question, idx, task)
                              : task?.question}
                          </p>

                          {task.type === "radio" && (
                            <RadioGroup>
                              {task.options.map((opt, i) => (
                                <label key={i}>
                                  <input
                                    spellCheck={false}
                                    type="radio"
                                    name={`radio-${activeTab}-${task?.number}`}
                                    value={opt}
                                    checked={
                                      answers[
                                        `${activeTab}-${task?.number}`
                                      ] === opt
                                    }
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        task?.number,
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

                          {task?.type === "select" && (
                            <Select
                              value={
                                answers[`${activeTab}-${task?.number}`] || ""
                              }
                              onChange={(e) =>
                                handleAnswerChange(
                                  task.number,
                                  e.target.value,
                                  activeTab
                                )
                              }
                            >
                              <option value="">Select</option>
                              {task?.options?.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                          )}
                        </QuestionItem>
                      ))}
                    </div>
                  )
                )}
              </QuestionBox>
            </TabContent>

            <TabContainer>
              {data?.sections?.map((section, index) => (
                <TabButton
                  key={index}
                  onClick={() => setActiveTab(index)}
                  $active={activeTab === index}
                >
                  {section?.part}
                </TabButton>
              ))}
            </TabContainer>

            {activeTab === data?.sections?.length - 1 && (
              <Button onClick={handleSubmit}>Send</Button>
            )}
          </div>
        )}
      </GlobalContainer>
    </div>
  );
}

export default Listening;
