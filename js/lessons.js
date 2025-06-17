const lessonMap = {
  TYT: ["Türkçe", "Matematik", "Geometri", "Fizik", "Kimya", "Biyoloji", "Sosyal"],
  AYT: ["Matematik", "Fizik", "Kimya", "Biyoloji"]
};

let currentSection = "TYT";
const container = document.getElementById("lessonsContainer");

function createLessonUI(lessonName) {
  const div = document.createElement("div");
  div.className = "card mb-3 p-3";
  div.innerHTML = `
    <h5>${lessonName}</h5>
    <input type="text" class="form-control mb-2 topicInput" placeholder="Konu Adı">
    <button class="btn btn-success btn-sm addTopicBtn">Konu Ekle</button>
    <ul class="mt-2 topicList list-group"></ul>
  `;
  const addBtn = div.querySelector(".addTopicBtn");
  const input = div.querySelector(".topicInput");
  const list = div.querySelector(".topicList");

  addBtn.addEventListener("click", () => {
    const topic = input.value.trim();
    const userId = auth.currentUser?.uid;
    if (topic && userId) {
      db.collection("topics").add({
        userId,
        section: currentSection,
        lesson: lessonName,
        topic,
        createdAt: new Date()
      }).then(() => {
        input.value = "";
        loadTopics();
      });
    }
  });

  container.appendChild(div);
}

function loadLessons(section) {
  currentSection = section;
  container.innerHTML = "";
  lessonMap[section].forEach(lesson => {
    createLessonUI(lesson);
  });
  loadTopics();
}

function loadTopics() {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  db.collection("topics")
    .where("userId", "==", userId)
    .where("section", "==", currentSection)
    .orderBy("lesson")
    .orderBy("createdAt")
    .get()
    .then(snapshot => {
      const lessonCards = container.querySelectorAll(".card");
      lessonCards.forEach(card => {
        const lessonTitle = card.querySelector("h5").innerText;
        const list = card.querySelector(".topicList");
        list.innerHTML = "";
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.lesson === lessonTitle) {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = data.topic;
            list.appendChild(li);
          }
        });
      });
    });
}

// Sekmeler arası geçiş
document.getElementById("tabMenu").addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.tagName === "A") {
    document.querySelectorAll("#tabMenu .nav-link").forEach(link => link.classList.remove("active"));
    e.target.classList.add("active");
    loadLessons(e.target.dataset.section);
  }
});

auth.onAuthStateChanged(user => {
  if (user) {
    loadLessons(currentSection);
  }
});
