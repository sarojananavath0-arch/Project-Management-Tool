
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addProject() {
    const name = document.getElementById("projectName").value.trim();

    if (!name) {
        alert("Please enter a project name.");
        return;
    }

    projects.push({
        id: Date.now(),
        name: name
    });

    document.getElementById("projectName").value = "";

    saveData();
    displayAll();
}

function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const assigned = document.getElementById("assignedTo").value.trim();
    const projectId = Number(document.getElementById("projectSelect").value);
    const status = document.getElementById("taskStatus").value;

    if (!name || !assigned || !projectId) {
        alert("Please enter task details and select a project.");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: name,
        assigned: assigned,
        projectId: projectId,
        status: status
    });

    document.getElementById("taskName").value = "";
    document.getElementById("assignedTo").value = "";

    saveData();
    displayAll();
}

function updateStatus(id, newStatus) {
    const task = tasks.find(task => task.id === id);

    if (task) {
        task.status = newStatus;
        saveData();
        displayAll();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
    displayAll();
}

function deleteProject(id) {
    projects = projects.filter(project => project.id !== id);
    tasks = tasks.filter(task => task.projectId !== id);
    saveData();
    displayAll();
}

function displayProjects() {
    const projectList = document.getElementById("projects");
    const select = document.getElementById("projectSelect");

    projectList.innerHTML = "";
    select.innerHTML = '<option value="">Select Project</option>';

    projects.forEach(project => {
        projectList.innerHTML += `
            <div class="project">
                <strong>${escapeHTML(project.name)}</strong>
                <button class="delete-btn"
                    onclick="deleteProject(${project.id})">
                    Delete
                </button>
            </div>
        `;

        select.innerHTML += `
            <option value="${project.id}">
                ${escapeHTML(project.name)}
            </option>
        `;
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function displayTasks() {
    const todo = document.getElementById("todoTasks");
    const progress = document.getElementById("progressTasks");
    const completed = document.getElementById("completedTasks");

    todo.innerHTML = "";
    progress.innerHTML = "";
    completed.innerHTML = "";

    tasks.forEach(task => {
        const project = projects.find(
            project => project.id === task.projectId
        );

        const projectName = project ? project.name : "Unknown Project";

        const taskHTML = `
            <div class="task">
                <strong>${escapeHTML(task.name)}</strong>
                <p>Assigned to: ${escapeHTML(task.assigned)}</p>
                <p>Project: ${escapeHTML(projectName)}</p>

                <select onchange="updateStatus(${task.id}, this.value)">
                    <option value="To Do" ${task.status === "To Do" ? "selected" : ""}>To Do</option>
                    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                </select>

                <button class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete Task
                </button>
            </div>
        `;

        if (task.status === "To Do") {
            todo.innerHTML += taskHTML;
        } else if (task.status === "In Progress") {
            progress.innerHTML += taskHTML;
        } else {
            completed.innerHTML += taskHTML;
        }
    });
}

function displayAll() {
    displayProjects();
    displayTasks();
}

displayAll();
