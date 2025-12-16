import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1H1rP6MPrKJLbkXPNIq5siry1LRk1CWQ",
  authDomain: "aerilux-website.firebaseapp.com",
  projectId: "aerilux-website",
  storageBucket: "aerilux-website.firebasestorage.app",
  messagingSenderId: "592738410672",
  appId: "1:592738410672:web:768b60e432083c18725b75",
  measurementId: "G-QW0YCHJ91N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Types
export interface LeaderboardEntry {
  id?: string;
  playerName: string;
  score: number;
  pigeonsScared: number;
  batsScared: number;
  maxCombo: number;
  timestamp: Timestamp;
}

// Leaderboard collection reference
const leaderboardRef = collection(db, "pigeon_game_leaderboard");

// Add score to leaderboard
export const addScore = async (entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const docRef = await addDoc(leaderboardRef, {
      ...entry,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding score:", error);
    throw error;
  }
};

// Get top scores
export const getTopScores = async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LeaderboardEntry));
  } catch (error) {
    console.error("Error getting scores:", error);
    return [];
  }
};

export { db };
