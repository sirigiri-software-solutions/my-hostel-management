// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, push} from "firebase/database";
// import { getStorage} from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDczL0G3Posqk67RnsB7en38zXsujEsZ9k",
//   authDomain: "signuppage-2f4c8.firebaseapp.com",
//   databaseURL: "https://signuppage-2f4c8-default-rtdb.firebaseio.com",
//   projectId: "signuppage-2f4c8",
//   storageBucket: "signuppage-2f4c8.appspot.com",
//   messagingSenderId: "333871852694",
//   appId: "1:333871852694:web:a6b7173d62a8842515e6b7"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const storage = getStorage(app);

// export { database, storage, ref, push};

// src/firebase-config.js


import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAOHosh74ErvJ-NyySUluijsTv2ZvdC4SU",
  authDomain: "ameerpet-588ee.firebaseapp.com",
  databaseURL: "https://ameerpet-588ee-default-rtdb.firebaseio.com",
  projectId: "ameerpet-588ee",
  storageBucket: "ameerpet-588ee.appspot.com",
  messagingSenderId: "497595268016",
  appId: "1:497595268016:web:930213c3e11b95d2087475"
};

const firebaseConfig1 = {
  apiKey: "AIzaSyBjWBFrZrUCSXGrnGv1xFp_B8J-PWENcQk",
  authDomain: "sr-nagar.firebaseapp.com",
  databaseURL: "https://sr-nagar-default-rtdb.firebaseio.com",
  projectId: "sr-nagar",
  storageBucket: "sr-nagar.appspot.com",
  messagingSenderId: "65931280973",
  appId: "1:65931280973:web:386b51d78ce80bf5b25204"
};


const initializeFirebase = () => {

  const area = localStorage.getItem('userarea');
  let finalFirebaseConfig;
  if (area === "undefined") {
    finalFirebaseConfig = firebaseConfig
  } else  if (area === null) {
    finalFirebaseConfig = firebaseConfig
  } else  if (area === 'hyderabad') {
    finalFirebaseConfig = firebaseConfig
  } else if (area === 'secunderabad') {
    finalFirebaseConfig = firebaseConfig1
  }
  console.log("firebase area", area)

  const app = initializeApp(finalFirebaseConfig);
  const database = getDatabase(app);
  const storage = getStorage(app);

  return { database, storage, push, ref };
};

const { database, storage } = initializeFirebase();

console.log("finaldatabase", database)

export { database, storage, push, ref };
