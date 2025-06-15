// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) {
    loginBtn.onclick = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).catch(err => alert("Giriş başarısız: " + err.message));
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      auth.signOut().then(() => window.location.href = "index.html");
    };
  }

  auth.onAuthStateChanged(user => {
    const protectedRoutes = ["derslerim.html", "ders.html", "konu.html"];
    const currentPage = window.location.pathname.split("/").pop();

    if (!user && protectedRoutes.includes(currentPage)) {
      alert("Lütfen giriş yapınız.");
      window.location.href = "index.html";
    }
  });
});
