import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Input,
  Introduction,
  LeftBox,
  Parts,
  Partsitem,
  RightBox,
  Selectted,
  Tables,
  Times,
} from "./style";
import { useGetReadingQuestion, useSubmitReadingAnswers } from "@/hooks/user";
import { useLatestMonth } from "@/hooks/useLatestMonth";
import { useAuth } from "@/context/userData";
import { useAddUntied, useGetUntied } from "@/hooks/untied";
import { usePathname } from "next/navigation";
import Untied from "../untied";
import Loader from "../loader/Loader";
import NoResult from "../NoResult";
import TimerModal from "../Timer/TimerComponent";
import Countdown from "react-countdown";
import { useAddtimer, useGetTimer } from "@/hooks/timer";
import MiniLoader from "../MiniLoader/MiniLoader";
import { useAassessment } from "@/hooks/writing";
import { TextBlock } from "@/globalStyle";
import usePreventRefresh from "../BlockendReload";

function ReadingLayout() {
  const { data, isLoading, error, refetch } = useLatestMonth();
  const {
    data: readingdataS,
    isLoading: readingLoading,
    error: readingLoader,
  } = useGetReadingQuestion(data?.id);
  const [answers, setAnswers] = useState({}); //
  const { user } = useAuth();
  const pathname = usePathname();
  const section = pathname.split("/").pop();

  const timerMutation = useAddtimer();
  const {
    data: timer,
    isLoading: timerLoading,
    error: timerError,
  } = useGetTimer(user?.user?.id, section, data?.id); // vaqtni olish

  // ------ baxolash ------------------------
  const setAassessment = useAassessment();

  const untied = {
    monthId: data?.id,
    userId: user?.user?.id,
    section: section,
  };
  const untiedmutation = useAddUntied(); //  bolimni yechgani haqida malumot
  const { data: untiedHok } = useGetUntied(untied); //

  const paramdata = { id: data?.id, userid: user?.user?.id };
  useEffect(() => {
    if (user?.user?.id && section && readingdataS && !untiedHok?.submitted) {
      timerMutation.mutate({
        userId: user.user.id,
        section,
        monthId: data?.id,
      });
    }
  }, [user?.user?.id, section, readingdataS, untiedHok?.submitted, data?.id]);

  usePreventRefresh();

  const readingdata = Array.isArray(readingdataS)
    ? readingdataS.sort((a, b) => a.id - b.id)
    : [];

  const [partReplacement, setPartReplacement] = useState(0);
  const parts = readingdata && readingdata[partReplacement];
  const userId = user?.user?.id;
  const monthId = data?.id;
  const {
    mutate,
    isLoading: sumbitLoding,
    isSuccess,
    isError,
    error: sumbitError,
  } = useSubmitReadingAnswers();

  const handleAnswerChange = (num, taskValue, partIndex = partReplacement) => {
    setAnswers((prev) => ({
      ...prev,
      [partIndex]: {
        ...(prev[partIndex] || {}),
        [`testNum${num}`]: taskValue,
      },
    }));
  };

  const handleSubmit = () => {
    const result = [];
    let correctCount = 0;
    let totalCount = 0;

    function getBandScore(rawScore) {
      if (rawScore >= 39 && rawScore <= 40) return 9;
      if (rawScore >= 37 && rawScore <= 38) return 8.5;
      if (rawScore >= 35 && rawScore <= 36) return 8;
      if (rawScore >= 33 && rawScore <= 34) return 7.5;
      if (rawScore >= 30 && rawScore <= 32) return 7;
      if (rawScore >= 27 && rawScore <= 29) return 6.5;
      if (rawScore >= 23 && rawScore <= 26) return 6;
      if (rawScore >= 19 && rawScore <= 22) return 5.5;
      if (rawScore >= 15 && rawScore <= 18) return 5;
      if (rawScore >= 13 && rawScore <= 14) return 4.5;
      if (rawScore >= 10 && rawScore <= 12) return 4;
      if (rawScore >= 8 && rawScore <= 9) return 3.5;
      if (rawScore >= 6 && rawScore <= 7) return 3;
      if (rawScore >= 4 && rawScore <= 5) return 2.5;
      return 0; // agar 0–3 oralig‘ida bo‘lsa
    }

    function isCorrect(userAns, correctAns) {
      if (typeof userAns !== "string" || typeof correctAns !== "string")
        return false;
      return userAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
    }

    readingdata?.forEach((part, partIndex) => {
      part?.question?.forEach((section) => {
        section?.questionsTask?.forEach((q) => {
          // 1. TABLE: table.rows[].answer asosiy!
          if (q.type === "table" && q.table?.[0]?.rows?.length) {
            q.table[0].rows.forEach((row) => {
              const userAns =
                answers[partIndex]?.[`testNum${row.number}`] || "";
              const correctAns = row.answer || "";
              result.push({
                part: part.part,
                questionNumber: row.number,
                questionText: row.question,
                userAnswer: userAns,
                correctAnswer: correctAns,
                type: q.type,
                options: [],
              });
              totalCount++;
              if (userAns.trim() && isCorrect(userAns, correctAns)) {
                correctCount++;
              }
            });
          }
          // 2. Checkbox type
          else if (q.type === "checkbox") {
            const userAns = answers[partIndex]?.[`testNum${q.number}`] || [];
            const correctAns = Array.isArray(q.answer) ? q.answer : [];
            result.push({
              part: part.part,
              questionNumber: q.number,
              questionText: q.question,
              userAnswer: userAns.join(', '),
              correctAnswer: correctAns.join(', '),
              type: q.type,
              options: q.options || [],
            });
            totalCount++;
            if (userAns.sort().join(',') === correctAns.sort().join(',')) {
              correctCount++;
            }
          }
          // 3. Multi-text (numbers va answer array bor)
          else if (q.type === "text-multi") {
            const correctAnswers = Array.isArray(q.answer)
              ? q.answer
              : JSON.parse(q.answer || "[]");
            const fullQuestionText = q.question;

            q.numbers.forEach((num, idx) => {
              const userAns = answers[partIndex]?.[`testNum${num}`] || "";
              const correctAns = correctAnswers[idx] || "";

              result.push({
                part: part.part,
                questionNumber: num,
                questionText: fullQuestionText,
                userAnswer: userAns,
                correctAnswer: correctAns,
                type: q.type,
                options: q.options || [],
              });

              totalCount++;
              if (userAns.trim() && isCorrect(userAns, correctAns)) {
                correctCount++;
              }
            });
          }

          // 4. TABLE yoki multi-answer savollar (numbers va answers array bor)
          else if (
            Array.isArray(q.numbers) &&
            Array.isArray(q.answers) &&
            q.answers.length
          ) {
            q.numbers.forEach((num, idx) => {
              const correctAns = q.answers[idx]?.answer || "";
              const userAns = answers[partIndex]?.[`testNum${num}`] || "";
              result.push({
                part: part.part,
                questionNumber: num,
                questionText: q.answers[idx]?.question || "",
                userAnswer: userAns,
                correctAnswer: correctAns,
                type: q.type,
                options: q.options || [],
              });
              totalCount++;
              if (userAns.trim() && isCorrect(userAns, correctAns)) {
                correctCount++;
              }
            });
          }
          // 5. Oddiy radio/select savollar (number va answer bor)
          else if (
            typeof q.number === "number" &&
            typeof q.answer === "string"
          ) {
            const userAns = answers[partIndex]?.[`testNum${q.number}`] || "";
            const correctAns = q.answer;
            result.push({
              part: part.part,
              questionNumber: q.number,
              questionText: q.question,
              userAnswer: userAns,
              correctAnswer: correctAns,
              type: q.type,
              options: q.options || [],
            });
            totalCount++;
            if (userAns.trim() && isCorrect(userAns, correctAns)) {
              correctCount++;
            }
          }
        });
      });
    });

    const bandScore = getBandScore(correctCount);

    mutate({
      userId,
      monthId,
      questions: result,
      onSucess: (data) => {
        untiedmutation.mutate(untied);
        setAassessment.mutate({
          section,
          score: bandScore,
          comment:
            "Evaluation completed. Your score has been automatically calculated by the system. If there are any shortcomings, they will be reviewed and corrected by the admin.",
          paramdata,
        });
      },
    });
  };

  const endTime = useMemo(() => {
    if (!timer?.startTime) return null; // hali kelmagan bo‘lsa
    return new Date(new Date(timer.startTime).getTime() + 60 * 60 * 1000);
  }, [timer?.startTime]);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return (
        <TimerModal
          untieddata={untiedHok?.submitted}
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

  if (readingLoading || readingLoading) {
    return (
      <div style={{ position: "relative", height: "900px" }}>
        <Loader />
      </div>
    );
  }

  // NoResult — writing yo‘q bo‘lsa yoki bo‘sh bo‘lsa
  if (!readingdata || Object.keys(readingdata).length === 0) {
    return (
      <NoResult writing={"writing"} message="There are no reading tests." />
    );
  }

  return (
    <>
      {untiedHok?.submitted ? (
        <Untied />
      ) : (
        <div>
          <Times>
            <p>
              {endTime ? (
                <Countdown date={endTime} renderer={renderer} />
              ) : (
                <MiniLoader />
              )}
            </p>
          </Times>
          <Introduction>
            <b>{parts?.part}</b>
            <p>{parts?.intro}</p>
          </Introduction>

          <Container>
            <LeftBox>
              <h3>{parts?.textTitle || parts?.texttitle}</h3>
              <TextBlock>{parts?.text}</TextBlock>
            </LeftBox>

            <RightBox>
              <div>
                {parts?.question?.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="mb-6">
                    <h3 className="question-title">{section?.questionTitle || section?.questiontitle}</h3>
                    <p className="text-gray-600 mb-4">
                      {section?.questionintro}
                    </p>

                    {section?.questionsTask?.map((item) => (
                      <div key={item?.id} className="mb-4">
                        {/* TEXT-MULTI TYPE */}
                        {item?.type === "text-multi" ? (
                          <div className="whitespace-pre-wrap leading-8">
                            {(() => {
                              const parts = item?.question.split("[]");
                              const inputs = item?.numbers || [];
                              return parts.map((part, idx) => (
                                <span key={idx}>
                                  <span className="input-text">{part}</span>
                                  {idx < inputs.length && (
                                    <>
                                      <label className="inline-block font-semibold mr-1">
                                        <b>{inputs[idx]}</b>.
                                      </label>
                                      <Input
                                        type="text"
                                        className="inline-block border border-gray-300 rounded px-2 py-1 mx-1 w-40"
                                        value={
                                          answers[partReplacement]?.[
                                            `testNum${inputs[idx]}`
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            inputs[idx],
                                            e.target.value
                                          )
                                        }
                                      />
                                    </>
                                  )}
                                </span>
                              ));
                            })()}
                          </div>
                        ) : // TABLE TYPE
                        item?.type === "table" ? (
                          <div className="overflow-x-auto">
                            <Tables borde="1" className="">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-3 py-2 border">#</th>
                                  <th className="px-3 py-2 border"></th>
                                  <th className="px-3 py-2 border"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {item?.table?.[0]?.rows?.map((row, index) => (
                                  <tr key={index}>
                                    <td className="px-3 py-2 border text-center">
                                      {row.number}
                                    </td>
                                    <td className="px-3 py-2 border">
                                      {row.question
                                        ?.split("[]")
                                        .map((part, idx, arr) => (
                                          <span key={idx}>
                                            {part}
                                            {idx !== arr.length - 1 && (
                                              <Input
                                                type="text"
                                                className="border border-gray-300 rounded px-1 py-0.5 mx-1 w-32 inline-block"
                                                value={
                                                  answers[partReplacement]?.[
                                                    `testNum${row.number}`
                                                  ] || ""
                                                }
                                                onChange={(e) =>
                                                  handleAnswerChange(
                                                    row.number,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            )}
                                          </span>
                                        ))}
                                    </td>
                                    <td className="px-3 py-2 border">
                                      {!row.question?.includes("[]") && (
                                        <Input
                                          type="text"
                                          className="w-full border border-gray-300 rounded px-2 py-1"
                                          value={
                                            answers[partReplacement]?.[
                                              `testNum${row.number}`
                                            ] || ""
                                          }
                                          onChange={(e) =>
                                            handleAnswerChange(
                                              row.number,
                                              e.target.value
                                            )
                                          }
                                        />
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Tables>
                          </div>
                        ) : item?.type === "checkbox" ? (
                          <>
                            <div className="questionid mb-2">
                              <b>{item?.number}.</b> {item?.question}
                            </div>
                            <div className="ml-4">
                              {item?.options?.map((opt, idx) => (
                                <label key={idx} className="block mb-1">
                                  <div className="answerInput flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      value={opt}
                                      checked={
                                        answers[partReplacement]?.[
                                          `testNum${item.number}`
                                        ]?.includes(opt) || false
                                      }
                                      onChange={(e) => {
                                        const prev =
                                          answers[partReplacement]?.[
                                            `testNum${item.number}`
                                          ] || [];
                                        const updated = e.target.checked
                                          ? [...prev, e.target.value]
                                          : prev.filter(
                                              (val) => val !== e.target.value
                                            );
                                        handleAnswerChange(
                                          item.number,
                                          updated
                                        );
                                      }}
                                    />
                                    {opt}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="questionid mb-2">
                              <b>{item?.number}.</b>
                              {item?.type === "text" ? (
                                <span>
                                  {item?.question
                                    ?.split("[]")
                                    .map((part, index, arr) => (
                                      <span key={index}>
                                        {part}
                                        {index !== arr.length - 1 && (
                                          <input
                                            type="text"
                                            className="inline-block border border-gray-300 rounded px-2 py-1 mx-1 w-40"
                                            value={
                                              answers[partReplacement]?.[
                                                `testNum${item.number}`
                                              ] || ""
                                            }
                                            onChange={(e) =>
                                              handleAnswerChange(
                                                item.number,
                                                e.target.value
                                              )
                                            }
                                          />
                                        )}
                                      </span>
                                    ))}
                                  {!item?.question?.includes("[]") && (
                                    <Input
                                      type="text"
                                      className="inline-block border border-gray-300 rounded px-2 py-1 mx-1 w-40"
                                      value={
                                        answers[partReplacement]?.[
                                          `testNum${item.number}`
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          item.number,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </span>
                              ) : (
                                <span>{item?.question}</span>
                              )}
                            </div>

                            {item?.type === "radio" &&
                              item?.options?.map((i, idx) => (
                                <label key={idx} className="block ml-4">
                                  <div className="answerInput flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`question-${item.id}`}
                                      value={i}
                                      checked={
                                        answers[partReplacement]?.[
                                          `testNum${item.number}`
                                        ] === i
                                      }
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          item.number,
                                          e.target.value
                                        )
                                      }
                                    />
                                    {i}
                                  </div>
                                </label>
                              ))}

                            {item?.type === "select" && (
                              <div className="ml-4 mt-2">
                                <Selectted
                                  className="selectted"
                                  value={
                                    answers[partReplacement]?.[
                                      `testNum${item.number}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      item.number,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Choose the answer
                                  </option>
                                  {item?.options?.map((opt, i) => (
                                    <option key={i} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </Selectted>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </RightBox>
          </Container>

          <Parts>
            {readingdata?.map((item, index) => (
              <Partsitem key={index} onClick={() => setPartReplacement(index)}>
                <p>{item?.part}</p>
              </Partsitem>
            ))}
          </Parts>
          {/* Submit tugmasi faqat oxirgi tabda ko'rinadi */}
          {partReplacement === readingdata.length - 1 && (
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#ff0000",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
            >
              Send
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ReadingLayout;