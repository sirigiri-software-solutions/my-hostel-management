// working firebase config for different locations
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const ameerpetFirebaseConfig = {
  apiKey: "AIzaSyAOHosh74ErvJ-NyySUluijsTv2ZvdC4SU",
  authDomain: "ameerpet-588ee.firebaseapp.com",
  databaseURL: "https://ameerpet-588ee-default-rtdb.firebaseio.com",
  projectId: "ameerpet-588ee",
  storageBucket: "ameerpet-588ee.appspot.com",
  messagingSenderId: "497595268016",
  appId: "1:497595268016:web:930213c3e11b95d2087475"
};

const secunderabadFirebaseConfig = {
  apiKey: "AIzaSyBjWBFrZrUCSXGrnGv1xFp_B8J-PWENcQk",
  authDomain: "sr-nagar.firebaseapp.com",
  databaseURL: "https://sr-nagar-default-rtdb.firebaseio.com",
  projectId: "sr-nagar",
  storageBucket: "sr-nagar.appspot.com",
  messagingSenderId: "65931280973",
  appId: "1:65931280973:web:386b51d78ce80bf5b25204"
};


// Initialize Firebase apps
const appAmeerpet = initializeApp(ameerpetFirebaseConfig, "appAmeerpet");
const appSecunderabad = initializeApp(secunderabadFirebaseConfig, "appSecunderabad");

// Firebase instances
const firebaseInstances = {
  hyderabad: {
    app: appAmeerpet,
    database: getDatabase(appAmeerpet),
    storage: getStorage(appAmeerpet),
    auth: getAuth(appAmeerpet),
  },
  secunderabad: {
    app: appSecunderabad,
    database: getDatabase(appSecunderabad),
    storage: getStorage(appSecunderabad),
    auth: getAuth(appSecunderabad),
  },
};

// export default firebaseInstances;
const defaultDatabase = firebaseInstances.hyderabad.database;
const defaultAuth = firebaseInstances.hyderabad.auth;

export { firebaseInstances, ref, push, defaultDatabase as database, defaultAuth as auth };

// Default export for the Ameerpet Firebase instance
export default firebaseInstances.hyderabad;