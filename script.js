const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

function addTask() {
    const taskText = inputBox.value.trim();

    if (taskText === "") {
        alert("You must write something!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveData();
    renderTasks(currentFilter);
    inputBox.value = "";
}

function renderTasks(filter = "all") {
    currentFilter = filter;
    listContainer.innerHTML = "";

    let filteredTasks = tasks;

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } 
    else if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("checked");

        li.addEventListener("click", () => {
            task.completed = !task.completed;
            saveData();
            renderTasks(currentFilter);
        });

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;

        const btnContainer = document.createElement("div");
        btnContainer.className = "btn-container";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = (e) => {
            e.stopPropagation();
            const newText = prompt("Edit task:", task.text);
            if (newText !== null && newText.trim() !== "") {
                task.text = newText.trim();
                saveData();
                renderTasks(currentFilter);
            }
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            tasks = tasks.filter(t => t.id !== task.id);
            saveData();
            renderTasks(currentFilter);
        };

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(btnContainer);

        listContainer.appendChild(li);
    });
}

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadData() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        renderTasks(button.dataset.filter);
    });
});

inputBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

loadData();
renderTasks();