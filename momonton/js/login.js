const nameForm = document.getElementById("name-form");
const nameInput = nameForm.querySelector("input");
const emailForm = document.getElementById("email-form");
const emailInput = emailForm.querySelector("input");
const logoutForm = document.getElementById("logout-form");
const HIDDEN_CLASSNAME = "hidden";
const CURRENT_USER_KEY = "current user";
const PREVIOUS_USERS_KEY = "previous user";

let user = getSavedCurrentUser();
let members = getSavedMembers();

function getSavedCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || [];
    } catch {
        return [];
    }
}

function getSavedMembers() {
    try {
        return JSON.parse(localStorage.getItem(PREVIOUS_USERS_KEY)) || [];
    } catch {
        return [];
    }
}

function setUserValue(type, value) {
    const savedValue = user.find((entry) => entry.type === type);

    if (savedValue) {
        savedValue.value = value;
        return;
    }

    user.push({ type, value });
}

function getUserValue(type) {
    const savedValue = user.find((entry) => entry.type === type);
    return savedValue ? savedValue.value.trim() : "";
}

function getCurrentUserId() {
    const email = getUserValue("email-form").toLowerCase();
    const name = getUserValue("name-form").toLowerCase();

    return email || name || "guest";
}

function getCurrentTodoKey() {
    return `todos:${getCurrentUserId()}`;
}

function saveMembers() {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    const member = {
        id: getCurrentUserId(),
        name: getUserValue("name-form"),
        email: getUserValue("email-form")
    };
    const savedIndex = members.findIndex((savedMember) => savedMember.id === member.id);

    if (savedIndex >= 0) {
        members[savedIndex] = member;
    } else {
        members.push(member);
    }

    localStorage.setItem(PREVIOUS_USERS_KEY, JSON.stringify(members));
}

function showNextForm(caller, nextElement) {
    caller.classList.add(HIDDEN_CLASSNAME);
    nextElement.classList.remove(HIDDEN_CLASSNAME);

    if (nextElement.id === "todo-form") {
        const toDoList = document.getElementById("todo-list");

        toDoList.classList.remove(HIDDEN_CLASSNAME);
        logoutForm.classList.remove(HIDDEN_CLASSNAME);
    }
}

function onLoginSubmit(event) {
    event.preventDefault();

    const caller = event.target;
    const nextElement = caller.nextElementSibling;
    const value = caller.querySelector("input").value;

    setUserValue(caller.id, value);
    showNextForm(caller, nextElement);

    if (nextElement.id === "todo-form") {
        saveMembers();
        window.dispatchEvent(new CustomEvent("userChanged"));
    }
}

function onLogoutClick(event) {
    event.preventDefault();
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload();
}

if (user.length > 0) {
    nameForm.classList.add(HIDDEN_CLASSNAME);
    emailForm.classList.add(HIDDEN_CLASSNAME);
}

nameForm.addEventListener("submit", onLoginSubmit);
emailForm.addEventListener("submit", onLoginSubmit);
logoutForm.addEventListener("submit", onLogoutClick);
