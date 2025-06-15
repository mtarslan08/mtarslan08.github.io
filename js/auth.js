// js/auth.js

auth.onAuthStateChanged(user => {
  const currentPage = window.location.pathname;

  if (user) {
    // Eğer giriş yapılmışsa ve şu an index.html'deysek, yönlendir
    if (currentPage.endsWith("index.html") || currentPage === "/" || currentPage === "/index.html") {
      window.location.href = "derslerim.html";
    }
  } else {
    // Eğer giriş yapılmamışsa ve index.html dışında bir sayfadaysa, ana sayfaya yönlendir
    if (!currentPage.endsWith("index.html") && currentPage !== "/") {
      window.location.href = "index.html";
    }
  }
});
