let db;
// request db instance
const request = window.indexedDB.open("budget", 1);

// create object store inside the openupgradeneeded method
request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true})
};

request.onerror = event => {
    console.log("There was an error")
};

request.onsuccess = event => {
    db = event.target.result;

    if(navigator.onLine) {
        checkDatabase();
    }
}

// save record 
const saveRecord = (record) => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    // add data to objectStore
    store.add(record);
}

const checkDatabase = () => {
    // open transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access pending object store 
    const store = transaction.objectStore("pending");
    // get all records from store 
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(() => {
                // if successful, open transaction on pending db
                const transaction = db.transaction(["pending"], "readwrite");
                // access pending object store 
                const store = transaction.objectStore("pending");
                // clear items in store
                store.clear();
            })
        }
    }

}


window.addEventListener('online', checkDatabase);