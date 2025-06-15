document.addEventListener("DOMContentLoaded", () => {
  const addLessonBtn = document.getElementById("addLessonBtn");
  const lessonInput = document.getElementById("lessonInput");
  const lessonList = document.getElementById("lessonList");

  let currentUser = null;

  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      loadLessons();
    } else {
      console.warn("Kullanıcı giriş yapmamış.");
    }
  });

  addLessonBtn.onclick = async () => {
    if (!currentUser) {
      alert("Giriş yapılmadan ders eklenemez.");
      return;
    }

    const lessonName = lessonInput.value.trim();
    if (!lessonName) return alert("Ders adı boş olamaz.");

    try {
      await db.collection("lessons").add({
        name: lessonName,
        userId: currentUser.uid,
        createdAt: new Date()
      });
      lessonInput.value = "";
      loadLessons();
    } catch (err) {
      alert("Ders eklenirken hata oluştu: " + err.message);
    }
  };

  async function loadLessons() {
    if (!currentUser) return;

    try {
      const snapshot = await db.collection("lessons")
        .where("userId", "==", currentUser.uid)
        .orderBy("createdAt", "desc")
        .get();

      lessonList.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "card p-3 mb-3";
        div.innerHTML = `
          <h5>${data.name}</h5>
          <a href="ders.html?id=${doc.id}" class="btn btn-outline-primary mt-2">Derse Git</a>
        `;
        lessonList.appendChild(div);
      });
    } catch (err) {
      console.error("Dersler yüklenemedi:", err.message);
    }
  }
});
