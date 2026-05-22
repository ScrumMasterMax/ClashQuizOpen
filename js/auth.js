console.log("Supabase Client:", supabaseClient);

const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const className = document.getElementById("class_name").value.trim();
    const email = document.getElementById("register_email").value.trim();
    const password = document.getElementById("register_password").value;

    registerMessage.textContent = "Registrierung läuft...";

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          class_name: className
        }
      }
    });

    if (error) {
      registerMessage.textContent = "Fehler bei der Registrierung: " + error.message;
      return;
    }

    registerMessage.textContent = "Registrierung erfolgreich! Du kannst dich jetzt anmelden.";
    registerForm.reset();
  });
}

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value;

    loginMessage.textContent = "Anmeldung läuft...";

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      loginMessage.textContent = "Fehler bei der Anmeldung: " + error.message;
      return;
    }

    loginMessage.textContent = "Anmeldung erfolgreich! Weiterleitung...";
    loginForm.reset();

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  });
}

async function protectDashboard() {
  const isDashboardPage = window.location.pathname.includes("dashboard.html");

  if (!isDashboardPage) return null;

  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
    return null;
  }

  return data.user;
}

async function loadProfileData() {
  const isDashboardPage = window.location.pathname.includes("dashboard.html");

  if (!isDashboardPage) return;

  const user = await protectDashboard();
  if (!user) return;

  const welcomeName = document.getElementById("welcome-name");
  const welcomeClass = document.getElementById("welcome-class");

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("first_name, last_name, class_name")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    if (welcomeName) {
      welcomeName.textContent = "Willkommen zurück!";
    }

    if (welcomeClass) {
      welcomeClass.textContent = "Deine Profildaten konnten nicht geladen werden.";
    }
    return;
  }

  const fullName = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

  if (welcomeName) {
    welcomeName.textContent = fullName
      ? `Willkommen zurück, ${fullName}!`
      : "Willkommen zurück!";
  }

  if (welcomeClass) {
    welcomeClass.textContent = data.class_name
      ? `Klasse: ${data.class_name}`
      : "Keine Klasse hinterlegt.";
  }
}

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
}

loadProfileData();
