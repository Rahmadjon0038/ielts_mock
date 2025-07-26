import React, { useEffect, useRef, useState } from 'react';
import { Container, Input, Introduction, LeftBox, Parts, Partsitem, RightBox, Selectted, Tables, Times } from './style';
import { useGetReadingQuestion, useSubmitReadingAnswers } from '@/hooks/user';
import { useLatestMonth } from '@/hooks/useLatestMonth';
import { useAuth } from '@/context/userData';
import { useAddUntied, useGetUntied } from '@/hooks/untied';
import { usePathname } from 'next/navigation';
import Untied from '../untied';
import Loader from '../loader/Loader';
import NoResult from '../NoResult';

function ReadingLayout() {
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const timerRef = useRef(null);
  const { data, isLoading, error, refetch } = useLatestMonth();
  const { data: readingdataS, isLoading: readingLoading, error: readingLoader } = useGetReadingQuestion(data?.id);


const readingdata = Array.isArray(readingdataS)
  ? readingdataS.sort((a, b) => a.id - b.id)
  : [];

  const [answers, setAnswers] = useState({}); //
  const { user } = useAuth()
  const pathname = usePathname()
  const section = pathname.split('/').pop();
  const untied = {
    monthId: data?.id,
    userId: user?.user?.id,
    section: section,
  }
  const untiedmutation = useAddUntied() //  bolimni yechgani haqida malumot

  const { data: untiedHok } = useGetUntied(untied); // 

  const [partReplacement, setPartReplacement] = useState(0);
  const parts = readingdata && readingdata[partReplacement];
  const userId = user?.user?.id
  const monthId = data?.id
  const { mutate, isLoading: sumbitLoding, isSuccess, isError, error: sumbitError } = useSubmitReadingAnswers();

  useEffect(() => {
    if (untiedHok?.submitted) return; // agar oldin yuborgan bo‘lsa — timer ishlamasin

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [untiedHok]);


  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, totalSeconds); // -1, -2 bo‘lsa ham 0 ko‘rsatadi
    const min = Math.floor(safeSeconds / 60);
    const sec = safeSeconds % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };


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
    if (untiedHok?.submitted) return; // oldin yuborgan bo‘lsa qayt

    const result = [];

    readingdata?.forEach((part, partIndex) => {
      part?.question?.forEach((section) => {
        section?.questionsTask?.forEach((q) => {
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
          } else if (q.type === 'table' && Array.isArray(q.numbers)) {
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
          } else {
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
      userId,
      monthId,
      questions: result,
      onSucess: () => {
      },
    });
    untiedmutation.mutate(untied);

  };
  //  const { data: readingdata, isLoading: readingLoading, error: readingLoader } 

  if (readingLoading || readingLoading) {
    return <div style={{ position: 'relative', height: '500px' }}><Loader /></div>
  }

  // NoResult — writing yo‘q bo‘lsa yoki bo‘sh bo‘lsa
  if (!readingdata || Object.keys(readingdata).length === 0) {
    return <NoResult writing={'writing'} message="There are no reading tests." />
  }


  return (
    <>
      {
        untiedHok?.submitted ?
          <Untied />
          :
          <div>
            <Times>{formatTime(timeLeft)}</Times>

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
                                        <Input
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
                                      <th className="px-3 py-2 border"></th>
                                      <th className="px-3 py-2 border"></th>
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
                                                <Input
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
                                        <Selectted
                                          className="selectted"
                                          value={answers[partReplacement]?.[`testNum${item.number}`] || ''}
                                          onChange={(e) => handleAnswerChange(item.number, e.target.value)}
                                        >
                                          <option value="" disabled>Choose the answer</option>
                                          {item?.options?.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
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
            <button style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
            }} onClick={handleSubmit}>Send</button>
          </div>}
    </>
  );
}

export default ReadingLayout;