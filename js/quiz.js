let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerLocked = false;
let currentAttemptId = null;
let currentUserId = null;
let currentSubjectId = null;
let currentTopicId = null;
let currentTopicName = null;
let questionStates = [];

async function initQuizPage() {
  const isQuizPage = window.location.pathname.includes("quiz.html");
  if (!isQuizPage) return;

  const subjectId = localStorage.getItem("selectedSubjectId");
  const subjectName = localStorage.getItem("selectedSubjectName");
  const topicId = localStorage.getItem("selectedTopicId");
  const topicName = localStorage.getItem("selectedTopicName");

  currentSubjectId = subjectId;
  currentTopicId = topicId;
  currentTopicName = topicName;

  const titleElement = document.getElementById("quiz-subject-title");
  const quizTopicName = document.getElementById("quiz-topic-name");
  const quizContent = document.getElementById("quiz-content");

  if (!subjectId || !subjectName || !topicId || !topicName) {
    if (titleElement) {
      titleElement.textContent = "Kein Fach oder Themenbereich ausgewählt";
    }

    if (quizContent) {
      quizContent.innerHTML = `
        <p class="status-text">Es wurde kein Fach oder Themenbereich ausgewählt.</p>
      `;
    }
    return;
  }

  if (titleElement) {
    titleElement.textContent = `Quiz: ${subjectName}`;
  }

  if (quizTopicName) {
    quizTopicName.textContent = `Themenbereich: ${topicName}`;
  }

  const {
    data: { user },
    error: userError
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    console.error("Kein eingeloggter Nutzer gefunden.");
    if (quizContent) {
      quizContent.innerHTML = `
        <p class="status-text">Du musst angemeldet sein, um ein Quiz zu starten.</p>
      `;
    }
    return;
  }

  currentUserId = user.id;

  const attemptCreated = await createQuizAttempt();

  if (!attemptCreated) {
    if (quizContent) {
      quizContent.innerHTML = `
        <p class="status-text">Der Quizversuch konnte nicht gestartet werden.</p>
      `;
    }
    return;
  }

  const { data, error } = await supabaseClient
    .from("questions")
    .select(`
      id,
      subject_id,
      topic_id,
      question_text,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      explanation
    `)
    .eq("subject_id", subjectId)
    .eq("topic_id", topicId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Fragen:", error.message);
    if (quizContent) {
      quizContent.innerHTML = `
        <p class="status-text">Die Fragen konnten nicht geladen werden.</p>
      `;
    }
    return;
  }

  if (!data || data.length === 0) {
    if (quizContent) {
      quizContent.innerHTML = `
        <p class="status-text">Für diesen Themenbereich sind noch keine Fragen vorhanden.</p>
      `;
    }
    return;
  }

  quizQuestions = data;
  currentQuestionIndex = 0;
  score = 0;
  answerLocked = false;
  questionStates = quizQuestions.map(() => ({
    answered: false,
    isCorrect: null,
    selectedAnswer: null
  }));

  renderQuestion();
}

async function createQuizAttempt() {
  const insertPayload = {
    user_id: currentUserId,
    subject_id: currentSubjectId
  };

  if (currentTopicId) {
    insertPayload.topic_id = currentTopicId;
  }

  const { data, error } = await supabaseClient
    .from("quiz_attempts")
    .insert([insertPayload])
    .select("id")
    .single();

  if (error || !data) {
    console.error("Fehler beim Erstellen des Quizversuchs:", error?.message);
    return false;
  }

  currentAttemptId = data.id;
  return true;
}

