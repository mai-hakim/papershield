/* "Save on my phone only": letters the person chose to keep.
   Stored in this browser's IndexedDB on this phone. Never sent anywhere.
   Nothing is saved unless the person presses "Save on my phone only". */
(function (root) {
  'use strict';
  const DB = 'papershield-letters', STORE = 'letters';
  function open() {
    return new Promise((res, rej) => {
      if (!root.indexedDB) return rej(new Error('no indexedDB'));
      const r = root.indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  async function run(mode, fn) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, mode); const st = tx.objectStore(STORE);
      const out = fn(st);
      tx.oncomplete = () => { db.close(); res(out && out.result !== undefined ? out.result : out); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    });
  }
  const save = rec => run('readwrite', st => st.put(rec));
  const remove = id => run('readwrite', st => st.delete(id));
  const clear = () => run('readwrite', st => st.clear());
  async function list() {
    const all = await run('readonly', st => st.getAll());
    return (all || []).sort((a, b) => b.id - a.id);
  }
  root.PSStore = { save, remove, list, clear };
})(window);
