console.log("✅ app.js loaded");

const API_BASE_URL = "https://internship-task-tracker-backend.onrender.com";

let currentUserId = null;
let allTasks = [];
let activeFilter = "all";

/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");

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

    const taskPriorityInput = document.getElementById("taskPriority");
    const taskDueDateInput = document.getElementById("taskDueDate");

    const totalCountEl = document.getElementById("totalCount");
    const pendingCountEl = document.getElementById("pendingCount");
    const completedCountEl = document.getElementById("completedCount");
    const progressCountEl = document.getElementById("progressCount");

    const filterBtns = document.querySelectorAll(".filter-btn");
    const darkToggle = document.getElementById("darkToggle");

    if (!registerBtn || !loginBtn) {
        console.error("❌ Register/Login buttons not found");
        return;
    }

    /* =========================
       PERSIST LOGIN
    ========================= */
    const savedUser = localStorage.getItem("tasktracker_user");
    if (savedUser) {
        loginUser(JSON.parse(savedUser));
    }

    /* =========================
       DARK MODE PERSIST
    ========================= */
    const darkEnabled = localStorage.getItem("tasktracker_dark") === "true";
    if (darkEnabled) {
        document.body.classList.add("dark");
        if (darkToggle) darkToggle.textContent = "☀️";
    }

    darkToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const enabled = document.body.classList.contains("dark");
        localStorage.setItem("tasktracker_dark", enabled);
        darkToggle.textContent = enabled ? "☀️" : "🌙";
    });

    /* =========================
       REGISTER
    ========================= */
    registerBtn.addEventListener("click", async () => {
        console.log("🟢 Register clicked");

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

        if (res.ok && data.success) {
            loginUser(data);
            alert("Registered & logged in!");
        } else if (data.message === "User already exists") {
            loginExistingUser(email);
        } else {
            alert(data.message || "Registration failed");
        }
    });

    /* =========================
       LOGIN
    ========================= */
    loginBtn.addEventListener("click", async () => {
        console.log("🟢 Login clicked");

        const email = document.getElementById("email").value.trim();
        if (!email) return alert("Email required");

        loginExistingUser(email);
    });

    /* =========================
       LOGOUT
    ========================= */
    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("tasktracker_user");
        location.reload();
    });

    /* =========================
       ADD TASK
    ========================= */
    taskForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const priority = taskPriorityInput.value;
        const dueDate = taskDueDateInput.value || null;

        if (!title) return alert("Task title required");

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

        taskForm.reset();
        taskPriorityInput.value = "";
        fetchTasks();
    });

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

    /* =========================
       HELPERS
    ========================= */
    async function loginExistingUser(email) {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const data = await res.json();

        const user = data.users.find(u => u.email === email);
        if (!user) return alert("User not found");

        loginUser(user);
    }

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

    async function fetchTasks() {
        taskList.innerHTML = "";
        const res = await fetch(`${API_BASE_URL}/api/tasks/${currentUserId}`);
        const data = await res.json();

        allTasks = data.tasks || [];
        updateCounters(allTasks);
        applyFilter();
    }

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

    function updateCounters(tasks) {
        totalCountEl.textContent = tasks.length;
        pendingCountEl.textContent = tasks.filter(t => t.status === "pending").length;
        completedCountEl.textContent = tasks.filter(t => t.status === "completed").length;
        progressCountEl.textContent = tasks.filter(t => t.status === "in-progress").length;
    }

    function renderTask(task) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";

        const status = task.status;
        const priority = task.priority;
        const createdDate = new Date(task.createdAt).toLocaleDateString("en-IN");
        const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDateObj && status !== "completed" && dueDateObj < new Date();

        taskDiv.innerHTML = `
            <div class="task-header">
                <h4>${task.title}</h4>
                <div class="task-badges">
                    <span class="task-status ${status}">${status.toUpperCase()}</span>
                    <span class="task-priority ${priority}">${priority.toUpperCase()}</span>
                </div>
            </div>

            <p class="task-desc">${task.description || "No description"}</p>

            <p class="task-date ${isOverdue ? "overdue" : ""}">
                🕒 Added: ${createdDate}<br/>
                📅 Due: ${dueDateObj ? dueDateObj.toLocaleDateString("en-IN") : "No due date"}
                ${isOverdue ? " ⚠️ Overdue" : ""}
            </p>

            <div class="task-actions">
                <button class="complete-btn" onclick="updateStatus('${task._id}', '${status === "completed" ? "pending" : "completed"}')">
                    Mark ${status === "completed" ? "Pending" : "Completed"}
                </button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    }

    window.updateStatus = async (id, status) => {
        await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        fetchTasks();
    };

    window.deleteTask = async (id) => {
        if (!confirm("Delete this task?")) return;
        await fetch(`${API_BASE_URL}/api/tasks/${id}`, { method: "DELETE" });
        fetchTasks();
    };
});