function startCounting() {
  const targetDate = new Date("2024-06-26T00:00:00");
  const timeParagraph = document.getElementById("time-since");

  function updateTime() {
    const now = new Date();
    const timeDifference = now - targetDate;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const timeString = `${days}D ${hours}H ${minutes}M ${seconds}S`;

    timeParagraph.textContent = timeString;
  }
  setInterval(updateTime, 1000);
  updateTime();
}

window.onload = startCounting;

async function loadTodos() {
  try {
    const response = await fetch("http:/  /localhost:5500/todos");
    const todos = await response.json();
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = ""; // Clear existing list

    todos.forEach((todoText, index) => {
      const li = document.createElement("li");
      li.textContent = todoText;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Remove";
      deleteButton.onclick = function () {
        removeTodo(index);
      };

      li.appendChild(deleteButton);
      todoList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

async function addTodo() {
  console.log("method started");
  const todoInput = document.getElementById("new-todo");
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("Please enter a to-do item!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5500/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: todoText }),
    });

    if (response.ok) {
      loadTodos(); // Reload todos after adding
      todoInput.value = ""; // Clear input field
    } else {
      console.error("Error adding todo:", await response.text());
    }
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

async function removeTodo(index) {
  // Implement logic to remove a todo item from the server
  // This requires additional backend support to delete items
}

// Initial load of todos
loadTodos();
