import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyD3Z-AX0fRpDWJfrB4_JNmEFVJhBgQOqpY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "fahrdienst-richter-ai.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "fahrdienst-richter-ai",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "fahrdienst-richter-ai.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "507750741610",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:507750741610:web:dcfd8568c80c05a325fc13",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MG87FECL6S",
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  // Check if Firebase app already exists to prevent duplicate initialization
  if (!globalThis.firebase) {
    app = initializeApp(firebaseConfig);
    globalThis.firebase = app;
  } else {
    app = globalThis.firebase;
  }

  // Initialize Firebase services with timeout and retry options
  auth = getAuth(app);
  auth.settings = {
    appVerificationDisabledForTesting: import.meta.env.DEV || false,
  };

  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Authentication helper functions
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Create user record in Firestore
    const userRef = doc(db, "staff", userCredential.user.uid);
    await setDoc(userRef, {
      email: userCredential.user.email,
      role: "staff", // Default role
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error signing up with email and password:", error);
    return { success: false, error };
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Update last login timestamp
    const userRef = doc(db, "staff", userCredential.user.uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    return { success: false, error };
  }
};

export const sendMagicLink = async (email: string, redirectUrl: string) => {
  const actionCodeSettings = {
    url: redirectUrl,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save the email to localStorage for later use
    localStorage.setItem("emailForSignIn", email);
    return { success: true };
  } catch (error) {
    console.error("Error sending magic link:", error);
    return { success: false, error };
  }
};

export const completeSignInWithEmailLink = async () => {
  if (!isSignInWithEmailLink(auth, window.location.href)) {
    return { success: false, error: "Invalid sign-in link" };
  }

  let email = localStorage.getItem("emailForSignIn");
  if (!email) {
    // If missing email, prompt user for it
    email = window.prompt("Please provide your email for confirmation");
    if (!email) {
      return { success: false, error: "Email required" };
    }
  }

  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    // Clear email from storage
    localStorage.removeItem("emailForSignIn");

    // Check if user exists in the staff collection, if not create a record
    const userRef = doc(db, "staff", result.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: result.user.email,
        role: "staff", // Default role
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error signing in with email link:", error);
    return { success: false, error };
  }
};

// Database helper functions
export const createAppointment = async (appointmentData) => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const docRef = await addDoc(appointmentsRef, {
      ...appointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: appointmentData.status || "unassigned",
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error };
  }
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      ...appointmentData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, error };
  }
};

export const getAppointments = async (filters = {}) => {
  try {
    const appointmentsRef = collection(db, "appointments");
    let q = query(appointmentsRef);

    // Apply filters if any
    if (filters.status) {
      q = query(appointmentsRef, where("status", "==", filters.status));
    }
    if (filters.date) {
      // Convert date to Firestore Timestamp
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      q = query(
        q,
        where("dateTime", ">=", Timestamp.fromDate(startOfDay)),
        where("dateTime", "<=", Timestamp.fromDate(endOfDay)),
      );
    }
    if (filters.vehicleId) {
      q = query(q, where("vehicleId", "==", filters.vehicleId));
    }

    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, appointments };
  } catch (error) {
    console.error("Error getting appointments:", error);
    return { success: false, error };
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    const docRef = await addDoc(vehiclesRef, {
      ...vehicleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: vehicleData.active !== undefined ? vehicleData.active : true,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return { success: false, error };
  }
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    await updateDoc(vehicleRef, {
      ...vehicleData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return { success: false, error };
  }
};

export const getVehicles = async (includeInactive = false) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    let q = vehiclesRef;

    if (!includeInactive) {
      q = query(vehiclesRef, where("active", "==", true));
    }

    const querySnapshot = await getDocs(q);
    const vehicles = [];
    querySnapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, vehicles };
  } catch (error) {
    console.error("Error getting vehicles:", error);
    return { success: false, error };
  }
};

export const createPatient = async (patientData) => {
  try {
    const patientsRef = collection(db, "patients");
    const docRef = await addDoc(patientsRef, {
      ...patientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating patient:", error);
    return { success: false, error };
  }
};

export const updatePatient = async (patientId, patientData) => {
  try {
    const patientRef = doc(db, "patients", patientId);
    await updateDoc(patientRef, {
      ...patientData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating patient:", error);
    return { success: false, error };
  }
};

export const getPatients = async () => {
  try {
    const patientsRef = collection(db, "patients");
    const querySnapshot = await getDocs(patientsRef);
    const patients = [];
    querySnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, patients };
  } catch (error) {
    console.error("Error getting patients:", error);
    return { success: false, error };
  }
};

export { app, auth, db, storage };
