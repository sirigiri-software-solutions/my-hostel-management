// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase ,ref,push} from "firebase/database";
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

const ameerpetConfig = {
  apiKey: "AIzaSyADelK5nYnW-1qCyCphi1-e7Yw4KDesVvM",
  authDomain: "ameerpet-c73e9.firebaseapp.com",
  projectId: "ameerpet-c73e9",
  storageBucket: "ameerpet-c73e9.appspot.com",
  messagingSenderId: "445994969553",
  appId: "1:445994969553:web:d16f46fb206616061018f0"
};

const srnagarConfig = {
  apiKey: "AIzaSyBb_Ikk4mE4byCWp8z-en4lGi3wZv7fyQQ",
  authDomain: "sr-nagar-4426a.firebaseapp.com",
  databaseURL: "https://sr-nagar-4426a-default-rtdb.firebaseio.com",
  projectId: "sr-nagar-4426a",
  storageBucket: "sr-nagar-4426a.appspot.com",
  messagingSenderId: "140264952669",
  appId: "1:140264952669:web:adb88e308f3280e764ceb4"
};


const kukatpallyConfig = {
  apiKey: "AIzaSyDmxbsBCPEKxxuy1Wy6kfuOWMclf1hmfLM",
  authDomain: "kukatpally-76219.firebaseapp.com",
  databaseURL: "https://kukatpally-76219-default-rtdb.firebaseio.com",
  projectId: "kukatpally-76219",
  storageBucket: "kukatpally-76219.appspot.com",
  messagingSenderId: "233386521334",
  appId: "1:233386521334:web:75ff98a1ab7b6e0a25b2d7"
};
const gachibouliConfig = {
  apiKey: "AIzaSyAxp5nQOpk0OVdWrElvi4VxDggF3vG8Tik",
  authDomain: "gachibouli-fc19f.firebaseapp.com",
  projectId: "gachibouli-fc19f",
  storageBucket: "gachibouli-fc19f.appspot.com",
  messagingSenderId: "342192151581",
  appId: "1:342192151581:web:1ed6831be21f1e812c7af4"
};

const ashoknagarConfig = {
  apiKey: "AIzaSyBwxBZeb7PuEuqo_agWskH1tTpMeNtxz4Y",
  authDomain: "ashoknagar-385c1.firebaseapp.com",
  projectId: "ashoknagar-385c1",
  storageBucket: "ashoknagar-385c1.appspot.com",
  messagingSenderId: "40125436478",
  appId: "1:40125436478:web:fc2a5fd6cede366ab4376f"
};

const defaulthostelConfig = {
  apiKey: "AIzaSyBNUHlrRqjslUcDUf8P4d2V_DKd7xdJHKM",
  authDomain: "defaulthostel.firebaseapp.com",
  projectId: "defaulthostel",
  storageBucket: "defaulthostel.appspot.com",
  messagingSenderId: "645261882267",
  appId: "1:645261882267:web:6b4f0ef4dac6f57319273e"
};
const dhilshuknagarConfig = {
  apiKey: "AIzaSyBFzPPXnjeg4CRzX4qHEMDFQdrbDI78yD4",
  authDomain: "dhilshuknagar-85672.firebaseapp.com",
  projectId: "dhilshuknagar-85672",
  storageBucket: "dhilshuknagar-85672.appspot.com",
  messagingSenderId: "1047962745347",
  appId: "1:1047962745347:web:3679303cff253bbd622c36"
};

const himayathnagarConfig = {
  apiKey: "AIzaSyCfBj-NySGTVqbroo1o78Oi0zjy_12jbPU",
  authDomain: "himayathnagar-43760.firebaseapp.com",
  projectId: "himayathnagar-43760",
  storageBucket: "himayathnagar-43760.appspot.com",
  messagingSenderId: "419807449445",
  appId: "1:419807449445:web:63e28944843c0b96d3d18c"
};
const madhuranagarConfig = {
  apiKey: "AIzaSyBBoSlks7kjZ26jqIaCWAWlIjRsBhOuaVM",
  authDomain: "madhuranagar-4da77.firebaseapp.com",
  projectId: "madhuranagar-4da77",
  storageBucket: "madhuranagar-4da77.appspot.com",
  messagingSenderId: "693164885068",
  appId: "1:693164885068:web:3aa7c420fc9abef05da0e9"
};

const madhapurConfig = {
  apiKey: "AIzaSyBm8aOm-gUpZn9Opb1Pw8V-aUrbhTuBHlM",
  authDomain: "madharpur-221df.firebaseapp.com",
  projectId: "madharpur-221df",
  storageBucket: "madharpur-221df.appspot.com",
  messagingSenderId: "1071243668009",
  appId: "1:1071243668009:web:bf168320510f914a878a38"
};

