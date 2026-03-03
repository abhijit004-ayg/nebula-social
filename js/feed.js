import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const authSection = document.getElementById("auth-section");
const postSection = document.getElementById("post-section");
const feed = document.getElementById("feed");

// AUTH

document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth, email, password);
};

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
};

document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.classList.add("hidden");
    postSection.classList.remove("hidden");
  } else {
    authSection.classList.remove("hidden");
    postSection.classList.add("hidden");
  }
});

// CREATE POST

document.getElementById("postBtn").onclick = async () => {

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const imageFile = document.getElementById("imageInput").files[0];

  if (!title || !content) {
    alert("Fill all fields");
    return;
  }

  const preview = content.substring(0, 150) + "...";

  let imageBase64 = "";

  if (imageFile) {
    const reader = new FileReader();

    reader.onload = async function () {
      imageBase64 = reader.result;

      await addDoc(collection(db, "posts"), {
        title,
        content,
        preview,
        image: imageBase64,
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp()
      });

      clearForm();
    };

    reader.readAsDataURL(imageFile);

  } else {

    await addDoc(collection(db, "posts"), {
      title,
      content,
      preview,
      image: "",
      authorId: auth.currentUser.uid,
      authorEmail: auth.currentUser.email,
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp()
    });

    clearForm();
  }
};

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("imageInput").value = "";
}

// FEED

const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  feed.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const postId = doc.id;

    feed.innerHTML += `
      <div class="post-card">
        ${data.image ? `<img src="${data.image}" class="feed-image"/>` : ""}
        <h3>${data.title}</h3>
        <p>${data.preview}</p>
        <div class="meta">
          By ${data.authorEmail}
        </div>
        <button onclick="window.location.href='post.html?id=${postId}'">
          Read More
        </button>
      </div>
    `;
  });
});
