// js/topics.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get("id");
  const lessonTitle = document.getElementById("lessonTitle");
  const topicInput = document.getElementById("topicInput");
  const addTopicBtn = document.getElementById("addTopicBtn");
  const topicList = document.getElementById("topicList");

  if (!lessonId) {
    alert("Ders ID'si bulunamadı.");
    window.location.href = "derslerim.html";
    return;
  }

  auth.onAuthStateChanged(async user => {
    if (!user) return;

    // Ders başlığını çek
    const lessonDoc = await db.collection("lessons").doc(lessonId).get();
    if (lessonDoc.exists) {
      lessonTitle.textContent = lessonDoc.data().name;
    } else {
      lessonTitle.textContent = "Ders Bulunamadı";
    }

    // Konu ekle butonu
    addTopicBtn.onclick = async () => {
      const topicName = topicInput.value.trim();
      if (!topicName) return alert("Konu başlığı girin");

      await db.collection(`lessons/${lessonId}/topics`).add({
        name: topicName,
        createdAt: new Date()
      });

      topicInput.value = "";
      loadTopics();
    };

    // Konuları listele
    async function loadTopics() {
      const snapshot = await db.collection(`lessons/${lessonId}/topics`).orderBy("createdAt", "desc").get();
      topicList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "card p-3 mb-3";
        div.innerHTML = `
          <h5>${data.name}</h5>
          <a href="konu.html?lessonId=${lessonId}&topicId=${doc.id}" class="btn btn-outline-success mt-2">İçeriğe Git</a>
        `;
        topicList.appendChild(div);
      });
    }

    loadTopics();
  });
});
