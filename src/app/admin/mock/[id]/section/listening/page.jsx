'use client'
// pages/index.js
import { useState, useMemo } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 80px;
  color: #e6ebff;
  background: radial-gradient(1200px 600px at 20% -10%, #1a2240 0%, #0b0f19 60%), #0b0f19;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
`;
const Title = styled.h1`margin: 0 0 8px 0; font-size: 26px;`;
const Sub = styled.p`margin: 0 0 20px 0; color: #b7c0d8;`;
const Toolbar = styled.div`display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 16px 0;`;
const Card = styled.div`
  background: linear-gradient(180deg, #0f1524 0%, #0c111d 100%);
  border: 1px solid #1e2740;
  border-radius: 12px;
  padding: 16px;
  margin: 14px 0;
  box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03);
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  margin-bottom: 10px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
const Label = styled.label`color: #b7c0d8; padding-top: 10px; font-size: 13px;`;
const Input = styled.input`
  background: #121826; color: #e6ebff; border: 1px solid #29324b; border-radius: 10px; padding: 10px 12px; outline: none;
  &:focus { border-color: #5b8cff; box-shadow: 0 0 0 3px rgba(91,140,255,.15); }
`;
const Textarea = styled.textarea`
  background: #121826; color: #e6ebff; border: 1px solid #29324b; border-radius: 10px; padding: 10px 12px; outline: none; min-height: 90px; resize: vertical;
  &:focus { border-color: #5b8cff; box-shadow: 0 0 0 3px rgba(91,140,255,.15); }
`;
const Select = styled.select`
  background: #121826; color: #e6ebff; border: 1px solid #29324b; border-radius: 10px; padding: 10px 12px; outline: none;
  &:focus { border-color: #5b8cff; box-shadow: 0 0 0 3px rgba(91,140,255,.15); }
`;
const Button = styled.button`
  background: ${(p) =>
    p.$variant === 'danger' ? '#ff6474'
    : p.$variant === 'ghost' ? 'transparent'
    : 'linear-gradient(180deg, #5b8cff, #507df1)'};
  color: ${(p) => (p.$variant === 'ghost' ? '#e6ebff' : '#0c111d')};
  border: ${(p) => (p.$variant === 'ghost' ? '1px solid #2a3552' : 'none')};
  border-radius: 10px; padding: 10px 14px; cursor: pointer; transition: transform .06s ease;
  &:active { transform: translateY(1px); }
`;
const Small = styled(Button)`padding: 8px 10px; font-size: 13px;`;
const GroupTitle = styled.h3`margin: 8px 0 12px 0; font-weight: 600;`;
const Line = styled.hr`border: none; border-top: 1px dashed #2a3552; margin: 14px 0;`;
const JsonPreview = styled.pre`
  background: #0a0f1a; border: 1px solid #1f2840; border-radius: 10px; padding: 14px; overflow: auto; max-height: 40vh;
`;

const initialForm = {
  monthId: '',
  sections: [
    {
      audio: '',
      part: '',
      intro: '',
      textTitle: '',
      text: '',
      question: [
        {
          questionTitle: '',
          questionIntro: '',
          questionsTask: [{ number: 1, type: 'text', question: '', options: [] }],
        },
      ],
    },
  ],
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export default function Builder() {
  const [form, setForm] = useState(initialForm);
  const pretty = useMemo(() => JSON.stringify(form, null, 2), [form]);

  // Top-level
  const setMonthId = (val) => setForm((p) => ({ ...p, monthId: val === '' ? '' : Number(val) }));

  // Sections
  const addSection = () => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections.push({
        audio: '',
        part: `Section ${next.sections.length + 1}`,
        intro: '',
        textTitle: '',
        text: '',
        question: [
          { questionTitle: '', questionIntro: '', questionsTask: [{ number: 1, type: 'text', question: '', options: [] }] },
        ],
      });
      return next;
    });
  };
  const removeSection = (si) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections.splice(si, 1);
      return next;
    });
  };
  const setSectionField = (si, key, val) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si][key] = val;
      return next;
    });
  };

  // Groups
  const addGroup = (si) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question.push({
        questionTitle: '',
        questionIntro: '',
        questionsTask: [{ number: 1, type: 'text', question: '', options: [] }],
      });
      return next;
    });
  };
  const removeGroup = (si, gi) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question.splice(gi, 1);
      return next;
    });
  };
  const setGroupField = (si, gi, key, val) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question[gi][key] = val;
      return next;
    });
  };

  // Tasks
  const addTask = (si, gi) => {
    setForm((prev) => {
      const next = deepClone(prev);
      const tasks = next.sections[si].question[gi].questionsTask;
      const nextNumber = tasks.length ? Math.max(...tasks.map((t) => Number(t.number) || 0)) + 1 : 1;
      tasks.push({ number: nextNumber, type: 'text', question: '', options: [] });
      return next;
    });
  };
  const removeTask = (si, gi, ti) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question[gi].questionsTask.splice(ti, 1);
      return next;
    });
  };
  const setTaskField = (si, gi, ti, key, val) => {
    setForm((prev) => {
      const next = deepClone(prev);
      if (key === 'number') {
        next.sections[si].question[gi].questionsTask[ti][key] = val === '' ? '' : Number(val);
      } else if (key === 'type') {
        next.sections[si].question[gi].questionsTask[ti][key] = val;
        if (val === 'text') next.sections[si].question[gi].questionsTask[ti].options = [];
      } else {
        next.sections[si].question[gi].questionsTask[ti][key] = val;
      }
      return next;
    });
  };

  // Options
  const addOption = (si, gi, ti) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question[gi].questionsTask[ti].options.push('');
      return next;
    });
  };
  const removeOption = (si, gi, ti, oi) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question[gi].questionsTask[ti].options.splice(oi, 1);
      return next;
    });
  };
  const setOption = (si, gi, ti, oi, val) => {
    setForm((prev) => {
      const next = deepClone(prev);
      next.sections[si].question[gi].questionsTask[ti].options[oi] = val;
      return next;
    });
  };

  // Console output
  const outputToConsole = () => {
    const data = deepClone(form);
    console.clear();
    console.log('Object view:', data);
    console.log('As module text:\n' + 'export const data = ' + JSON.stringify(data, null, 2));
    alert('Konsolga chiqarildi! DevTools → Console ni tekshiring.');
  };

  return (
    <Page>
      <Title>IELTS Listening Data Builder 🎧</Title>
      <Sub>Bitta fayl ichida. Yakuniy natija → konsolga chiqariladi.</Sub>

      <Toolbar>
        <Button onClick={addSection}>Bo‘lim qo‘shish</Button>
        <Button onClick={outputToConsole}>Consolega chiqarish</Button>
      </Toolbar>

      <Card>
        <Row>
          <Label>monthId</Label>
          <Input
            type="number"
            placeholder="Masalan: 23"
            value={form.monthId}
            onChange={(e) => setMonthId(e.target.value)}
          />
        </Row>
      </Card>

      {form.sections.map((sec, si) => (
        <Card key={si}>
          <GroupTitle>Section #{si + 1}</GroupTitle>

          <Row>
            <Label>part</Label>
            <Input
              value={sec.part}
              placeholder="Masalan: Section 1"
              onChange={(e) => setSectionField(si, 'part', e.target.value)}
            />
          </Row>
          <Row>
            <Label>audio (yo‘l/URL)</Label>
            <Input
              value={sec.audio}
              placeholder="./part1.mp3 yoki https://..."
              onChange={(e) => setSectionField(si, 'audio', e.target.value)}
            />
          </Row>
          <Row>
            <Label>intro</Label>
            <Textarea
              value={sec.intro}
              placeholder="Kirish matni..."
              onChange={(e) => setSectionField(si, 'intro', e.target.value)}
            />
          </Row>
          <Row>
            <Label>textTitle</Label>
            <Input
              value={sec.textTitle}
              placeholder="Matn sarlavhasi"
              onChange={(e) => setSectionField(si, 'textTitle', e.target.value)}
            />
          </Row>
          <Row>
            <Label>text</Label>
            <Textarea
              value={sec.text}
              placeholder="Qo‘shimcha matn"
              onChange={(e) => setSectionField(si, 'text', e.target.value)}
            />
          </Row>

          <Toolbar>
            <Small onClick={() => addGroup(si)}>Savol guruhi qo‘shish</Small>
            <Small $variant="danger" onClick={() => removeSection(si)}>Bo‘limni o‘chirish</Small>
          </Toolbar>

          {sec.question.map((group, gi) => (
            <Card key={`${si}-${gi}`}>
              <GroupTitle>Group #{gi + 1}</GroupTitle>

              <Row>
                <Label>questionTitle</Label>
                <Input
                  value={group.questionTitle}
                  placeholder="Masalan: Questions 11-16"
                  onChange={(e) => setGroupField(si, gi, 'questionTitle', e.target.value)}
                />
              </Row>
              <Row>
                <Label>questionIntro</Label>
                <Textarea
                  value={group.questionIntro}
                  placeholder="Masalan: Choose the correct letter A, B or C"
                  onChange={(e) => setGroupField(si, gi, 'questionIntro', e.target.value)}
                />
              </Row>

              <Toolbar>
                <Small onClick={() => addTask(si, gi)}>Savol qo‘shish</Small>
                <Small $variant="danger" onClick={() => removeGroup(si, gi)}>Guruhni o‘chirish</Small>
              </Toolbar>

              {group.questionsTask.map((task, ti) => (
                <Card key={`${si}-${gi}-${ti}`}>
                  <GroupTitle>Task #{task.number ?? ti + 1}</GroupTitle>

                  <Row>
                    <Label>number</Label>
                    <Input
                      type="number"
                      value={task.number}
                      onChange={(e) => setTaskField(si, gi, ti, 'number', e.target.value)}
                    />
                  </Row>
                  <Row>
                    <Label>type</Label>
                    <Select
                      value={task.type}
                      onChange={(e) => setTaskField(si, gi, ti, 'type', e.target.value)}
                    >
                      <option value="text">text</option>
                      <option value="radio">radio</option>
                      <option value="select">select</option>
                    </Select>
                  </Row>
                  <Row>
                    <Label>question</Label>
                    <Textarea
                      value={task.question}
                      placeholder="Savol matni..."
                      onChange={(e) => setTaskField(si, gi, ti, 'question', e.target.value)}
                    />
                  </Row>

                  {(task.type === 'radio' || task.type === 'select') && (
                    <>
                      <Line />
                      <GroupTitle>Options</GroupTitle>
                      {task.options?.map((opt, oi) => (
                        <Row key={`${si}-${gi}-${ti}-opt-${oi}`}>
                          <Label>Option #{oi + 1}</Label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Input
                              value={opt}
                              placeholder="Variant matni (masalan: A ...)"
                              onChange={(e) => setOption(si, gi, ti, oi, e.target.value)}
                              style={{ flex: 1 }}
                            />
                            <Small $variant="danger" onClick={() => removeOption(si, gi, ti, oi)}>O‘chirish</Small>
                          </div>
                        </Row>
                      ))}
                      <Small onClick={() => addOption(si, gi, ti)}>Variant qo‘shish</Small>
                    </>
                  )}

                  <Toolbar>
                    <Small $variant="danger" onClick={() => removeTask(si, gi, ti)}>Savolni o‘chirish</Small>
                  </Toolbar>
                </Card>
              ))}
            </Card>
          ))}
        </Card>
      ))}

      <Card>
        <GroupTitle>JSON Preview</GroupTitle>
        <JsonPreview>{pretty}</JsonPreview>
      </Card>
    </Page>
  );
}