const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addTaskBtn = document.getElementById("add-task");
const taskBody = document.getElementById("task-body");
const deleteAllBtn = document.getElementById("delete-all");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

let todos = [];
let currentFilter = "all"; //default filter

//Add Task
addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (taskText === "" || taskDate === "") {
    alert("Task dan tanggal wajib diisi!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    completed: false
  };

  todos.push(newTask);
  renderTasks(currentFilter);

  taskInput.value = "";
  dateInput.value = "";
});

//Render Tasks
function renderTasks(filter = "all"){
  taskBody.innerHTML = "";
  currentFilter = filter;

  let filteredTodos = todos.filter(todo => {
    if(filter === "completed"){
        return todo.completed;
    }
    if(filter === "pending"){
        return !todo.completed;
    }
    return true;
  });

  filteredTodos.forEach(todo =>{
    const tr = document.createElement("tr");
    if (todo.completed) tr.classList.add("completed");

    tr.innerHTML = `
      <td>${todo.text}</td>
      <td>${todo.date}</td>
      <td class="status">${todo.completed ? "Completed" : "Pending"}</td>
      <td class="actions">
        <button class="complete-btn">✔</button>
        <button class="edit-btn">✎</button>
        <button class="delete-btn">✖</button>
      </td>
    `;

    //Complete toggle
    tr.querySelector(".complete-btn").addEventListener("click", () => {
      todo.completed = !todo.completed;
      renderTasks(currentFilter);
    });

    //Delete single
    tr.querySelector(".delete-btn").addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      renderTasks(currentFilter);
    });

    //Edit
    tr.querySelector(".edit-btn").addEventListener("click", () => {
        //Ganti isi row jadi form edit
        tr.innerHTML = `
          <td><input type="text" value="${todo.text}" class="edit-text"></td>
          <td><input type="date" value="${todo.date}" class="edit-date"></td>
          <td>${todo.completed ? "Completed" : "Pending"}</td>
          <td class="actions">
            <button class="save-btn">✔</button>
            <button class="cancel-btn">✖</button>
          </td>
        `;

        //Save perubahan
        tr.querySelector(".save-btn").addEventListener("click", () => {
            const newText = tr.querySelector(".edit-text").value.trim();
            const newDate = tr.querySelector(".edit-date").value;

            if(newText !== "" && newDate !== ""){
                todo.text = newText;
                todo.date = newDate;
            }
            renderTasks();
        });

        //Batal edit
        tr.querySelector(".cancel-btn").addEventListener("click", () => {
            renderTasks();
        });
    });

    taskBody.appendChild(tr);
  });

  updateProgress();
}

//Delete All
deleteAllBtn.addEventListener("click", () => {
  if(todos.length === 0){
    alert("No tasks to delete!");
    return;
  }
  const confirmDelete = confirm("Are you sure you want to delete all tasks?");
  if(confirmDelete){
    todos = [];
    renderTasks(currentFilter);
  }
});

//Dropdown Filter Event
document.querySelectorAll('.dropdown-content a').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const filter = this.getAttribute('data-filter');
    renderTasks(filter);
  });
});

//Update Progress
function updateProgress(){
  if(todos.length === 0){
    progressText.textContent = "Progress: 0%";
    progressFill.style.width = "0%";
    return;
  }

  const completed = todos.filter(t => t.completed).length;
  const percent = Math.round((completed / todos.length) * 100);

  progressText.textContent = `Progress: ${percent}%`;
  progressFill.style.width = percent + "%";
}