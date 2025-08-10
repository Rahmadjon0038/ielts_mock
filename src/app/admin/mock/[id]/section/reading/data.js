
// "use client"
// import React, { useState } from 'react'
// import styled from 'styled-components'

// // Styled components (o'zgarmagan)
// const FormContainer = styled.div`
//   padding: 20px;
//   max-width: 800px;
//   font-family: sans-serif;
// `

// const SectionCard = styled.div`
//   border: 1px solid #ddd;
//   padding: 15px;
//   margin: 10px 0;
//   border-radius: 8px;
//   background-color: #f9f9f9;
// `

// const FormRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;
//   margin-bottom: 15px;
// `

// const FormLabel = styled.label`
//   min-width: 150px;
//   font-weight: 500;
//   color: #333;
// `

// const InputField = styled.input`
//   flex: 1;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// `

// const TextArea = styled.textarea`
//   flex: 1;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   min-height: 100px;
// `

// const SelectField = styled.select`
//   flex: 1;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// `

// const OptionList = styled.div`
//   border: 1px solid #eee;
//   background-color: #fff;
//   padding: 10px;
//   margin-top: 5px;
//   border-radius: 4px;
// `

// const OptionItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 5px;
// `

// const Button = styled.button`
//   padding: 8px 12px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   background-color: #007bff;
//   color: white;
//   margin-right: 10px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `

// const DangerButton = styled(Button)`
//   background-color: #dc3545;
//   &:hover {
//     background-color: #c82333;
//   }
// `

// // Main component
// function QuizBuilder() {
//   const [formData, setFormData] = useState({
//     monthId: 22,
//     sections: []
//   })

//   // Mavjud barcha savollar orasidan eng yuqori raqamni topish
//   const getNextQuestionNumber = (sections) => {
//     let maxNumber = 0
//     sections.forEach(section => {
//       section.question.forEach(group => {
//         group.questionsTask.forEach(task => {
//           if (task.number) {
//             maxNumber = Math.max(maxNumber, task.number)
//           } else if (task.numbers && task.numbers.length > 0) {
//             // task.numbers array bo'lganligi uchun uni yoyib yuboramiz
//             maxNumber = Math.max(maxNumber, ...task.numbers)
//           } else if (task.table && task.table[0] && task.table[0].rows.length > 0) {
//             const tableNumbers = task.table[0].rows.map(row => row.number).filter(n => n !== null)
//             if (tableNumbers.length > 0) { // Faqat agar raqamlar mavjud bo'lsa
//               maxNumber = Math.max(maxNumber, ...tableNumbers)
//             }
//           }
//         })
//       })
//     })
//     return maxNumber + 1
//   }

//   // Bo'lim qo'shish
//   const addSection = () => {
//     const newSection = {
//       part: `part${formData.sections.length + 1}`,
//       intro: '',
//       textTitle: '',
//       text: '',
//       question: []
//     }
//     setFormData(prev => ({
//       ...prev,
//       sections: [...prev.sections, newSection]
//     }))
//   }

//   // Savollar guruhini qo'shish
//   const addQuestionGroup = (sectionIndex) => {
//     const newGroup = {
//       questionTitle: '',
//       questionIntro: '',
//       questionsTask: []
//     }
//     const newSections = [...formData.sections]
//     newSections[sectionIndex].question.push(newGroup)
//     setFormData({ ...formData, sections: newSections })
//   }

//   // Yangi savol turi bo'yicha savol qo'shish
//   const addQuestion = (sectionIndex, groupIndex, type) => {
//     const nextNumber = getNextQuestionNumber(formData.sections)
//     let newQuestion = { type, question: '' }

//     if (type === 'radio' || type === 'select' || type === 'checkbox') {
//       newQuestion = { ...newQuestion, number: nextNumber, options: [] }
//       if (type === 'checkbox') {
//         newQuestion.maxSelect = 1
//       }
//     } else if (type === 'text-multi') {
//       newQuestion = { ...newQuestion, numbers: [nextNumber] } // Boshlang'ich raqam bilan
//     } else if (type === 'table') {
//       newQuestion = {
//         ...newQuestion,
//         numbers: [nextNumber], // Boshlang'ich raqam bilan
//         table: [{ label: '', rows: [{ question: '', number: nextNumber }] }]
//       }
//     }

