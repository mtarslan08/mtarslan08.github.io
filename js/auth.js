auth.onAuthStateChanged(user => {
  const currentPage = window.location.pathname;
  if (user) {
    if (currentPage.endsWith("index.html") || currentPage === "/" || currentPage === "/index.html") {
      window.location.href = "derslerim.html";
    }
  } else {
    if (!currentPage.endsWith("index.html") && currentPage !== "/") {
      window.location.href = "index.html";
    }
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut();
});
