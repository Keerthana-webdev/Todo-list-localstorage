const STORAGE_KEY = "tasks";

// ---------- State (one place) ----------
let tasks = load();      // each task: { id: 1, text: "Buy milk", done: false }
let filter = "all";      // "all" | "active" | "done"

// ---------- DOM references ----------
const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
const clearBtn = document.getElementById("clear");
const filterButtons = document.querySelectorAll(".filter");

// ---------- Storage ----------
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    // Keep only well-formed tasks so corrupted data never breaks the page
    return data.filter(function (t) {
      return t && typeof t.id === "number" && typeof t.text === "string" && typeof t.done === "boolean";
    });
  } catch (e) {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    // Storage can be full or blocked (private mode); the app still works for this session
  }
}

// ---------- Helpers ----------
function newId() {
  let id = Date.now();
  while (tasks.some(function (t) { return t.id === id; })) id++;
  return id;
}

function visibleTasks() {
  if (filter === "active") return tasks.filter(function (t) { return !t.done; });
  if (filter === "done") return tasks.filter(function (t) { return t.done; });
  return tasks;
}

// ---------- Render: rebuild the list from the array ----------
function render() {
  list.innerHTML = "";

  visibleTasks().forEach(function (t) {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.className = t.done ? "task done" : "task";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.done;
    check.dataset.action = "toggle";
    check.setAttribute("aria-label", "Mark as done: " + t.text);

    const label = document.createElement("span");
    label.className = "task-text";
    label.textContent = t.text;            // textContent is safe against injected HTML

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.textContent = "Delete";
    del.dataset.action = "delete";
    del.setAttribute("aria-label", "Delete task: " + t.text);

    li.append(check, label, del);
    list.append(li);
  });

  // Counter: always based on ALL tasks, not just the filtered view
  const left = tasks.filter(function (t) { return !t.done; }).length;
  count.textContent = left + (left === 1 ? " task left" : " tasks left");

  // Clear completed is only useful when something is done
  clearBtn.disabled = !tasks.some(function (t) { return t.done; });

  // Empty state message
  const shown = visibleTasks().length;
  if (shown === 0) {
    if (tasks.length === 0) empty.textContent = "No tasks yet. Add your first one above.";
    else if (filter === "active") empty.textContent = "Nothing left to do. Nice work.";
    else empty.textContent = "No completed tasks yet.";
    empty.hidden = false;
  } else {
    empty.hidden = true;
  }

  // Filter buttons
  filterButtons.forEach(function (btn) {
    const on = btn.dataset.filter === filter;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", String(on));
  });
}

// ---------- Events ----------

// Add a task (click on Add, or press Enter in the input: both submit the form)
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) {                              // ignore empty text
    input.value = "";
    input.focus();
    return;
  }
  tasks.push({ id: newId(), text: text, done: false });
  input.value = "";
  save();
  render();
  input.focus();
});

// Keyboard: Escape clears the input box
input.addEventListener("keydown", function (e) {
  if (e.key === "Escape") input.value = "";
});

// Event delegation: one click listener on the list handles toggle and delete
list.addEventListener("click", function (e) {
  const action = e.target.dataset.action;
  if (!action) return;

  const id = Number(e.target.closest("li").dataset.id);

  if (action === "delete") {
    tasks = tasks.filter(function (t) { return t.id !== id; });
  }
  if (action === "toggle") {
    tasks.forEach(function (t) {
      if (t.id === id) t.done = !t.done;
    });
  }
  save();
  render();
});

// Filters: All, Active, Done
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  save();
  render();
});

// ---------- Start ----------
render();