//     const newSections = [...formData.sections]
//     newSections[sectionIndex].question[groupIndex].questionsTask.push(newQuestion)
//     setFormData({ ...formData, sections: newSections })
//   }

//   // JSON ni ko'rish uchun
//   const previewJSON = () => {
//     console.log('Forma ma`lumotlari:', JSON.stringify(formData, null, 2))
//     alert("JSON konsolda ko'rsatildi. Brauzerning 'Inspector' -> 'Console' qismidan tekshiring.")
//   }

//   // Umumiy state ni yangilash funksiyasi
//   const updateState = (secIndex, groupIndex, taskIndex, path, value) => {
//     const newFormData = { ...formData }
//     let current = newFormData

//     const keys = path.split('.')
//     const finalKey = keys.pop()

//     // To'g'ri task obyektiga yetib borish
//     current = newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex]

//     // Agar yo'lda 'table' bo'lsa, jadval ichidagi obyektga borish
//     if (keys.length > 0 && keys[0] === 'table') {
//       current = current.table[0]; // Jadval odatda massiv ichidagi birinchi element
//       if (keys.length > 1) { // Agar satr indeksiga ham kirish kerak bo'lsa
//         const rowIndex = parseInt(keys[1], 10);
//         current = current.rows[rowIndex];
//       }
//     }

//     if (finalKey === 'number' || finalKey === 'maxSelect') {
//       // Raqam maydonlari uchun: bo'sh qator bo'lsa null, aks holda int ga o'tkazish
//       current[finalKey] = value === '' ? null : parseInt(value, 10)
//     } else if (finalKey === 'numbers') {
//       // Bu yerda o'zgarish: vergul, bo'sh joy yoki vergulsiz kiritilgan raqamlarni to'g'ri massivga aylantirish
//       current[finalKey] = value
//         .toString() // Qatorga aylantiramiz
//         .split(/[\s,]+/) // Bo'sh joy yoki vergul bo'yicha ajratamiz (bir yoki bir nechta)
//         .filter(Boolean) // Bo'sh qatorlarni olib tashlaymiz (masalan, "1,,2" dan bo'shlikni)
//         .map(numStr => parseInt(numStr.trim())) // Har birini songa o'girib, bo'sh joylarni olib tashlaymiz
//         .filter(num => !isNaN(num)); // Noto'g'ri raqamlarni (NaN) o'chiramiz
//     } else {
//       // Boshqa maydonlar uchun to'g'ridan-to'g'ri string qiymatni belgilash
//       current[finalKey] = value
//     }

//     setFormData(newFormData)
//   }

//   const handleRemoveTask = (secIndex, groupIndex, taskIndex) => {
//     const newFormData = { ...formData }
//     newFormData.sections[secIndex].question[groupIndex].questionsTask.splice(taskIndex, 1)
//     setFormData(newFormData)
//   }

//   const handleRemoveOption = (secIndex, groupIndex, taskIndex, optIndex) => {
//     const newFormData = { ...formData }
//     newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].options.splice(optIndex, 1)
//     setFormData(newFormData)
//   }

//   const handleAddOption = (secIndex, groupIndex, taskIndex) => {
//     const newFormData = { ...formData }
//     newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].options.push('')
//     setFormData(newFormData)
//   }

//   const handleRemoveTableRow = (secIndex, groupIndex, taskIndex, rowIndex) => {
//     const newFormData = { ...formData }
//     newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].table[0].rows.splice(rowIndex, 1)

//     // Satr o'chirilganda numbers massividan ham mos raqamni olib tashlash
//     const removedNumber = newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].table[0].rows[rowIndex]?.number;
//     if (removedNumber) {
//       newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].numbers =
//         newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].numbers.filter(n => n !== removedNumber);
//     }

//     setFormData(newFormData)
//   }

//   const handleAddTableRow = (secIndex, groupIndex, taskIndex) => {
//     const nextNumber = getNextQuestionNumber(formData.sections)
//     const newFormData = { ...formData }
//     newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].table[0].rows.push({
//       question: '',
//       number: nextNumber
//     })
//     // Table ning numbers massivini ham yangilaymiz
//     newFormData.sections[secIndex].question[groupIndex].questionsTask[taskIndex].numbers.push(nextNumber)
//     setFormData(newFormData)
//   }

