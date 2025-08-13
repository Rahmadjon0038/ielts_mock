'use eclint'
export function checkListeningAnswers(submissionData) {
  let correctCount = 0;
  let wrongCount = 0;
  const details = [];

  submissionData.answers.forEach((q) => {
    let userAns = '';
    let correctAns = '';

    // Radio va select uchun harfni ajratib oling!
    if (q.type === 'radio' || q.type === 'select') {
      // User javobi: ["A university specialists"] yoki ["C"]
      userAns = (q.userAnswers[0] || '').toString().trim();
      // Faqat birinchi harfni oling (masalan, "A university specialists" => "A")
      const userLetter = userAns.charAt(0).toUpperCase();

      // Admin javobi: "A", "B", ...
      correctAns = (q.correctAnswer || '').toString().trim().toUpperCase();

      if (userLetter === correctAns) {
        correctCount++;
        details.push(`✅ ${q.questionNumber}-savol: To'g'ri`);
      } else {
        wrongCount++;
        details.push(`❌ ${q.questionNumber}-savol: Noto‘g‘ri (User: ${userLetter} | To‘g‘ri: ${correctAns})`);
      }
    } else {
      // text turidagi savollar uchun
      userAns = Array.isArray(q.userAnswers)
        ? q.userAnswers.map(a => a.toString().toLowerCase().trim()).join(',')
        : (q.userAnswers || '').toString().toLowerCase().trim();

      correctAns = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(a => a.toString().toLowerCase().trim()).join(',')
        : (q.correctAnswer || '').toString().toLowerCase().trim();

      if (userAns === correctAns) {
        correctCount++;
        details.push(`✅ ${q.questionNumber}-savol: To'g'ri`);
      } else {
        wrongCount++;
        details.push(`❌ ${q.questionNumber}-savol: Noto‘g‘ri (User: ${userAns} | To‘g‘ri: ${correctAns})`);
      }
    }
  });

  return {
    correctCount,
    wrongCount,
    details
  };
}