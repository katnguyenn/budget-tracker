let db;
const request = window.indexedDB.open(budget, 1);

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