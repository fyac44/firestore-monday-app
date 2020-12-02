// The scripts to monday sdk and firebase are attached to the index.html
const monday = window.mondaySdk();
const db = firebase.firestore();

module.exports = {db: db};

// Elements of the html body
const createTaskBtn = document.getElementById('createTaskBtn');
const updateMondayBtn = document.getElementById('updateMondayBtn');
const firestoreTasksList = document.getElementById('firestoreTasksList');
const mondayTasksList = document.getElementById('mondayTasksList');

// List of items that are in firebase and monday. The items represent a task in this case.
var firestoreItemsList = [];
var mondayItemsList = [];

// Connect to the collection where the task are located in firestore. The collection must be called "Task"
const taskRef = db.collection("Tasks");

// On click envents -> This create a new task document inside the firebase collection
createTaskBtn.onclick = () => {
    taskRef.add({
        name: faker.commerce.productName()
    })
}

// On click envents -> This updates the items in monday.com (Currently board_id and group_id are hard-coded)
updateMondayBtn.onclick = () => {
    console.log(firestoreItemsList);
    console.log(mondayItemsList);
    firestoreItemsList.map( task => {
        if (!mondayItemsList.includes(task)) {
            monday.api(`mutation { create_item (board_id: 874083556, group_id: "backlog", item_name: "${task}") { id } }`)
        }
    })
}

// Event listener -> Every change in the "Task" collection will update the list of firestore tasks in the app html
var unsubscribe = taskRef.onSnapshot(querySnapshot => {
    const firestoreItems = querySnapshot.docs.map( doc => {
        firestoreItemsList.push(doc.data().name);
        return `<li>${doc.data().name}</li>`
    });
    firestoreTasksList.innerHTML = firestoreItems.join('');
})

// Function that reads the tasks from monday.com (The board id is hard coded)
let updateMondayTasksView = function() {
    monday.api(`query { items { name, state, board { id } } }`).then(res => {
        const mondayItems = res.data.items.map( item => {
            let boardID = item.board.id
            let itemStatus = item.state
            if (boardID === "874083556" & itemStatus === "active") {
                mondayItemsList.push(item.name)
                return `<li>${item.name}</li>`
            }
        });
        mondayTasksList.innerHTML = mondayItems.join('');
      });
}

updateMondayTasksView();

// Event listener to update the list of monday tasks in the app html - Not working yet
// monday.listen(['itemIds', 'events'], updateMondayTasksView())

