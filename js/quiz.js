let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerLocked = false;

async function initQuizPage() {
  const isQuizPage = window.location.pathname.includes("quiz.html");
  if (!isQuizPage) return;

  const subjectId = localStorage.getItem("selectedSubjectId");
  const subjectName = localStorage.getItem("selectedSubjectName");

  const titleElement = document.getElementById("quiz-subject-title");
  const quizContent = document.getElementById("quiz-content");

  if (!subjectId || !subjectName) {
    if (titleElement) {
      titleElement.textContent = "Kein Fach ausgewählt";
    }

    if (quizContent) {
      quizContent.innerHTML = `
        <p class="status-text">Es wurde kein Fach ausgewählt.</p>
      `;
    }
    return;
  }

  if (titleElement) {
    titleElement.textContent = `Quiz: ${subjectName}`;
  }

  const { data, error } = await supabaseClient
    .from("questions")
    .select(`
      id,
      question_text,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      explanation
    `)
    .eq("subject_id", subjectId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Fragen:", error.message);
    quizContent.innerHTML = `
      <p class="status-text">Die Fragen konnten nicht geladen werden.</p>
    `;
    return;
  }

  if (!data || data.length === 0) {
    quizContent.innerHTML = `
      <p class="status-text">Für dieses Fach sind noch keine Fragen vorhanden.</p>
    `;
    return;
  }

  quizQuestions = data;
  currentQuestionIndex = 0;
  score = 0;
  answerLocked = false;

  renderQuestion();
}

function renderQuestion() {
  const quizContent = document.getElementById("quiz-content");
  const question = quizQuestions[currentQuestionIndex];

  if (!quizContent || !question) return;

  answerLocked = false;

  quizContent.innerHTML = `
    <div class="quiz-progress">
      Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}
    </div>

    <div class="question-text">
      ${escapeHtml(question.question_text)}
    </div>

    <div class="answers-list">
      <button class="answer-btn" onclick="handleAnswer('a')">
        A. ${escapeHtml(question.answer_a)}
      </button>
      <button class="answer-btn" onclick="handleAnswer('b')">
        B. ${escapeHtml(question.answer_b)}
      </button>
      <button class="answer-btn" onclick="handleAnswer('c')">
        C. ${escapeHtml(question.answer_c)}
      </button>
      <button class="answer-btn" onclick="handleAnswer('d')">
        D. ${escapeHtml(question.answer_d)}
      </button>
    </div>

    <div id="quiz-feedback" class="quiz-feedback" style="display: none;"></div>

    <div class="quiz-actions">
      <button id="next-button" class="next-btn" onclick="goToNextQuestion()">
        Nächste Frage
      </button>
    </div>
  `;
}

function handleAnswer(selectedAnswer) {
  if (answerLocked) return;

  answerLocked = true;

  const question = quizQuestions[currentQuestionIndex];
  const feedbackBox = document.getElementById("quiz-feedback");
  const nextButton = document.getElementById("next-button");
  const answerButtons = document.querySelectorAll(".answer-btn");

  const isCorrect = selectedAnswer === question.correct_answer;

  if (isCorrect) {
    score += 1;
  }

  answerButtons.forEach((button) => {
    const buttonText = button.textContent.trim().toLowerCase();
    const answerLetter = buttonText.charAt(0).toLowerCase();

    button.disabled = true;

    if (answerLetter === question.correct_answer) {
      button.classList.add("correct");
    }

    if (answerLetter === selectedAnswer && selectedAnswer !== question.correct_answer) {
      button.classList.add("wrong");
    }
  });

  if (feedbackBox) {
    feedbackBox.style.display = "block";
    feedbackBox.innerHTML = `
      <strong>${isCorrect ? "Richtig!" : "Nicht ganz richtig."}</strong><br>
      ${escapeHtml(question.explanation ?? "Keine Erklärung vorhanden.")}
    `;
  }

  if (nextButton) {
    nextButton.style.display = "inline-block";
    if (currentQuestionIndex === quizQuestions.length - 1) {
      nextButton.textContent = "Ergebnis ansehen";
    }
  }
}

function goToNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
    return;
  }

  renderFinalResult();
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
      <button class="back-btn" onclick="restartQuiz()">Quiz neu starten</button>
    </div>
  `;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answerLocked = false;
  renderQuestion();
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
