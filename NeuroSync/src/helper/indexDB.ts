import { openDB } from "idb";

const DB_NAME = "mindlink";
const STORE_NAME = "editorState";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log("Creating object store:", STORE_NAME);
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveToIndexedDB(roomId: string, yDocState: Uint8Array) {
  console.log(`Saving to IndexedDB: roomId=${roomId}`, yDocState);
  try {
    const db = await getDB();
    await db.put(STORE_NAME, Array.from(yDocState), roomId);
    console.log(`✅ Saved to IndexedDB: roomId=${roomId}`);
  } catch (error) {
    console.error(`❌ Error saving to IndexedDB: roomId=${roomId}`, error);
  }
}

export async function loadFromIndexedDB(
  roomId: string
): Promise<Uint8Array | null> {
  try {
    const db = await getDB();
    const savedState = await db.get(STORE_NAME, roomId);
    console.log(`✅ Loaded from IndexedDB: roomId=${roomId}`, savedState);
    return savedState ? new Uint8Array(savedState) : null;
  } catch (error) {
    console.error(`❌ Error loading from IndexedDB: roomId=${roomId}`, error);
    return null;
  }
}
