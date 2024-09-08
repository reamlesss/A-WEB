function startCounting() {
  const targetDate = new Date("2024-06-26T00:00:00");
  const timeParagraph = document.getElementById("time-since");
  const timeParagraph2 = document.getElementById("big-time-since");

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
    timeParagraph2.textContent = timeString;
  }
  setInterval(updateTime, 1000);
  updateTime();
}

// async function loadTodos() {
//   try {
//     const response = await fetch("http:/localhost:5500/todos");
//     const todos = await response.json();
//     const todoList = document.getElementById("todo-list");
//     todoList.innerHTML = ""; // Clear existing list

//     todos.forEach((todoText, index) => {
//       const li = document.createElement("li");
//       li.textContent = todoText;

//       const deleteButton = document.createElement("button");
//       deleteButton.textContent = "Remove";
//       deleteButton.onclick = function () {
//         removeTodo(index);
//       };

//       li.appendChild(deleteButton);
//       todoList.appendChild(li);
//     });
//   } catch (error) {
//     console.error("Error loading todos:", error);
//   }
// }
const input = document.getElementById("new-todo");
async function setInputPlaceholder() {
  if (input) {
    input.value = "Add a new item...";
  } else {
    console.error("Element with id 'new-todo' not found.");
  }
}
async function loadTodos() {
  setInputPlaceholder();
  try {
    const response = await fetch("http://localhost:5500/todos");
    const todos = await response.json();
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = ""; // Clear existing list

    todos.forEach((todoText, index) => {
      const li = document.createElement("li");
      li.textContent = todoText;
      li.style.opacity = 0;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Remove";
      deleteButton.onclick = function () {
        removeTodo(index);
      };

      li.appendChild(deleteButton);
      todoList.appendChild(li);

      // Add the scale-in class with a delay for each item
      setTimeout(() => {
        li.classList.add("scale-in");

        // Remove the scale-in class after the animation ends
        li.addEventListener("animationend", function handleAnimationEnd() {
          li.classList.remove("scale-in");
          li.style.opacity = 1;
          li.removeEventListener("animationend", handleAnimationEnd); // Clean up the event listener
        });
      }, index * 100); // Delay each item by 100ms * index
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
  const todoList = document.getElementById("todo-list");
  const listItem = todoList.children[index];

  // Add the animation class to scale out
  listItem.classList.add("scale-out");

  // Wait for the animation to finish before removing the item
  listItem.addEventListener("animationend", async () => {
    try {
      const response = await fetch(`http://localhost:5500/todos/${index}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInputPlaceholder();
        loadTodos(); // Reload todos after deleting
      } else {
        console.error("Error removing todo:", await response.text());
      }
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  });
}

// Initial load of todos
window.onload = function () {
  startCounting();
  loadTodos();
};

input.addEventListener("focus", (event) => {
  event.target.value = "";
});
