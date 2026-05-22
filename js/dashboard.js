async function loadSubjects() {
  const isDashboardPage = window.location.pathname.includes("dashboard.html");
  if (!isDashboardPage) return;

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

function startQuiz(subjectId, subjectName) {
  localStorage.setItem("selectedSubjectId", subjectId);
  localStorage.setItem("selectedSubjectName", subjectName);

  alert(`Quiz für ${subjectName} wird im nächsten Schritt eingebaut.`);
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

loadSubjects();
