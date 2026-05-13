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

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) {
      registerMessage.textContent = "Fehler bei der Registrierung: " + error.message;
      return;
    }

    const user = data.user;

    if (!user) {
      registerMessage.textContent = "Registrierung erfolgreich, aber kein Benutzerobjekt erhalten.";
      return;
    }

    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert([
        {
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          class_name: className
        }
      ]);

    if (profileError) {
      registerMessage.textContent = "Benutzer erstellt, aber Profil konnte nicht gespeichert werden: " + profileError.message;
      return;
    }

    registerMessage.textContent = "Registrierung erfolgreich!";
    registerForm.reset();
  });
}
