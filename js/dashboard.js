async function initDashboardPage() {
  const isDashboardPage = window.location.pathname.includes("dashboard.html");
  if (!isDashboardPage) return;

  await loadSubjects();
  await loadDashboardStats();
}

async function loadSubjects() {
  const subjectsList = document.getElementById("subjects-list");
  if (!subjectsList) return;

  subjectsList.innerHTML = "<p class='status-text'>Fächer werden geladen...</p>";

  const { data, error } = await supabaseClient
    .from("subjects")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Fächer:", error.message);
    subjectsList.innerHTML =
      "<p class='status-text'>Die Fächer konnten nicht geladen werden.</p>";
    return;
  }

  if (!data || data.length === 0) {
    subjectsList.innerHTML =
      "<p class='status-text'>Es sind noch keine Fächer vorhanden.</p>";
    return;
  }

  subjectsList.innerHTML = data
    .map(
      (subject) => `
        <div class="subject-card">
          <h3>${escapeHtml(subject.name)}</h3>
          <p>${escapeHtml(subject.description ?? "Keine Beschreibung vorhanden.")}</p>
          <button
            class="action-btn"
            onclick="startQuiz('${subject.id}', '${escapeForJs(subject.name)}')"
          >
            Quiz starten
          </button>
        </div>
      `
    )
    .join("");
}

async function loadDashboardStats() {
  const attemptsElement = document.getElementById("stat-attempts");
  const correctAnswersElement = document.getElementById("stat-correct-answers");
  const accuracyElement = document.getElementById("stat-accuracy");

  const {
    data: { user },
    error: userError
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    console.error("Nutzer konnte für Statistik nicht geladen werden.");
    setStatsFallback();
    return;
  }

  const { data: attemptsData, error: attemptsError } = await supabaseClient
    .from("quiz_attempts")
    .select("id, score, total_questions, completed_at")
    .eq("user_id", user.id)
    .not("completed_at", "is", null);

  const { data: answersData, error: answersError } = await supabaseClient
    .from("quiz_answers")
    .select("id, is_correct")
    .eq("user_id", user.id);

  if (attemptsError || answersError) {
    console.error("Fehler beim Laden der Statistik:", attemptsError?.message || answersError?.message);
    setStatsFallback();
    return;
  }

  const totalAttempts = attemptsData ? attemptsData.length : 0;
  const totalCorrectAnswers = answersData
    ? answersData.filter((answer) => answer.is_correct).length
    : 0;

  const totalAnsweredQuestions = answersData ? answersData.length : 0;
  const accuracy =
    totalAnsweredQuestions > 0
      ? Math.round((totalCorrectAnswers / totalAnsweredQuestions) * 100)
      : 0;

  if (attemptsElement) {
    attemptsElement.textContent = totalAttempts;
  }

  if (correctAnswersElement) {
    correctAnswersElement.textContent = totalCorrectAnswers;
  }

  if (accuracyElement) {
    accuracyElement.textContent = `${accuracy}%`;
  }
}

function setStatsFallback() {
  const attemptsElement = document.getElementById("stat-attempts");
  const correctAnswersElement = document.getElementById("stat-correct-answers");
  const accuracyElement = document.getElementById("stat-accuracy");

  if (attemptsElement) attemptsElement.textContent = "–";
  if (correctAnswersElement) correctAnswersElement.textContent = "–";
  if (accuracyElement) accuracyElement.textContent = "–";
}

function startQuiz(subjectId, subjectName) {
  localStorage.setItem("selectedSubjectId", subjectId);
  localStorage.setItem("selectedSubjectName", subjectName);
  window.location.href = "quiz.html";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeForJs(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");
}

initDashboardPage();
