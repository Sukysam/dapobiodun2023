 // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js";
import {
  addDoc,
  query,
  getDocs,
  orderBy,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlQ_ikaiUflMZIf4iNChi3b0swg_CHvrs",
  authDomain: "dapobiodun2023-com.firebaseapp.com",
  databaseURL: "https://dapobiodun2023-com-default-rtdb.firebaseio.com",
  projectId: "dapobiodun2023-com",
  storageBucket: "dapobiodun2023-com.appspot.com",
  messagingSenderId: "524789190610",
  appId: "1:524789190610:web:efb7766cffdac5f901820b",
  measurementId: "G-SLZPS2MB12"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
logEvent(analytics, "notification_received");

const AuthLogin = (event) => {
  event.preventDefault();
  const email = document.getElementById("form-email").value;
  const password = document.getElementById("form-password").value;
  const errorMessage = document.getElementById("form-notification");
  errorMessage.style.display = "none";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // console.log(userCredential.user);
      location.href = "./admin.html";
    })
    .catch(() => {
      errorMessage.style.display = "block";
    });
};

const AuthGetUser = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("auth-user-email").innerText = user.email;
    } else {
      location.href = "./login.html";
    }
  });
};

const AuthLogout = () => {
  signOut(auth).finally(() => {
    location.href = "./login.html";
  });
};

const saveFormData = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, "users_18_aug_2022"), payload);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const FetchAllUsers = async () => {
  const data = [];
  const q = query(
    collection(db, "users_18_aug_2022"),
    orderBy("created_at", "desc"),
    limit(100)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const item = doc.data();
    const created_at = new Date(item.created_at).toLocaleString();
    data.push({ ...item, created_at });
  });

  document.querySelectorAll("#table-skeleton-loader").forEach((el) => {
    el.style.display = "none";
  });

  // Transform an array of objects into a CSV string
  const csvHeader = [
    "first_name",
    "last_name",
    "state",
    "created_at",
  ];

  let csvContent = [
    csvHeader,
    ...data.map((item) =>
      [...csvHeader.map((el, i) => item[csvHeader[i]])].map(
        (str) => `"${str.replace(/"/g, '"')}"`
      )
    ),
  ]
    .map((e) => e.join(","))
    .join("\n");

  document.getElementById("table-export").href =
    "data:text/csv;charset=utf-8," + csvContent;

  return data;
};

window.AuthLogin = AuthLogin;
window.AuthLogout = AuthLogout;
window.AuthGetUser = AuthGetUser;
window.FetchAllUsers = FetchAllUsers;
window.saveFormData = saveFormData;