const lbnagarConfig = {
  apiKey: "AIzaSyBpxy1fn9LHL_dygJuXwif4keLWuBgr4qY",
  authDomain: "lbnagar-86ba7.firebaseapp.com",
  projectId: "lbnagar-86ba7",
  storageBucket: "lbnagar-86ba7.appspot.com",
  messagingSenderId: "679870345296",
  appId: "1:679870345296:web:958361af2e22af1c86a155"
};
const nanakramgudaConfig = {
  apiKey: "AIzaSyAGMdtiuco4LjIK-oQM0fu6-wmVwx38AoM",
  authDomain: "nanakramguda-ebe50.firebaseapp.com",
  databaseURL: "https://nanakramguda-ebe50-default-rtdb.firebaseio.com",
  projectId: "nanakramguda-ebe50",
  storageBucket: "nanakramguda-ebe50.appspot.com",
  messagingSenderId: "871608526932",
  appId: "1:871608526932:web:c04eb9db871ce9eae1e5c1"
};

// Initialize Firebase apps
const appAmeerpet = initializeApp(ameerpetConfig, "appAmeerpet");
const appSecunderabad = initializeApp(secunderabadFirebaseConfig, "appSecunderabad");

// ===================
const appDefault = initializeApp(defaulthostelConfig, "appDefault");
const appSrnagar = initializeApp(srnagarConfig, "appSrnagar");
const appKukatpally = initializeApp(kukatpallyConfig, "appKukatpally");
const appGachibouli = initializeApp(gachibouliConfig, "appGachibouli");
const appAshoknagar = initializeApp(ashoknagarConfig, "appAshoknagar");
const appDhilshuknagar = initializeApp(dhilshuknagarConfig, "appDhilshuknagar");
const appHimayathnagar = initializeApp(himayathnagarConfig , "appHimayathnagar");
const appMadhuranagar = initializeApp(madhuranagarConfig, "appMadhuranagar");
const appMadhapur = initializeApp(madhapurConfig, "appMadhapur");
const appLbnagar = initializeApp(lbnagarConfig, "appLbnagar");
const appNanakramguda = initializeApp(nanakramgudaConfig, "appNanakramguda")

// Firebase instances
const firebaseInstances = {
  ameerpet: {
    app: appAmeerpet,
    database: getDatabase(appAmeerpet),
    storage: getStorage(appAmeerpet),
    auth: getAuth(appAmeerpet),
  },
  srnagar: {
    app: appSrnagar,
    database: getDatabase(appSrnagar),
    storage: getStorage(appSrnagar),
    auth: getAuth(appSrnagar),
  },
  default: {
    app: appDefault,
    database: getDatabase(appDefault),
    storage: getStorage(appDefault),
    auth: getAuth(appDefault),
  },
  secunderabad: {
    app: appSecunderabad,
    database: getDatabase(appSecunderabad),
    storage: getStorage(appSecunderabad),
    auth: getAuth(appSecunderabad),
  },
  kukatpally: {
    app: appKukatpally,
    database: getDatabase(appKukatpally),
    storage: getStorage(appKukatpally),
    auth: getAuth(appKukatpally),
  },
  gachibouli: {
    app: appGachibouli,
    database: getDatabase(appGachibouli),
    storage: getStorage(appGachibouli),
    auth: getAuth(appGachibouli),
  },
  ashoknagar: {
    app: appAshoknagar,
    database: getDatabase(appAshoknagar),
    storage: getStorage(appAshoknagar),
    auth: getAuth(appAshoknagar),
  },
  dhilshuknagar: {
    app: appDhilshuknagar,
    database: getDatabase(appDhilshuknagar),
    storage: getStorage(appDhilshuknagar),
    auth: getAuth(appDhilshuknagar),
  },
  himayathnagar: {
    app: appHimayathnagar,
    database: getDatabase(appHimayathnagar),
    storage: getStorage(appHimayathnagar),
    auth: getAuth(appHimayathnagar),
  },
  madhuranagar: {
    app: appMadhuranagar,
    database: getDatabase(appMadhuranagar),
    storage: getStorage(appMadhuranagar),
    auth: getAuth(appMadhuranagar),
  },
  madhapur: {
    app: appMadhapur,
    database: getDatabase(appMadhapur),
    storage: getStorage(appMadhapur),
    auth: getAuth(appMadhapur),
  },
  lbnagar: {
    app: appLbnagar,
    database: getDatabase(appLbnagar),
    storage: getStorage(appLbnagar),
    auth: getAuth(appLbnagar),
  },
  nanakramguda: {
    app: appNanakramguda,
    database: getDatabase(appNanakramguda),
    storage: getStorage(appNanakramguda),
    auth: getAuth(appNanakramguda),
  },
  
};

export { firebaseInstances,ref,push};
