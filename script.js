
const DOMstrings = {
  description: document.querySelector('.description'),
  date: document.querySelector('.date'),
  time: document.querySelector('.time'),
  save: document.querySelector('.sub-btn'),
  list: document.querySelector('.to-do-list')
}


const state = {};

class TodoInput {
  constructor() {
    this.items = [];
  }
  addList(description, date, time) {
    this.item = {
      description,
      date,
      time,
      id: createId()
    }
    this.items.push(this.item);
    return this.item;
  }
  persistData() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }
  readStorage() {
    const storage = JSON.parse(localStorage.getItem('items'));
    if (storage) this.items = storage;

  }

}




//Render Todolist to UI
const renderToDoList = (item) => {

  const markup = `
  <li class="to-do" data-id=${item.id}>
    <button class="to-do-check" data-id=${item.id}>
      <svg>
        <use href="icons.svg#icon-check"></use>
      </svg>
    </button>
    <h3 class="to-do-des">${item.description}</h3>
    <h3 class="to-do-day">${dateFormat(item.date)}</h3>
    <h5 class="to-do-time">${timeFormat(item.time)}</h5>
    <button class="delete-btn">x</button>
  </li>
  `;
  document.querySelector('.to-do-list-main').insertAdjacentHTML('beforebegin', markup);
}

//To-do controller
const Todolist = () => {
  if (DOMstrings.description.value && DOMstrings.date.value && DOMstrings.time.value) {
    //Create new list object
    if (!state.list) state.list = new TodoInput();

    //add to-dos to list
    const item = state.list.addList(DOMstrings.description.value, DOMstrings.date.value, DOMstrings.time.value);

    //persist data
    state.list.persistData();

    //render to-do to UI
    renderToDoList(state.list.item);

    //Calculate total number of To-dos
    totTodo();

    //Clear the input fields
    clearInput();
  }

}

//Create Unique id for each to-do
const createId = () => {
  return Math.random().toString(36).substr(2, 9);
}

//Save btn handling
DOMstrings.save.addEventListener('click', el => {
  el.preventDefault();
  Todolist();
});

//Delete to-do from UI
const deleteToDo = (Id) => {
  const item = document.querySelector(`[data-id="${Id}"]`);
  if (item) item.parentElement.removeChild(item);
}

//Clear Input fields
const clearInput = () => {
  DOMstrings.description.value = '';
  DOMstrings.date.value = '';
  DOMstrings.time.value = '';
}

//Delete and check uncheck To-dos
DOMstrings.list.addEventListener('click', e => {
  const id = e.target.closest('.to-do').dataset.id;
  //Delete Todos
  if (e.target.matches('.delete-btn')) {

    //Delete To-do from list
    const index = state.list.items.findIndex(el => el.id === id);
    //[2,3,4] slice(0,1) -> returns 2 -> array:[2,3,4]
    //[2,3,4] splice(1,1) -> returns 3 -> array:[2,4]
    state.list.items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(state.list.items));


    //Update total number of To-dos after deletion
    totTodo();
    
    //Delete To-do from UI
    deleteToDo(id);
  }

  //Check & Uncheck
  if (e.target.matches('.to-do-check , .to-do-check *')) {

    // document.querySelector('.to-do').classList.toggle('font-style');
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) item.classList.toggle('font-style');
  }
});


//Format dates
const dateFormat = (date) => {
  let newDate = date.split('-');
  let t;
  t = newDate[0];
  newDate[0] = newDate[2];
  newDate[2] = t;
  return newDate.join('-');
}

//Time format
const timeFormat = (time) => {
  let newTime = time.split(':');
  if (newTime[0] > '12') {
    newTime = `${newTime[0] % 12}:${newTime[1]} PM`;
  } else if (newTime[0] == '00') {
    newTime = `12:${newTime[1]} AM`;
  } else if (newTime[0] == '12') {
    newTime = `12:${newTime[1]} PM`;
  } else {
    newTime = `${newTime[0]}:${newTime[1]} AM`;
  }
  return newTime;
}

//Total number of TO-dos
const totTodo = () => {
  let length = JSON.parse(localStorage.getItem('items')) ? JSON.parse(localStorage.getItem('items')).length : 0;
  document.querySelector('.to-do-number').innerHTML = length;
}

//Set local storage
const setLocalstorage = () => {
  state.list = new TodoInput();
  state.list.readStorage();
  state.list.items.forEach(el => {
    renderToDoList(el);
  });
  totTodo();
}

//Show To-dos after reload
window.addEventListener('load', e => {
  setLocalstorage();
});



