console.log("✅ app.js loaded");
const API_BASE_URL = "https://internship-task-tracker-backend.onrender.com";

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

/* New inputs */
const taskPriorityInput = document.getElementById("taskPriority");
const taskDueDateInput = document.getElementById("taskDueDate");

/* Dashboard counters */
const totalCountEl = document.getElementById("totalCount");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const progressCountEl = document.getElementById("progressCount");

/* Filters */
const filterBtns = document.querySelectorAll(".filter-btn");

/* Dark mode */
const darkToggle = document.getElementById("darkToggle");

/* =========================
   INITIAL LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("tasktracker_user");
    if (savedUser) {
        loginUser(JSON.parse(savedUser));
    }

    const darkEnabled = localStorage.getItem("tasktracker_dark") === "true";
    if (darkEnabled) {
        document.body.classList.add("dark");
        if (darkToggle) darkToggle.textContent = "☀️";
    }
});

/* =========================
   DARK MODE TOGGLE
========================= */
darkToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const enabled = document.body.classList.contains("dark");
    localStorage.setItem("tasktracker_dark", enabled);
    darkToggle.textContent = enabled ? "☀️" : "🌙";
});

/* =========================
   REGISTER USER
========================= */
registerBtn?.addEventListener("click", async () => {
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Name and email required");
        return;
    }

    const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    const data = await res.json();

    if (res.ok && data.success && data.user) {
        loginUser(data.user);
        alert("Registered & logged in!");
        return;
    }

    if (data.message === "User already exists") {
        await loginExistingUser(email);
        return;
    }

    alert("Registration failed");
});

/* =========================
   LOGIN
========================= */
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) return alert("Email required");
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
    logoutBtn.classList.remove("hidden");

    dashboardSection.classList.remove("hidden");
    taskSection.classList.remove("hidden");
    taskListSection.classList.remove("hidden");

    fetchTasks();
}

async function loginExistingUser(email) {
    const res = await fetch(`${API_BASE_URL}/api/users`);
    const data = await res.json();
    const user = data.users.find(u => u.email === email);

    if (!user) {
        alert("User not found");
        return;
    }

    loginUser(user);
}

/* =========================
   ADD TASK (FINAL & FIXED)
========================= */
taskForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();

    // ✅ FIX: read values safely
    const priority = taskPriorityInput
        ? taskPriorityInput.value
        : "medium";

    const dueDate =
        taskDueDateInput && taskDueDateInput.value !== ""
            ? taskDueDateInput.value
            : null;

    /* =========================
       VALIDATIONS
    ========================= */
    if (!title) {
        alert("Task title is required");
        return;
    }

    if (!["low", "medium", "high"].includes(priority)) {
        alert("Invalid priority selected");
        return;
    }

    /* =========================
       DEBUG (OPTIONAL - REMOVE LATER)
    ========================= */
    console.log("Adding task:", {
        title,
        description,
        priority,
        dueDate,
        userId: currentUserId
    });

    /* =========================
       API CALL
    ========================= */
    try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                priority,
                dueDate,
                userId: currentUserId
            })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            alert("Failed to add task");
            return;
        }

        // ✅ Reset form properly
        taskForm.reset();

        // Optional: reset priority to medium explicitly
        if (taskPriorityInput) {
            taskPriorityInput.value = "medium";
        }

        fetchTasks();

    } catch (error) {
        console.error("Add task error:", error);
        alert("Something went wrong while adding task");
    }
});

/* =========================
   FETCH TASKS
========================= */
async function fetchTasks() {
    taskList.innerHTML = "";

    const res = await fetch(`${API_BASE_URL}/api/tasks/${currentUserId}`);
    const data = await res.json();

    if (!data.success) {
        taskList.innerHTML = "<p>Error loading tasks</p>";
        updateCounters([]);
        return;
    }

    allTasks = data.tasks;
    updateCounters(allTasks);
    applyFilter();
}

/* =========================
   FILTERS
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

    const filtered =
        activeFilter === "all"
            ? allTasks
            : allTasks.filter(t => t.status === activeFilter);

    if (filtered.length === 0) {
        taskList.innerHTML = "<p>No tasks found.</p>";
        return;
    }

    filtered.forEach(renderTask);
}

/* =========================
   DASHBOARD
========================= */
function updateCounters(tasks) {
    totalCountEl.textContent = tasks.length;
    pendingCountEl.textContent = tasks.filter(t => t.status === "pending").length;
    completedCountEl.textContent = tasks.filter(t => t.status === "completed").length;
    progressCountEl.textContent = tasks.filter(t => t.status === "in-progress").length;
}

/* =========================
   RENDER TASK (FINAL)
========================= */
function renderTask(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";

    const status = task.status || "pending";
    const priority = task.priority ? task.priority : "medium";

    const createdDate = new Date(task.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue =
        dueDateObj && status !== "completed" && dueDateObj < new Date();

    const dueDateText = dueDateObj
        ? dueDateObj.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
          })
        : "No due date";

    taskDiv.innerHTML = `
        <div class="task-header">
            <h4>${task.title}</h4>

            <div class="task-badges">
                <span class="task-status ${status}">
                    ${status.toUpperCase()}
                </span>

                <span class="task-priority ${priority}">
                    ${priority.toUpperCase()}
                </span>
            </div>
        </div>

        <p class="task-desc">${task.description || "No description"}</p>

        <p class="task-date ${isOverdue ? "overdue" : ""}">
            🕒 Added: ${createdDate}<br/>
            📅 Due: ${dueDateText}
            ${isOverdue ? " ⚠️ Overdue" : ""}
        </p>

        <div class="task-actions">
            <button class="edit-btn"
                onclick="editTask('${task._id}', '${task.title}', '${task.description || ""}')">
                Edit
            </button>

            <button class="complete-btn"
                onclick="updateStatus(
                    '${task._id}',
                    '${status === "completed" ? "pending" : "completed"}'
                )">
                Mark ${status === "completed" ? "Pending" : "Completed"}
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