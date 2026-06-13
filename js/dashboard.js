const selectedTopicsBySubject = {};

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

  const { data: subjects, error: subjectsError } = await supabaseClient
    .from("subjects")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (subjectsError) {
    console.error("Fehler beim Laden der Fächer:", subjectsError.message);
    subjectsList.innerHTML =
      "<p class='status-text'>Die Fächer konnten nicht geladen werden.</p>";
    return;
  }

  if (!subjects || subjects.length === 0) {
    subjectsList.innerHTML =
      "<p class='status-text'>Es sind noch keine Fächer vorhanden.</p>";
    return;
  }

  const { data: topics, error: topicsError } = await supabaseClient
    .from("topics")
    .select("id, subject_id, name, description")
    .order("name", { ascending: true });

  if (topicsError) {
    console.error("Fehler beim Laden der Themenbereiche:", topicsError.message);
    subjectsList.innerHTML =
      "<p class='status-text'>Die Themenbereiche konnten nicht geladen werden.</p>";
    return;
  }

  subjectsList.innerHTML = subjects
    .map((subject) => {
      const subjectTopics = (topics || []).filter(
        (topic) => topic.subject_id === subject.id
      );

      const topicsHtml =
        subjectTopics.length > 0
          ? `
            <div class="topic-grid">
              ${subjectTopics
                .map(
                  (topic) => `
                    <button
                      type="button"
                      class="topic-chip"
                      data-subject-id="${subject.id}"
                      data-topic-id="${topic.id}"
                      data-topic-name="${escapeHtml(topic.name)}"
                      onclick="selectTopic('${subject.id}', '${topic.id}', '${escapeForJs(topic.name)}')"
                    >
                      ${escapeHtml(topic.name)}
                    </button>
                  `
                )
                .join("")}
            </div>
          `
          : `<p class="topic-empty">Keine Themen verfügbar</p>`;

      return `
        <div class="subject-card">
          <h3>${escapeHtml(subject.name)}</h3>
          <p>${escapeHtml(subject.description ?? "Keine Beschreibung vorhanden.")}</p>

          <label class="topic-label">Themenbereich</label>

          ${topicsHtml}

          <button
            id="start-btn-${subject.id}"
            class="action-btn"
            onclick="startQuizWithTopic('${subject.id}', '${escapeForJs(subject.name)}')"
            ${subjectTopics.length === 0 ? "disabled" : ""}
          >
            Quiz starten
          </button>
        </div>
      `;
    })
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

function selectTopic(subjectId, topicId, topicName) {
  selectedTopicsBySubject[subjectId] = {
    id: topicId,
    name: topicName
  };

  const allTopicButtons = document.querySelectorAll(
    `.topic-chip[data-subject-id="${subjectId}"]`
  );

  allTopicButtons.forEach((button) => {
    button.classList.remove("active");

    if (button.dataset.topicId === topicId) {
      button.classList.add("active");
    }
  });
}

function setStatsFallback() {
  const attemptsElement = document.getElementById("stat-attempts");
  const correctAnswersElement = document.getElementById("stat-correct-answers");
  const accuracyElement = document.getElementById("stat-accuracy");

  if (attemptsElement) attemptsElement.textContent = "–";
  if (correctAnswersElement) correctAnswersElement.textContent = "–";
  if (accuracyElement) accuracyElement.textContent = "–";
}

function startQuizWithTopic(subjectId, subjectName) {
  const selectedTopic = selectedTopicsBySubject[subjectId];

  if (!selectedTopic) {
    alert("Bitte wähle zuerst einen Themenbereich aus.");
    return;
  }

  localStorage.setItem("selectedSubjectId", subjectId);
  localStorage.setItem("selectedSubjectName", subjectName);
  localStorage.setItem("selectedTopicId", selectedTopic.id);
  localStorage.setItem("selectedTopicName", selectedTopic.name);

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