//   return (
//     <div style={{ minHeight: '100vh' }}>
//       <FormContainer>
//         <h1>Quiz Yaratish Formasi</h1>

//         <Button onClick={addSection}>Yangi Bo'lim Qo'shish</Button>
//         {formData.sections.map((section, secIndex) => (
//           <SectionCard key={secIndex}>
//             <h3>Bo'lim: {section.part}</h3>
//             <FormRow>
//               <FormLabel>Bo'lim sarlavhasi:</FormLabel>
//               <InputField
//                 value={section.textTitle}
//                 onChange={(e) => {
//                   const newSections = [...formData.sections]
//                   newSections[secIndex].textTitle = e.target.value
//                   setFormData({ ...formData, sections: newSections })
//                 }}
//               />
//             </FormRow>
//             <FormRow>
//               <FormLabel>Bo'lim haqida:</FormLabel>
//               <TextArea
//                 value={section.intro}
//                 onChange={(e) => {
//                   const newSections = [...formData.sections]
//                   newSections[secIndex].intro = e.target.value
//                   setFormData({ ...formData, sections: newSections })
//                 }}
//               />
//             </FormRow>
//             <FormRow>
//               <FormLabel>Matn:</FormLabel>
//               <TextArea
//                 value={section.text}
//                 onChange={(e) => {
//                   const newSections = [...formData.sections]
//                   newSections[secIndex].text = e.target.value
//                   setFormData({ ...formData, sections: newSections })
//                 }}
//               />
//             </FormRow>

//             <Button onClick={() => addQuestionGroup(secIndex)}>Yangi Savollar Guruhiga Qo'shish</Button>
//             {section.question.map((group, groupIndex) => (
//               <div key={groupIndex} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '4px', background: '#eef' }}>
//                 <h4>Savollar guruhiga sarlavhasi:</h4>
//                 <FormRow>
//                   <FormLabel>Guruh sarlavhasi:</FormLabel>
//                   <InputField
//                     value={group.questionTitle}
//                     onChange={(e) => {
//                       const newSections = [...formData.sections]
//                       newSections[secIndex].question[groupIndex].questionTitle = e.target.value
//                       setFormData({ ...formData, sections: newSections })
//                     }}
//                   />
//                 </FormRow>
//                 <FormRow>
//                   <FormLabel>Guruh haqida:</FormLabel>
//                   <TextArea
//                     value={group.questionIntro}
//                     onChange={(e) => {
//                       const newSections = [...formData.sections]
//                       newSections[secIndex].question[groupIndex].questionIntro = e.target.value
//                       setFormData({ ...formData, sections: newSections })
//                     }}
//                   />
//                 </FormRow>

//                 <div style={{ margin: '10px 0' }}>
//                   <Button onClick={() => addQuestion(secIndex, groupIndex, 'radio')}>Radio savoli</Button>
//                   <Button onClick={() => addQuestion(secIndex, groupIndex, 'text-multi')}>Matn savoli</Button>
//                   <Button onClick={() => addQuestion(secIndex, groupIndex, 'select')}>Select savoli</Button>
//                   <Button onClick={() => addQuestion(secIndex, groupIndex, 'checkbox')}>Chekbox savoli</Button>
//                   <Button onClick={() => addQuestion(secIndex, groupIndex, 'table')}>Jadval savoli</Button>
//                 </div>

//                 {group.questionsTask.map((task, taskIndex) => (
//                   <div key={taskIndex} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', background: '#fff', borderRadius: '4px' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <h5>Savol {taskIndex + 1} - turi: {task.type}</h5>
//                       <DangerButton onClick={() => handleRemoveTask(secIndex, groupIndex, taskIndex)}>
//                         Savolni o'chirish
//                       </DangerButton>
//                     </div>

//                     {/* Number field for radio, select, checkbox */}
//                     {(task.type === 'radio' || task.type === 'select' || task.type === 'checkbox') && (
//                       <FormRow>
//                         <FormLabel>Savol Raqami:</FormLabel>
//                         <InputField
//                           type="number"
//                           value={task.number || ''}
//                           onChange={(e) => updateState(secIndex, groupIndex, taskIndex, 'number', e.target.value)}
//                         />
//                       </FormRow>
//                     )}

