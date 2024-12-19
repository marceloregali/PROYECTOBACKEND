// scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Evita la recarga de página

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        const message = document.getElementById("responseMessage");

        if (response.ok) {
          message.style.color = "green";
          message.textContent = "Registro exitoso";
          registerForm.reset();
        } else {
          message.style.color = "red";
          message.textContent = data.message || "Error en el registro";
        }
      } catch (error) {
        console.error("Error al registrar usuario:", error);
      }
    });
  }
});
