// js/lessons.js

document.addEventListener("DOMContentLoaded", () => {
  const addLessonBtn = document.getElementById("addLessonBtn");
  const lessonInput = document.getElementById("lessonInput");
  const lessonList = document.getElementById("lessonList");

  auth.onAuthStateChanged(async user => {
    if (user) {
      loadLessons(user.uid);

      addLessonBtn.onclick = async () => {
        const lessonName = lessonInput.value.trim();
        if (!lessonName) return alert("Ders adı boş olamaz.");
        const ref = await db.collection("lessons").add({
          name: lessonName,
          userId: user.uid,
          createdAt: new Date()
        });
        lessonInput.value = "";
        loadLessons(user.uid);
      };
    }
  });

  async function loadLessons(uid) {
    const snapshot = await db.collection("lessons")
      .where("userId", "==", uid)
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
  }
});
