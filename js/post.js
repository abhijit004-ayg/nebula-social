import { auth, db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// GET POST ID FROM URL
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const articleDiv = document.getElementById("article");
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");
const commentBtn = document.getElementById("commentBtn");
const commentsList = document.getElementById("commentsList");

// LOAD ARTICLE
async function loadPost() {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const data = postSnap.data();

    articleDiv.innerHTML = `
      ${data.image ? `<img src="${data.image}" class="article-image"/>` : ""}
      <h1 class="article-title">${data.title}</h1>
      <div class="article-meta">By ${data.authorEmail}</div>
      <p class="article-content">${data.content}</p>
    `;

    likeCount.innerText = `${data.likeCount || 0} Likes`;
  }
}

loadPost();

// LIKE SYSTEM
likeBtn.onclick = async () => {
  const postRef = doc(db, "posts", postId);

  await updateDoc(postRef, {
    likeCount: increment(1)
  });
};

// REALTIME LIKE UPDATE
onSnapshot(doc(db, "posts", postId), (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    likeCount.innerText = `${data.likeCount || 0} Likes`;
  }
});

// COMMENT SYSTEM
commentBtn.onclick = async () => {
  const text = document.getElementById("commentInput").value;

  if (!text || !auth.currentUser) {
    alert("Login to comment");
    return;
  }

  await addDoc(collection(db, "posts", postId, "comments"), {
    text: text,
    user: auth.currentUser.email,
    createdAt: serverTimestamp()
  });

  document.getElementById("commentInput").value = "";

  await updateDoc(doc(db, "posts", postId), {
    commentCount: increment(1)
  });
};

// LOAD COMMENTS
const commentsQuery = query(
  collection(db, "posts", postId, "comments"),
  orderBy("createdAt", "desc")
);

onSnapshot(commentsQuery, (snapshot) => {
  commentsList.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    commentsList.innerHTML += `
      <div class="comment-card">
        <strong>${data.user}</strong>
        <p>${data.text}</p>
      </div>
    `;
  });
});
