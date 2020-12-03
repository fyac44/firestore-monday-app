// const FirebaseService = require('../src/firebase-service')

// Elements of the html body
const firestoreItemsList = document.getElementById('firestoreItemsList');
const mondayItemsList = document.getElementById('mondayItemsList');

// Event listener -> Every change in the "Task" collection will update the list of firestore tasks in the app html
function getFirItems() {
    // const firestoreItems = FirebaseService.getItems().map( name => {
    //     return `<li>${doc.data().name}</li>`
    // });
    // firestoreItemsList.innerHTML = firestoreItems.join('');
}

// Function that reads the tasks from monday.com (The board id is hard coded)
function getMonItems() {
    // monday.api(`query { items { name, state } }`).then(res => {
    //     const mondayItems = res.data.items.map( item => {
    //         let itemStatus = item.state
    //         if (itemStatus === "active") {
    //             return `<li>${item.name}</li>`
    //         }
    //     });
    //     mondayItemsList.innerHTML = mondayItems.join('');
    //   });
}

getFirItems();
getMonItems();
setInterval( () => {
    getFirItems();
    getMonItems();
},
30000
)

