const toDoForm = document.getElementById("todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");
const LEGACY_TODOS_KEY = "todos";

let toDos = [];

function hasCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY) !== null && getCurrentUserId() !== "guest";
}

function getSavedToDos() {
    const todoKey = getCurrentTodoKey();
    const savedToDos = localStorage.getItem(todoKey);
    const legacyToDos = localStorage.getItem(LEGACY_TODOS_KEY);

    if (savedToDos === null && legacyToDos !== null) {
        localStorage.setItem(todoKey, legacyToDos);
        localStorage.removeItem(LEGACY_TODOS_KEY);
        return parseToDos(legacyToDos);
    }

    return parseToDos(savedToDos);
}

function parseToDos(savedToDos) {
    if (savedToDos === null) {
        return [];
    }

    try {
        return JSON.parse(savedToDos);
    } catch {
        return [];
    }
}

function saveToDos() {
    localStorage.setItem(getCurrentTodoKey(), JSON.stringify(toDos));
}

function updateToDoListVisibility() {
    if (!hasCurrentUser() || toDoList.childElementCount === 0) {
        toDoList.style.display = "none";
        return;
    }

    toDoList.style.display = "block";
}

function paintToDo(newTodo) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const button = document.createElement("button");

    li.id = newTodo.id;
    p.innerText = newTodo.text;
    button.innerText = "delete";
    button.addEventListener("click", deleteToDo);

    li.appendChild(p);
    li.appendChild(button);
    toDoList.appendChild(li);
    updateToDoListVisibility();
}

function loadToDos() {
    toDoList.innerHTML = "";
    toDos = [];

    if (!hasCurrentUser()) {
        updateToDoListVisibility();
        return;
    }

    toDos = getSavedToDos();
    toDos.forEach(paintToDo);
    updateToDoListVisibility();
}

function onToDoSubmit(event) {
    event.preventDefault();

    const newTodo = toDoInput.value;
    const newTodoObj = {
        text: newTodo,
        id: Date.now()
    };

    toDoInput.value = "";
    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
}

function deleteToDo(event) {
    const li = event.target.parentElement;

    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
    updateToDoListVisibility();
}

if (hasCurrentUser()) {
    toDoForm.classList.remove(HIDDEN_CLASSNAME);
    toDoList.classList.remove(HIDDEN_CLASSNAME);
    logoutForm.classList.remove(HIDDEN_CLASSNAME);
}

toDoForm.addEventListener("submit", onToDoSubmit);
window.addEventListener("userChanged", loadToDos);
loadToDos();
