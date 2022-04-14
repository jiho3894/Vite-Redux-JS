import firebase from "firebase/app";
import "firebase/auth";

export const apiKey = "AIzaSyAj2SygMOq0aExONbXyRmpP3RTLwSfos3Y";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "sparta-react-a36d6.firebaseapp.com",
  projectId: "sparta-react-a36d6",
  storageBucket: "sparta-react-a36d6.appspot.com",
  messagingSenderId: "579630563820",
  appId: "1:579630563820:web:a2ccd11f1d34eebde600c9",
  measurementId: "G-JM0W78N7B5",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export { auth };
