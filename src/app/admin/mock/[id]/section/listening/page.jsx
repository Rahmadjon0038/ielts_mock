
'use client';
import React, { useState, useEffect } from 'react';
import { Badge, Button, ButtonGroup, Container, FormContent, FormGroup, FormWrapper, Header, Input, Label, NumberBadge, OptionInput, OptionsList, OptionText, QuestionCard, QuestionHeader, QuestionTitle, Row, SaveButton, SectionCard, SectionHeader, SectionTitle, Subtitle, TaskCard, TaskHeader, TaskType, Textarea, Title } from './style';
import Audioform from '@/components/Listening/AudioForm';
import { useAddListeningTask } from '@/hooks/listening';
import { useParams } from 'next/navigation';


export default function ListeningForm() {

  const { id } = useParams()
  const [formData, setFormData] = useState({
    monthId: id || '',
    sections: []
  });
  const [isLoaded, setIsLoaded] = useState(false); // Loading state qo'shamiz

  const addListeningMutation = useAddListeningTask()

  // Component yuklanganda localStorage dan ma'lumotlarni olish
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const savedData = localStorage.getItem(`listeningForm_${id}`);
        console.log('localStorage dan olingan ma\'lumot:', savedData); // Debug uchun
        
        if (savedData && savedData !== 'undefined' && savedData !== 'null') {
          const parsedData = JSON.parse(savedData);
          console.log('Parse qilingan ma\'lumot:', parsedData); // Debug uchun
          
          if (parsedData && parsedData.monthId) { // Ensure parsedData is valid and has monthId
            setFormData(parsedData);
          } else {
            // If parsedData is invalid or missing monthId, reinitialize
            console.warn('localStorage dan olingan ma\'lumotlar to\'liq emas, qayta initsializatsiya qilinmoqda.');
            setFormData({ monthId: id, sections: [] });
          }
        } else {
          // No saved data or invalid savedData string, initialize clean
          setFormData({ monthId: id, sections: [] });
        }
      } catch (error) {
        console.error('localStorage ma\'lumotlarini yuklashda xatolik:', error);
        // On error, initialize clean
        setFormData({ monthId: id, sections: [] });
      }
      setIsLoaded(true); // Ma'lumotlar yuklandi
    }
  }, [id]);

  // formData o'zgarganda localStorage ga saqlash (faqat yuklash tugagandan keyin)
  useEffect(() => {
    if (typeof window !== 'undefined' && formData.monthId && isLoaded) {
      try {
        const dataToSave = JSON.stringify(formData);
        localStorage.setItem(`listeningForm_${formData.monthId}`, dataToSave);
        console.log('localStorage ga saqlandi:', dataToSave); // Debug uchun
      } catch (error) {
        console.error('localStorage ga saqlashda xatolik:', error);
      }
    }
  }, [formData, isLoaded]);

  // Keyingi savol raqamini avtomatik hisoblash
  const getNextQuestionNumber = () => {
    let maxNumber = 0;
    formData.sections.forEach(section => {
      section.question?.forEach(questionGroup => {
        questionGroup.questionsTask?.forEach(task => {
          if (task.number && task.number > maxNumber) {
            maxNumber = task.number;
          }
        });
      });
    });
    return maxNumber + 1;
  };

  // Section qo'shish
  const addSection = () => {
    const newSection = {
      part: `Section ${formData.sections.length + 1}`,
      intro: '',
      textTitle: '',
      text: '',
      question: []
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Section o'chirish
  const removeSection = (sectionIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex)
    }));
  };

  // Section yangilash
  const updateSection = (sectionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    }));
  };

  // Question group qo'shish
  const addQuestionGroup = (sectionIndex) => {
    const newQuestion = {
      questionTitle: '',
      questionIntro: '',
      questionsTask: []
    };

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? {
          ...section,
          question: [...section.question, newQuestion]
        } : section
      )
    }));
  };

  // Question group o'chirish
  const removeQuestionGroup = (sectionIndex, questionIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? {
          ...section,
          question: section.question.filter((_, qIndex) => qIndex !== questionIndex)
        } : section
      )
    }));
  };

  // Question group yangilash
  const updateQuestionGroup = (sectionIndex, questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? { ...qGroup, [field]: value } : qGroup
          )
        } : section
      )
    }));
  };

  // Task qo'shish - AVTOMATIK RAQAMLASH BILAN
  const addTask = (sectionIndex, questionIndex, taskType) => {
    const nextNumber = getNextQuestionNumber();
    const newTask = {
      number: nextNumber,
      type: taskType,
      question: '',
      options: taskType === 'text' ? [] : ['', ''],
      answer: ''
    };

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? {
              ...qGroup,
              questionsTask: [...qGroup.questionsTask, newTask]
            } : qGroup
          )
        } : section
      )
    }));
  };

  // Task o'chirish
  const removeTask = (sectionIndex, questionIndex, taskIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? {
              ...qGroup,
              questionsTask: qGroup.questionsTask.filter((_, tIndex) => tIndex !== taskIndex)
            } : qGroup
          )
        } : section
      )
    }));
  };

  // Task yangilash
  const updateTask = (sectionIndex, questionIndex, taskIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? {
              ...qGroup,
              questionsTask: qGroup.questionsTask.map((task, tIndex) =>
                tIndex === taskIndex ? { ...task, [field]: value } : task
              )
            } : qGroup
          )
        } : section
      )
    }));
  };

  // Option yangilash
  const updateOption = (sectionIndex, questionIndex, taskIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? {
              ...qGroup,
              questionsTask: qGroup.questionsTask.map((task, tIndex) =>
                tIndex === taskIndex ? {
                  ...task,
                  options: task.options.map((opt, oIndex) =>
                    oIndex === optionIndex ? value : opt
                  )
                } : task
              )
            } : qGroup
          )
        } : section
      )
    }));
  };

  // Option qo'shish
  const addOption = (sectionIndex, questionIndex, taskIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? {
              ...qGroup,
              questionsTask: qGroup.questionsTask.map((task, tIndex) =>
                tIndex === taskIndex ? {
                  ...task,
                  options: [...task.options, '']
                } : task
              )
            } : qGroup
          )
        } : section
      )
    }));
  };

  // Option o'chirish
  const removeOption = (sectionIndex, questionIndex, taskIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex ? {
          ...section,
          question: section.question.map((qGroup, qIndex) =>
            qIndex === questionIndex ? {
              ...qGroup,
              questionsTask: qGroup.questionsTask.map((task, tIndex) =>
                tIndex === taskIndex ? {
                  ...task,
                  options: task.options.filter((_, oIndex) => oIndex !== optionIndex)
                } : task
              )
            } : qGroup
          )
        } : section
      )
    }));
  };

  // Form saqlash
  const handleSubmit = () => {
    console.log('Yuborilayotgan ma\'lumot:', formData); // Debug uchun
    addListeningMutation.mutate(formData)
  };

  // Agar hali yuklanmagan bo'lsa, loading ko'rsatish
  if (!isLoaded) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Ma'lumotlar yuklanmoqda...</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Audioform />
      <FormWrapper>
        <Header>
          <Title>🎧 IELTS Listening Test Admin</Title>
          <Subtitle>Listening test ma'lumotlarini kiritish formasi</Subtitle>
          {/* Debug ma'lumot */}
          <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            Debug: Sections soni: {formData.sections.length}, Month ID: {formData.monthId}
          </div>
        </Header>

        <FormContent>
          {/* Month ID - READONLY */}
          <FormGroup>
            <Label>Month ID</Label>
            <Input
              type="number"
              value={formData.monthId}
              readOnly
              style={{
                backgroundColor: '#f7fafc',
                color: '#4a5568',
                cursor: 'not-allowed'
              }}
              placeholder="URL parametridan olinadi"
            />
          </FormGroup>

          {/* Clear localStorage Button - Debug uchun */}
          <FormGroup>
            {/* <Button 
              danger 
              small 
              onClick={() => {
                localStorage.removeItem(`listeningForm_${id}`);
                setFormData({ monthId: id, sections: [] });
                setIsLoaded(false); // Reset isLoaded to re-trigger useEffect on next render
                console.log('localStorage tozalandi');
                // Optionally, reload the page to completely reset state
                // window.location.reload(); 
              }}
            >
              🗑️ localStorage ni tozalash (Debug)
            </Button> */}
          </FormGroup>

          {/* Sections */}
          {formData.sections.map((section, sectionIndex) => (
            <SectionCard key={sectionIndex}>
              <SectionHeader>
                <SectionTitle>
                  📝 {section.part}
                  <Badge>{sectionIndex + 1}</Badge>
                </SectionTitle>
                <Button danger small onClick={() => removeSection(sectionIndex)}>
                  🗑️ O'chirish
                </Button>
              </SectionHeader>

              <Row columns="1fr 1fr">
                <FormGroup>
                  <Label>Section Nomi</Label>
                  <Input
                    value={section.part}
                    onChange={(e) => updateSection(sectionIndex, 'part', e.target.value)}
                    placeholder="Section 1, Section 2, ..."
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Text Title</Label>
                  <Input
                    value={section.textTitle}
                    onChange={(e) => updateSection(sectionIndex, 'textTitle', e.target.value)}
                    placeholder="Text sarlavhasi"
                  />
                </FormGroup>
              </Row>

              <Row>
                <FormGroup>
                  <Label>Intro</Label>
                  <Textarea
                    value={section.intro}
                    onChange={(e) => updateSection(sectionIndex, 'intro', e.target.value)}
                    placeholder="Section intro matnini kiriting"
                  />
                </FormGroup>
              </Row>

              <Row>
                <FormGroup>
                  <Label>Text Content</Label>
                  <Textarea
                    value={section.text}
                    onChange={(e) => updateSection(sectionIndex, 'text', e.target.value)}
                    placeholder="Asosiy matn (agar kerak bo'lsa)"
                  />
                </FormGroup>
              </Row>

              {/* Questions */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#2d3748' }}>📋 Savollar</h3>
                  <Button secondary onClick={() => addQuestionGroup(sectionIndex)}>
                    ➕ Savol Guruhi
                  </Button>
                </div>

                {section.question?.map((questionGroup, questionIndex) => (
                  <QuestionCard key={questionIndex}>
                    <QuestionHeader>
                      <QuestionTitle>Savol Guruhi {questionIndex + 1}</QuestionTitle>
                      <Button danger small onClick={() => removeQuestionGroup(sectionIndex, questionIndex)}>
                        🗑️
                      </Button>
                    </QuestionHeader>

                    <Row columns="1fr">
                      <FormGroup>
                        <Label>Question Title</Label>
                        <Input
                          value={questionGroup.questionTitle}
                          onChange={(e) => updateQuestionGroup(sectionIndex, questionIndex, 'questionTitle', e.target.value)}
                          placeholder="Questions 1-5"
                        />
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup>
                        <Label>Question Intro</Label>
                        <Textarea
                          value={questionGroup.questionIntro}
                          onChange={(e) => updateQuestionGroup(sectionIndex, questionIndex, 'questionIntro', e.target.value)}
                          placeholder="Savol intro matni"
                        />
                      </FormGroup>
                    </Row>

                    {/* Tasks */}
                    <div style={{ marginTop: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>
                          🎯 Vazifalar (Keyingi raqam: {getNextQuestionNumber()})
                        </span>
                        <ButtonGroup>
                          <Button small secondary onClick={() => addTask(sectionIndex, questionIndex, 'text')}>
                            📝 Text
                          </Button>
                          <Button small secondary onClick={() => addTask(sectionIndex, questionIndex, 'radio')}>
                            ◉ Radio
                          </Button>
                          <Button small secondary onClick={() => addTask(sectionIndex, questionIndex, 'select')}>
                            📋 Select
                          </Button>
                        </ButtonGroup>
                      </div>

                      {questionGroup.questionsTask?.map((task, taskIndex) => (
                        <TaskCard key={taskIndex}>
                          <TaskHeader>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <TaskType type={task.type}>{task.type}</TaskType>
                              <NumberBadge>№ {task.number}</NumberBadge>
                            </div>
                            <Button danger small onClick={() => removeTask(sectionIndex, questionIndex, taskIndex)}>
                              🗑️
                            </Button>
                          </TaskHeader>

                          <Row columns="100px 1fr">
                            <FormGroup>
                              <Label>Raqam</Label>
                              <Input
                                type="number"
                                value={task.number}
                                readOnly
                                style={{
                                  backgroundColor: '#f7fafc',
                                  color: '#4a5568',
                                  cursor: 'not-allowed'
                                }}
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label>Savol Matni</Label>
                              <Textarea
                                value={task.question}
                                onChange={(e) => updateTask(sectionIndex, questionIndex, taskIndex, 'question', e.target.value)}
                                placeholder="Savol matnini kiriting"
                              />
                            </FormGroup>
                          </Row>

                          {task.type !== 'text' && (
                            <FormGroup>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <Label>Variantlar</Label>
                                <Button small secondary onClick={() => addOption(sectionIndex, questionIndex, taskIndex)}>
                                  ➕ Variant
                                </Button>
                              </div>
                              <OptionsList>
                                {task.options?.map((option, optionIndex) => (
                                  <OptionInput key={optionIndex}>
                                    <span style={{ minWidth: '20px', fontWeight: '600', color: '#666' }}>
                                      {String.fromCharCode(65 + optionIndex)}:
                                    </span>
                                    <OptionText
                                      value={option}
                                      onChange={(e) => updateOption(sectionIndex, questionIndex, taskIndex, optionIndex, e.target.value)}
                                      placeholder={`Variant ${String.fromCharCode(65 + optionIndex)}`}
                                    />
                                    <Button small danger onClick={() => removeOption(sectionIndex, questionIndex, taskIndex, optionIndex)}>
                                      ❌
                                    </Button>
                                  </OptionInput>
                                ))}
                              </OptionsList>
                            </FormGroup>
                          )}

                          <FormGroup>
                            <Label>To'g'ri Javob</Label>
                            <Input
                              value={task.answer}
                              onChange={(e) => updateTask(sectionIndex, questionIndex, taskIndex, 'answer', e.target.value)}
                              placeholder="To'g'ri javobni kiriting"
                            />
                          </FormGroup>
                        </TaskCard>
                      ))}
                    </div>
                  </QuestionCard>
                ))}
              </div>
            </SectionCard>
          ))}

          {/* Add Section Button */}
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button secondary onClick={addSection}>
              ➕ Yangi Section Qo'shish
            </Button>
          </div>
        </FormContent>

        <SaveButton onClick={handleSubmit}>
          💾 Saqlash va Console'ga Chiqarish
        </SaveButton>
      </FormWrapper>
    </Container>
  );
}
