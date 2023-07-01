let toggle = document.querySelector(".toggle");
let darkMode = localStorage.getItem("dark-mode");
let tasksInput = document.querySelector(".input input");
let emptyMsg = document.querySelector(".empty-state");
let todoContainer = document.querySelector(".todo-container");
let taskUl = document.querySelector(".todo-list");
let itemsLeft = document.querySelector(".left-items span");
let clearCompletedBtn = document.querySelector(".clear-completed");
let filterBtns = Array.from(
  document.querySelectorAll(".filter-buttons .filter-button")
);

let tasksArr = [];
let starIndex;

if (localStorage.getItem("tasks")) {
  tasksArr = JSON.parse(localStorage.getItem("tasks"));
}

if (darkMode === "enable") {
  enableDarkMode();
}

toggle.addEventListener("click", () => {
  darkMode = localStorage.getItem("dark-mode");
  if (darkMode === "enable") {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});


emptyState();

getData();

tasksInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (tasksInput.value !== "") {
      addtaskToArr(tasksInput.value);
      tasksInput.value = "";
    }
  }
});

taskUl.addEventListener("click", (e) => {
  if (e.target.parentNode.classList.contains("delete")) {
    deleteItem(e.target.parentNode.parentNode.getAttribute("data-id"));

    e.target.parentNode.parentNode.remove();
  }

  if (
    e.target.parentNode.classList.contains("todo") ||
    e.currentTarget.classList.contains("todo")
  ) {
    statusCheck(e.target.parentNode.getAttribute("data-id"));

    e.target.parentNode.classList.toggle("checked");
  }
});

clearCompletedBtn.addEventListener("click", () => {
  tasksArr = tasksArr.filter((task) => {
    return task.completed == false;
  });
  addTasksToPage(tasksArr);
  addDataToLocal(tasksArr);
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");
    if (e.target.classList.contains("non-completed")) {
      document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "none";
      });
      document.querySelectorAll(".todo:not(.checked)").forEach((todo) => {
        todo.style.display = "flex";
      });
    } else if (e.target.classList.contains("completed")) {
      document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "flex";
      });
      document.querySelectorAll(".todo:not(.checked)").forEach((todo) => {
        todo.style.display = "none";
      });
    } else {
      document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "flex";
      });
    }
  });
});

taskUl.addEventListener("dragstart", dragStart);
taskUl.addEventListener("dragover", dragOver);
taskUl.addEventListener("drop", drop);

function enableDarkMode() {
  document.body.classList.add("dark-mode");
  document.querySelector(".toggle img").src = "./images/icon-sun.svg";
  localStorage.setItem("dark-mode", "enable");
}

function disableDarkMode() {
  document.body.classList.remove("dark-mode");
  document.querySelector(".toggle img").src = "./images/icon-moon.svg";
  localStorage.setItem("dark-mode", "disable");
}

function addtaskToArr(taskText) {
  let task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  tasksArr.push(task);
  addTasksToPage(tasksArr);
  addDataToLocal(tasksArr);
}

function addTasksToPage(tasksArr) {
  let index = 0;
  taskUl.innerHTML = "";
  itemsLeft.textContent = tasksArr.length;
  console.log("not emty");
  console.log(tasksArr);
  tasksArr.forEach((task) => {
    let li = document.createElement("li");
    li.className = "todo";
    li.setAttribute("data-id", task.id);
    li.setAttribute("data-index", index++);
    li.setAttribute("draggable", true);

    if (task.completed) {
      li.className = "todo checked";
    }

    let checkDiv = document.createElement("div");
    checkDiv.className = "check";
    checkDiv.innerHTML = '<img src="./images/icon-check.svg" alt="" />';

    let taskText = document.createElement("p");
    taskText.className = "text";
    taskText.appendChild(document.createTextNode(task.title));

    let deleteSpan = document.createElement("span");
    deleteSpan.className = "delete";
    deleteSpan.innerHTML = '<img src="./images/icon-cross.svg" alt="" >';

    li.appendChild(checkDiv);
    li.appendChild(taskText);
    li.appendChild(deleteSpan);

    taskUl.appendChild(li);
  });
  emptyState();
}

function addDataToLocal(tasksArr) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function getData() {
  let data = localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addTasksToPage(tasks);
  }
}

function deleteItem(taskId) {
  tasksArr = tasksArr.filter((task) => {
    return task.id != taskId;
  });
  addDataToLocal(tasksArr);
  itemsLeft.textContent = tasksArr.length;
  emptyState();
}

function statusCheck(taskId) {
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == taskId) {
      tasksArr[i].completed == false
        ? (tasksArr[i].completed = true)
        : (tasksArr[i].completed = false);
    }
  }

  addDataToLocal(tasksArr);
}

function dragStart(e) {
  starIndex = +e.target.getAttribute("data-index");
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  let endIndex = e.target.getAttribute("data-index");

  if (e.target.classList.contains("todo")) {
    let temp = tasksArr[starIndex];
    tasksArr[starIndex] = tasksArr[endIndex];
    tasksArr[endIndex] = temp;

    addDataToLocal(tasksArr);
    addTasksToPage(tasksArr);
  }
}

function emptyState() {
  if (tasksArr.length === 0) {
    todoContainer.classList.add("empty");

    emptyMsg.innerHTML = `
    <i class= 'fa-solid fa-file'></i>
    <p>No to-do items found.</p>
    `;
  } else {
    todoContainer.classList.remove("empty");
  }
}
