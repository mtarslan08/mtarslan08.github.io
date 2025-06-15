// js/media.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get("lessonId");
  const topicId = params.get("topicId");

  const mediaInput = document.getElementById("mediaInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const progressContainer = document.querySelector(".progress");
  const progressBar = document.getElementById("uploadProgress");
  const mediaGallery = document.getElementById("mediaGallery");
  const topicTitle = document.getElementById("topicTitle");

  if (!lessonId || !topicId) {
    alert("Eksik URL parametresi");
    window.location.href = "derslerim.html";
    return;
  }

  auth.onAuthStateChanged(async user => {
    if (!user) return;

    // Konu başlığını çek
    const topicDoc = await db.collection(`lessons/${lessonId}/topics`).doc(topicId).get();
    if (topicDoc.exists) {
      topicTitle.textContent = topicDoc.data().name;
    }

    // Medya yükleme
    uploadBtn.onclick = () => {
      const file = mediaInput.files[0];
      if (!file) return alert("Lütfen bir dosya seçin");

      const filePath = `users/${user.uid}/lessons/${lessonId}/topics/${topicId}/${file.name}`;
      const ref = storage.ref(filePath);
      const uploadTask = ref.put(file);

      progressContainer.style.display = "block";

      uploadTask.on("state_changed",
        snapshot => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          progressBar.style.width = progress + "%";
          progressBar.textContent = progress + "%";
        },
        err => alert("Yükleme hatası: " + err.message),
        async () => {
          const url = await ref.getDownloadURL();
          await db.collection(`lessons/${lessonId}/topics/${topicId}/media`).add({
            url,
            type: file.type,
            name: file.name,
            createdAt: new Date()
          });
          mediaInput.value = "";
          progressBar.style.width = "0%";
          progressBar.textContent = "0%";
          progressContainer.style.display = "none";
          loadMedia();
        }
      );
    };

    async function loadMedia() {
      const snapshot = await db.collection(`lessons/${lessonId}/topics/${topicId}/media`)
        .orderBy("createdAt", "desc")
        .get();

      mediaGallery.innerHTML = "";

      snapshot.forEach(doc => {
        const media = doc.data();
        const div = document.createElement("div");
        div.className = "mb-4";

        if (media.type.startsWith("image/")) {
          div.innerHTML = `<img src="${media.url}" class="img-fluid rounded shadow">`;
        } else if (media.type.startsWith("video/")) {
          div.innerHTML = `<video controls src="${media.url}" class="w-100 rounded shadow"></video>`;
        } else {
          div.innerHTML = `<a href="${media.url}" target="_blank">${media.name}</a>`;
        }

        mediaGallery.appendChild(div);
      });
    }

    loadMedia();
  });
});
