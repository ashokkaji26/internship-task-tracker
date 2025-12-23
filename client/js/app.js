const API_BASE_URL = "http://localhost:4000";

let currentUserId = null;
let allTasks = [];
let activeFilter = "all";

/* =========================
   DOM ELEMENTS
========================= */
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const taskForm = document.getElementById("taskForm");
const taskSection = document.getElementById("taskSection");
const taskListSection = document.getElementById("taskListSection");
const dashboardSection = document.getElementById("dashboardSection");

const userStatus = document.getElementById("userStatus");
const taskList = document.getElementById("taskList");

/* Dashboard counters */
const totalCountEl = document.getElementById("totalCount");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const progressCountEl = document.getElementById("progressCount");

/* Filters */
const filterBtns = document.querySelectorAll(".filter-btn");

/* Dark mode toggle */
const darkToggle = document.getElementById("darkToggle");

/* =========================
   INITIAL LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
    /* Persist login */
    const savedUser = localStorage.getItem("tasktracker_user");
    if (savedUser) {
        loginUser(JSON.parse(savedUser));
    }

    /* Persist dark mode */
    const darkModeEnabled = localStorage.getItem("tasktracker_dark") === "true";
    if (darkModeEnabled) {
        document.body.classList.add("dark");
        if (darkToggle) darkToggle.textContent = "☀️";
    }
});

/* =========================
   DARK MODE TOGGLE
========================= */
if (darkToggle) {
    darkToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        const enabled = document.body.classList.contains("dark");
        localStorage.setItem("tasktracker_dark", enabled);

        darkToggle.textContent = enabled ? "☀️" : "🌙";
    });
}

/* =========================
   REGISTER USER
========================= */
registerBtn?.addEventListener("click", async () => {
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Name and email required for registration");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
            loginUser(data.user);
            alert("Registered & logged in successfully!");
            return;
        }

        if (data.message === "User already exists") {
            await loginExistingUser(email);
            alert("User already exists. Logged in successfully!");
            return;
        }

        alert(data.message || "Registration failed");

    } catch (error) {
        console.error("Registration error:", error);
        alert("Something went wrong. Please try again.");
    }
});

/* =========================
   LOGIN USER
========================= */
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) {
        alert("Email required to login");
        return;
    }
    await loginExistingUser(email);
});

/* =========================
   LOGOUT
========================= */
logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("tasktracker_user");
    location.reload();
});

/* =========================
   LOGIN HELPERS
========================= */
function loginUser(user) {
    currentUserId = user._id;
    localStorage.setItem("tasktracker_user", JSON.stringify(user));

    userStatus.textContent = `Logged In: ${user.name}`;
    logoutBtn?.classList.remove("hidden");

    dashboardSection?.classList.remove("hidden");
    taskSection?.classList.remove("hidden");
    taskListSection?.classList.remove("hidden");

    fetchTasks();
}

async function loginExistingUser(email) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const data = await res.json();

        const user = data.users.find(u => u.email === email);
        if (!user) {
            alert("User not found. Please register first.");
            return;
        }

        loginUser(user);
        alert("Logged in successfully!");

    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed");
    }
}

/* =========================
   ADD TASK
========================= */
taskForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();

    if (!title) {
        alert("Task title required");
        return;
    }

    await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, userId: currentUserId })
    });

    taskForm.reset();
    fetchTasks();
});

/* =========================
   FETCH TASKS
========================= */
async function fetchTasks() {
    taskList.innerHTML = "";

    const res = await fetch(`${API_BASE_URL}/api/tasks/${currentUserId}`);
    const data = await res.json();

    if (!data.success || !Array.isArray(data.tasks)) {
        taskList.innerHTML = "<p>Error loading tasks.</p>";
        updateCounters([]);
        return;
    }

    allTasks = data.tasks;
    updateCounters(allTasks);
    applyFilter();
}

/* =========================
   FILTER LOGIC
========================= */
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        activeFilter = btn.dataset.filter;
        applyFilter();
    });
});

function applyFilter() {
    taskList.innerHTML = "";

    let filtered = allTasks;
    if (activeFilter !== "all") {
        filtered = allTasks.filter(t => t.status === activeFilter);
    }

    if (filtered.length === 0) {
        taskList.innerHTML = "<p>No tasks found.</p>";
        return;
    }

    filtered.forEach(renderTask);
}

/* =========================
   DASHBOARD COUNTERS
========================= */
function updateCounters(tasks) {
    totalCountEl.textContent = tasks.length;
    pendingCountEl.textContent = tasks.filter(t => t.status === "pending").length;
    completedCountEl.textContent = tasks.filter(t => t.status === "completed").length;
    progressCountEl.textContent = tasks.filter(t => t.status === "in-progress").length;
}

/* =========================
   RENDER TASK
========================= */
function renderTask(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";

    const status = task.status || "pending";
    const nextStatus = status === "completed" ? "pending" : "completed";

    taskDiv.innerHTML = `
        <div class="task-header">
            <h4>${task.title}</h4>
            <span class="task-status ${status}">
                ${status.toUpperCase()}
            </span>
        </div>

        <p class="task-desc">${task.description || "No description"}</p>

        <div class="task-actions">
            <button class="edit-btn"
                onclick="editTask('${task._id}', '${task.title}', '${task.description || ""}')">
                Edit
            </button>

            <button class="complete-btn"
                onclick="updateStatus('${task._id}', '${nextStatus}')">
                Mark ${nextStatus === "completed" ? "Completed" : "Pending"}
            </button>

            <button class="delete-btn"
                onclick="deleteTask('${task._id}')">
                Delete
            </button>
        </div>
    `;

    taskList.appendChild(taskDiv);
}

/* =========================
   UPDATE STATUS
========================= */
async function updateStatus(taskId, status) {
    await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });

    fetchTasks();
}

/* =========================
   EDIT TASK
========================= */
async function editTask(taskId, oldTitle, oldDesc) {
    const title = prompt("Edit title:", oldTitle);
    if (!title) return;

    const description = prompt("Edit description:", oldDesc);

    await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    fetchTasks();
}

/* =========================
   DELETE TASK
========================= */
async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;

    await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE"
    });

    fetchTasks();
}