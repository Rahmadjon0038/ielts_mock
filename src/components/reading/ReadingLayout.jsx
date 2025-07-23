import React, { useEffect, useRef, useState } from 'react';
import { Container, Introduction, LeftBox, Parts, Partsitem, RightBox, Tables, Times } from './style';
import { useGetReadingQuestion, useSubmitReadingAnswers } from '@/hooks/user';
import { useLatestMonth } from '@/hooks/useLatestMonth';
import { useAuth } from '@/context/userData';

function ReadingLayout() {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 soat
  const timerRef = useRef(null);
  const { data, isLoading, error, refetch } = useLatestMonth();
  const { data: readingdata, isLoading: readingLoading, error: readingLoader } = useGetReadingQuestion(data?.id);

  // Barcha javoblarni saqlash uchun strukturali holat
  const [answers, setAnswers] = useState({}); // { [partIndex]: { [questionNum]: value } }

  const [partReplacement, setPartReplacement] = useState(0);
  const parts = readingdata && readingdata[partReplacement];
  const { user } = useAuth()
  const userId = user?.user?.id
  const monthId = data?.id
  const { mutate, isLoading: sumbitLoding, isSuccess, isError, error: sumbitError } = useSubmitReadingAnswers();

  // Timer logikasi (agar kerak bo'lsa, oching)
  // useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     setTimeLeft((prev) => (prev <= 1 ? (clearInterval(timerRef.current), 0) : prev - 1));
  //   }, 1000);
  //   return () => clearInterval(timerRef.current);
  // }, []);

  // const formatTime = (totalSeconds) => {
  //   const min = Math.floor(totalSeconds / 60);
  //   const sec = totalSeconds % 60;
  //   return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  // };

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

    readingdata?.forEach((part, partIndex) => {
      part?.question?.forEach((section) => {
        section?.questionsTask?.forEach((q) => {
          // text-multi type
          if (q.type === 'text-multi' && Array.isArray(q.numbers)) {
            q.numbers.forEach((num) => {
              result.push({
                part: part.part,
                questionNumber: num,
                questionText: q.question,
                userAnswer: answers[partIndex]?.[`testNum${num}`] || null,
                type: q.type,
                options: q.options || [],
              });
            });
          }
          // table type
          else if (q.type === 'table' && Array.isArray(q.numbers)) {
            q.numbers.forEach((num) => {
              const row = q.table?.[0]?.rows?.find((r) => r.number === num);
              result.push({
                part: part.part,
                questionNumber: num,
                questionText: row?.question || null,
                userAnswer: answers[partIndex]?.[`testNum${num}`] || null,
                type: q.type,
                options: [],
              });
            });
          }
          // other types
          else {
            result.push({
              part: part.part,
              questionNumber: q.number,
              questionText: q.question,
              userAnswer: answers[partIndex]?.[`testNum${q.number}`] || null,
              type: q.type,
              options: q.options || [],
            });
          }
        });
      });
    });


    mutate({
      userId, monthId,
      questions: result
    })
  };

  return (
    <>
      <Times>{/* <p>{formatTime(timeLeft)}</p> */}</Times>

      <Introduction>
        <b>{parts?.part}</b>
        <p>{parts?.intro}</p>
      </Introduction>

      <Container>
        <LeftBox>
          <h3>{parts?.textTitle}</h3>
          <p>{parts?.text}</p>
        </LeftBox>

        <RightBox>
          <b>{parts?.question?.questionTitle}</b>
          <p>{parts?.question?.questionIntro}</p>
          <div>
            {parts?.question?.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-6">
                <h3 className="question-title">{section?.questionTitle}</h3>
                <p className="text-gray-600 mb-4">{section?.questionIntro}</p>

                {section?.questionsTask?.map((item) => (
                  <div key={item?.id} className="mb-4">
                    {/* TEXT-MULTI TYPE */}
                    {item?.type === 'text-multi' ? (
                      <div className="whitespace-pre-wrap leading-8">
                        {(() => {
                          const parts = item?.question.split('[]');
                          const inputs = item?.numbers || [];
                          return parts.map((part, idx) => (
                            <span key={idx}>
                              <span className="input-text">{part}</span>
                              {idx < inputs.length && (
                                <>
                                  <label className="inline-block font-semibold mr-1">
                                    <b>{inputs[idx]}</b>.
                                  </label>
                                  <input
                                    type="text"
                                    className="inline-block border border-gray-300 rounded px-2 py-1 mx-1 w-40"
                                    value={answers[partReplacement]?.[`testNum${inputs[idx]}`] || ''}
                                    onChange={(e) => handleAnswerChange(inputs[idx], e.target.value)}
                                  />
                                </>
                              )}
                            </span>
                          ));
                        })()}
                      </div>
                    )
                      // TABLE TYPE
                      : item?.type === 'table' ? (
                        <div className="overflow-x-auto">
                          <Tables borde='1' className="">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 border">#</th>
                                <th className="px-3 py-2 border">Savol</th>
                                <th className="px-3 py-2 border">Javob</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item?.table?.[0]?.rows?.map((row, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 border text-center">{row.number}</td>
                                  <td className="px-3 py-2 border">
                                    {row.question?.split('[]').map((part, idx, arr) => (
                                      <span key={idx}>
                                        {part}
                                        {idx !== arr.length - 1 && (
                                          <input
                                            type="text"
                                            className="border border-gray-300 rounded px-1 py-0.5 mx-1 w-32 inline-block"
                                            value={answers[partReplacement]?.[`testNum${row.number}`] || ''}
                                            onChange={(e) => handleAnswerChange(row.number, e.target.value)}
                                          />
                                        )}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {!row.question?.includes('[]') && (
                                      <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-2 py-1"
                                        value={answers[partReplacement]?.[`testNum${row.number}`] || ''}
                                        onChange={(e) => handleAnswerChange(row.number, e.target.value)}
                                      />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Tables>
                        </div>
                      )
                        : item?.type === 'checkbox' ? (
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
                                      checked={answers[partReplacement]?.[`testNum${item.number}`]?.includes(opt) || false}
                                      onChange={(e) => {
                                        const prev = answers[partReplacement]?.[`testNum${item.number}`] || [];
                                        const updated = e.target.checked
                                          ? [...prev, e.target.value]
                                          : prev.filter((val) => val !== e.target.value);
                                        handleAnswerChange(item.number, updated);
                                      }}
                                    />
                                    {opt}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </>
                        )
                          : (
                            <>
                              <div className="questionid mb-2">
                                <b>{item?.number}.</b>
                                {item?.type === 'text' ? (
                                  <span>
                                    {item?.question?.split('[]').map((part, index, arr) => (
                                      <span key={index}>
                                        {part}
                                        {index !== arr.length - 1 && (
                                          <input
                                            type="text"
                                            className="inline-block border border-gray-300 rounded px-2 py-1 mx-1 w-40"
                                            value={answers[partReplacement]?.[`testNum${item.number}`] || ''}
                                            onChange={(e) => handleAnswerChange(item.number, e.target.value)}
                                          />
                                        )}
                                      </span>
                                    ))}
                                  </span>
                                ) : (
                                  <span>{item?.question}</span>
                                )}
                              </div>

                              {item?.type === 'radio' &&
                                item?.options?.map((i, idx) => (
                                  <label key={idx} className="block ml-4">
                                    <div className="answerInput flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name={`question-${item.id}`}
                                        value={i}
                                        checked={answers[partReplacement]?.[`testNum${item.number}`] === i}
                                        onChange={(e) => handleAnswerChange(item.number, e.target.value)}
                                      />
                                      {i}
                                    </div>
                                  </label>
                                ))}

                              {item?.type === 'select' && (
                                <div className="ml-4 mt-2">
                                  <select
                                    className="border border-gray-300 rounded px-2 py-1"
                                    value={answers[partReplacement]?.[`testNum${item.number}`] || ''}
                                    onChange={(e) => handleAnswerChange(item.number, e.target.value)}
                                  >
                                    <option value="" disabled>Javobni tanlang</option>
                                    {item?.options?.map((opt, i) => (
                                      <option key={i} value={opt}>{opt}</option>
                                    ))}
                                  </select>
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
      <button onClick={handleSubmit}>Sumbit</button>
    </>
  );
}

export default ReadingLayout;