// Define UI Variables 
const taskInput = document.querySelector('#task') //the task input text field
const form = document.querySelector('#task-form') //The form at the top
const filter = document.querySelector('#filter') //the task filter text field
const taskList = document.querySelector('.collection') //The UL
const clearBtn = document.querySelector('.clear-tasks') //the all task clear button

const reloadIcon = document.querySelector('.fa') //the reload button at the top navigation 

// Add Event Listener  [Form , clearBtn and filter search input ]
let DB;
document.addEventListener('DOMContentLoaded', () =>{
    let TasksDB = indexedDB.open("tasks", 1);

    TasksDB.onsuccess = function(e) { //code here 
        console.log('DataBase created');
     };
     TasksDB.onerror = function(e) {  // code here  
    console.log('Some Error happened');};

    TasksDB.onupgradeneeded = function(e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store, 
        // keypath is going to be the Indexes
        let objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

        // createindex: 1) field name 2) keypath 3) options
        objectStore.createIndex('taskname', 'taskname', { unique: false });

        console.log('Database ready and fields created!');
    }

    form.addEventListener("Submit",addNewTask)
    function addNewTask(e) {
        
      // create a new object with the form info
      e.preventDefault();
      let newTask = {
          taskname: taskInput.value
      }
      // Insert the object into the database 
      let transaction = DB.transaction(['tasks'], 'readwrite');
      let objectStore = transaction.objectStore('tasks');

      let request = objectStore.add(newTask);
      // on success
      request.onsuccess = () => {
          form.reset();
      }
      request.oncomplete = () => {
          console.log('New appointment added');
          displayTaskList();
      }
      request.onerror = () => { console.log('There was an error, try again!'); }
  }



  function displayTaskList() {
    // clear the previous task list
    while (taskList.firstChild) {   taskList.removeChild(taskList.firstChild);}

    // create the object store
    let objectStore = DB.transaction('tasks').objectStore('tasks');

    objectStore.openCursor().onsuccess = function(e) {
        // assign the current cursor
        let cursor = e.target.result;

        if (cursor) {
                  
            li.setAttribute('data-task-id', cursor.value.id);
            // Create text node and append it 
            li.appendChild(document.createTextNode(cursor.value.taskname));
            
            cursor.continue();
        }
    }
}




  
})