//                     {/* maxSelect field for checkbox */}
//                     {task.type === 'checkbox' && (
//                       <FormRow>
//                         <FormLabel>Maksimal tanlov:</FormLabel>
//                         <InputField
//                           type="number"
//                           value={task.maxSelect || ''}
//                           onChange={(e) => updateState(secIndex, groupIndex, taskIndex, 'maxSelect', e.target.value)}
//                         />
//                       </FormRow>
//                     )}

//                     {/* Question text input - universal */}
//                     <FormRow>
//                       <FormLabel>Savol matni:</FormLabel>
//                       <InputField
//                         value={task.question}
//                         onChange={(e) => updateState(secIndex, groupIndex, taskIndex, 'question', e.target.value)}
//                       />
//                     </FormRow>

//                     {/* Options for radio, select, checkbox */}
//                     {task.type === 'radio' || task.type === 'select' || task.type === 'checkbox' ? (
//                       <OptionList>
//                         <h6>Variantlar:</h6>
//                         {task.options.map((option, optIndex) => (
//                           <OptionItem key={optIndex}>
//                             <InputField
//                               value={option}
//                               onChange={(e) => {
//                                 const newSections = [...formData.sections]
//                                 newSections[secIndex].question[groupIndex].questionsTask[taskIndex].options[optIndex] = e.target.value
//                                 setFormData({ ...formData, sections: newSections })
//                               }}
//                             />
//                             <DangerButton
//                               onClick={() => handleRemoveOption(secIndex, groupIndex, taskIndex, optIndex)}
//                             >
//                               O'chirish
//                             </DangerButton>
//                           </OptionItem>
//                         ))}
//                         <Button onClick={() => handleAddOption(secIndex, groupIndex, taskIndex)}>
//                           Yangi variant qo'shish
//                         </Button>
//                       </OptionList>
//                     ) : null}

//                     {/* Numbers input for text-multi and table */}
//                     {(task.type === 'text-multi' || task.type === 'table') ? (
//                       <FormRow>
//                         <FormLabel>Raqamlar (masalan: 6,7,8,9 yoki 6 7 8 9):</FormLabel>
//                         <InputField
//                           // Massivni vergullar bilan ajratilgan stringga aylantirib ko'rsatamiz
//                           value={task.numbers ? task.numbers.join(', ') : ''}
//                           onChange={(e) => updateState(secIndex, groupIndex, taskIndex, 'numbers', e.target.value)}
//                         />
//                       </FormRow>
//                     ) : null}

//                     {/* Table rendering logic */}
//                     {task.type === 'table' && task.table && task.table[0] ? (
//                       <div>
//                         <h6>Jadval ustuni sarlavhasi (Label):</h6>
//                         <FormRow>
//                           <InputField
//                             value={task.table[0].label}
//                             onChange={(e) => updateState(secIndex, groupIndex, taskIndex, 'table.label', e.target.value)}
//                           />
//                         </FormRow>
//                         <h6>Jadval satrlari:</h6>
//                         {task.table[0].rows.map((row, rowIndex) => (
//                           <FormRow key={rowIndex}>
//                             <FormLabel>Savol:</FormLabel>
//                             <InputField
//                               value={row.question}
//                               onChange={(e) => updateState(secIndex, groupIndex, taskIndex, `table.${rowIndex}.question`, e.target.value)}
//                             />
//                             <FormLabel> Raqam:</FormLabel>
//                             <InputField
//                               type="number"
//                               value={row.number || ''}
//                               onChange={(e) => updateState(secIndex, groupIndex, taskIndex, `table.${rowIndex}.number`, e.target.value)}
//                             />
//                             <DangerButton onClick={() => handleRemoveTableRow(secIndex, groupIndex, taskIndex, rowIndex)}>
//                               Satrni o'chirish
//                             </DangerButton>
//                           </FormRow>
//                         ))}
//                         <Button onClick={() => handleAddTableRow(secIndex, groupIndex, taskIndex)}>
//                           Yangi satr qo'shish
//                         </Button>
//                       </div>
//                     ) : null}

//                   </div>
//                 ))}
//               </div>
//             ))}
//           </SectionCard>
//         ))}
//         <Button onClick={previewJSON}>JSON ko'rish</Button>
//       </FormContainer>
//     </div>
//   )
// }

// export default QuizBuilder