function renderQuestionNavigation() {
  return `
    <div class="question-nav">
      ${quizQuestions.map((_, index) => {
        const state = questionStates[index];
        const isActive = index === currentQuestionIndex;
        const isCorrect = state.isCorrect === true;
        const isWrong = state.isCorrect === false;

        let marker = "";
        if (isCorrect) {
          marker = `<span class="question-nav-marker">✓</span>`;
        } else if (isWrong) {
          marker = `<span class="question-nav-marker">✕</span>`;
        }

        return `
          <button
            class="question-nav-item ${isActive ? "active" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}"
            onclick="goToQuestion(${index})"
            type="button"
          >
            <span>${index + 1}</span>
            ${marker}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderQuestion() {
  const quizContent = document.getElementById("quiz-content");
  const question = quizQuestions[currentQuestionIndex];
  const questionState = questionStates[currentQuestionIndex];

  if (!quizContent || !question) return;

  answerLocked = questionState.answered;

  quizContent.innerHTML = `
    ${renderQuestionNavigation()}

    <div class="quiz-progress">
      Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}
    </div>

    <div class="question-text">
      ${escapeHtml(question.question_text)}
    </div>

    <div class="answers-list">
      ${renderAnswerButton("a", question.answer_a, question, questionState)}
      ${renderAnswerButton("b", question.answer_b, question, questionState)}
      ${renderAnswerButton("c", question.answer_c, question, questionState)}
      ${renderAnswerButton("d", question.answer_d, question, questionState)}
    </div>

    <div id="quiz-feedback" class="quiz-feedback ${questionState.answered ? "" : "empty"}">
      ${
        questionState.answered
          ? `
            <div>
              <strong>${questionState.isCorrect ? "Richtig!" : "Nicht ganz richtig."}</strong><br>
              ${escapeHtml(question.explanation ?? "Keine Erklärung vorhanden.")}
            </div>
          `
          : `<span>Feedback erscheint hier nach deiner Auswahl.</span>`
      }
    </div>

    <div class="quiz-actions">
      ${renderQuizActionButton()}
    </div>
  `;
}

function renderAnswerButton(letter, answerText, question, questionState) {
  let buttonClass = "answer-btn";
  let disabled = "";

  if (questionState.answered) {
    disabled = "disabled";

    if (letter === question.correct_answer) {
      buttonClass += " correct";
    }

    if (letter === questionState.selectedAnswer && questionState.selectedAnswer !== question.correct_answer) {
      buttonClass += " wrong";
    }
  }

  return `
    <button class="${buttonClass}" onclick="handleAnswer('${letter}')" ${disabled}>
      ${letter.toUpperCase()}. ${escapeHtml(answerText)}
    </button>
  `;
}

function renderQuizActionButton() {
  const allQuestionsAnswered = questionStates.every((state) => state.answered);

  if (allQuestionsAnswered) {
    return `
      <button class="next-btn" onclick="finishQuizAndShowResults()">
        Ergebnis ansehen
      </button>
    `;
  }

  return `
    <button class="next-btn" onclick="goToNextOpenQuestion()">
      Nächste offene Frage
    </button>
  `;
}

async function handleAnswer(selectedAnswer) {
  if (answerLocked) return;

  answerLocked = true;

  const question = quizQuestions[currentQuestionIndex];
  const questionState = questionStates[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correct_answer;

  const answerSaved = await saveQuizAnswer(question, selectedAnswer, isCorrect);

  if (!answerSaved) {
    answerLocked = false;
    alert("Die Antwort konnte nicht gespeichert werden. Bitte versuche es erneut.");
    return;
  }

  questionState.answered = true;
  questionState.isCorrect = isCorrect;
  questionState.selectedAnswer = selectedAnswer;

  score = questionStates.filter((state) => state.isCorrect === true).length;

  renderQuestion();
}

async function saveQuizAnswer(question, selectedAnswer, isCorrect) {
  const { error } = await supabaseClient
    .from("quiz_answers")
    .insert([
      {
        attempt_id: currentAttemptId,
        question_id: question.id,
        user_id: currentUserId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect
      }
    ]);

  if (error) {
    console.error("Fehler beim Speichern der Antwort:", error.message);
    return false;
  }

  return true;
}

function goToQuestion(index) {
  if (index < 0 || index >= quizQuestions.length) return;

  currentQuestionIndex = index;
  renderQuestion();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function goToNextOpenQuestion() {
  const nextOpenIndex = questionStates.findIndex(
    (state, index) => index > currentQuestionIndex && !state.answered
  );

  if (nextOpenIndex !== -1) {
    goToQuestion(nextOpenIndex);
    return;
  }

  const firstOpenIndex = questionStates.findIndex((state) => !state.answered);

  if (firstOpenIndex !== -1) {
    goToQuestion(firstOpenIndex);
  }
}

async function finishQuizAndShowResults() {
  const allQuestionsAnswered = questionStates.every((state) => state.answered);

  if (!allQuestionsAnswered) {
    alert("Bitte beantworte zuerst alle Fragen.");
    return;
  }

  await finishQuizAttempt();
  renderFinalResult();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function finishQuizAttempt() {
  if (!currentAttemptId) {
    console.error("Keine Attempt-ID vorhanden.");
    return false;
  }

  const { error } = await supabaseClient
    .from("quiz_attempts")
    .update({
      completed_at: new Date().toISOString(),
      score: score,
      total_questions: quizQuestions.length
    })
    .eq("id", currentAttemptId)
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Fehler beim Abschließen des Quizversuchs:", error.message);
    return false;
  }

  return true;
}

function renderFinalResult() {
  const quizContent = document.getElementById("quiz-content");
  if (!quizContent) return;

  const percentage = Math.round((score / quizQuestions.length) * 100);

  quizContent.innerHTML = `
    <div class="result-box">
      <h2>Quiz abgeschlossen</h2>
      <p>Du hast <strong>${score}</strong> von <strong>${quizQuestions.length}</strong> Fragen richtig beantwortet.</p>
      <p>Dein Ergebnis: <strong>${percentage}%</strong></p>

      <div class="result-actions">
        <button class="restart-btn" onclick="restartQuiz()">Quiz neu starten</button>
        <button class="back-btn" onclick="goBackToDashboard()">Zum Dashboard</button>
      </div>
    </div>
  `;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answerLocked = false;
  currentAttemptId = null;
  questionStates = [];
  initQuizPage();
}

function goBackToDashboard() {
  window.location.href = "dashboard.html";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

initQuizPage();
