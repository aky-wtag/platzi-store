import type { Product } from "../interfaces/product";

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("cartDB", 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target!["result"];
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Failed to open IndexedDB");
    };
  });
};

export const saveCartToDB = async (items: Product[]) => {
  const db: any = await openDB();
  const tx = db.transaction("cart", "readwrite");
  const store = tx.objectStore("cart");

  store.clear();
  items.forEach((item) => {
    store.put(item);
  });

  return tx.complete;
};

export const loadCartFromDB = async (): Promise<Product[]> => {
  const db: any = await openDB();
  const tx = db.transaction("cart", "readonly");
  const store = tx.objectStore("cart");
  const allItemsRequest = store.getAll();
  return new Promise((resolve, reject) => {
    allItemsRequest.onsuccess = () => {
      resolve(allItemsRequest.result);
    };
    allItemsRequest.onerror = () => {
      reject("Failed to load cart from DB");
    };
  });
};
