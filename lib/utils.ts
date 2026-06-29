import {
  ref,
  onDisconnect,
  update,
  onValue,
  serverTimestamp as rtdbServerTimestamp,
} from "firebase/database";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { database, db } from "./firebase";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setupOnlineStatus = (userId: string) => {
  if (!userId) return;

  const userStatusRef = ref(database, `/status/${userId}`);
  const userDocRef = doc(db, "visitors", userId);

  console.log("[Firebase presence] listening", {
    realtimePath: `status/${userId}`,
    firestorePath: `pays/${userId}`,
    visitorId: userId,
  });

  onDisconnect(userStatusRef)
    .set({
      state: "offline",
      lastChanged: rtdbServerTimestamp(),
    })
    .then(() => {
      update(userStatusRef, {
        state: "online",
        lastChanged: rtdbServerTimestamp(),
        online: true,
        id: userId,
        visitorId: userId,
      });

      setDoc(userDocRef, {
        id: userId,
        visitorId: userId,
        online: true,
        lastActiveAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch((error) =>
        console.error("Error updating Firestore document:", error)
      );
      console.log("[Firebase presence] online saved", {
        realtimePath: `status/${userId}`,
        firestorePath: `visitors/${userId}`,
        visitorId: userId,
      });
    })
    .catch((error) => console.error("Error setting onDisconnect:", error));

  onValue(userStatusRef, (snapshot) => {
    const status = snapshot.val();
    console.log("[Firebase presence] status snapshot", {
      realtimePath: `status/${userId}`,
      visitorId: userId,
      state: status?.state,
      fields: status ? Object.keys(status) : [],
    });
    if (status?.state === "offline") {
      setDoc(userDocRef, {
        id: userId,
        visitorId: userId,
        online: false,
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch((error) =>
        console.error("Error updating Firestore document:", error)
      );
    }
  });
};

export const setUserOffline = async (userId: string) => {
  if (!userId) return;

  try {
    await setDoc(doc(db, "visitors", userId), {
      id: userId,
      visitorId: userId,
      online: false,
      lastSeen: serverTimestamp(),
    }, { merge: true });

    await update(ref(database, `/status/${userId}`), {
      state: "offline",
      online: false,
      id: userId,
      visitorId: userId,
      lastChanged: rtdbServerTimestamp(),
    });
    console.log("[Firebase presence] offline saved", {
      realtimePath: `status/${userId}`,
      firestorePath: `visitors/${userId}`,
      visitorId: userId,
    });
  } catch (error) {
    console.error("Error setting user offline:", error);
  }
};
