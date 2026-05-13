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

    loginMessage.textContent = "Anmeldung erfolgreich!";
    loginForm.reset();
  });
}
