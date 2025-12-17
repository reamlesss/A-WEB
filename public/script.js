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

const input = document.getElementById("new-todo");
async function setInputPlaceholder() {
  if (input) {
    input.value = "Add a new item...";
  } else {
    console.error("Element with id 'new-todo' not found.");
  }
}
const API_BASE_URL = "https://a-web-9gho.onrender.com"; // Replace with your actual Render URL

async function loadTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);
    const todos = await response.json();
    // ...rest of the code
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

async function addTodo() {
  const todoInput = document.getElementById("new-todo");
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("Please enter a to-do item!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: todoText }),
    });

    if (response.ok) {
      loadTodos();
      todoInput.value = ""; // Clear input
    } else {
      console.error("Error adding todo:", await response.text());
    }
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

async function removeTodo(index) {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${index}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadTodos();
    } else {
      console.error("Error removing todo:", await response.text());
    }
  } catch (error) {
    console.error("Error removing todo:", error);
  }
}

// Initial load of todos
window.onload = function () {
  startCounting();
  loadTodos();

  const goNextBtn = document.getElementById("go-next-btn");
  const introScreen = document.getElementById("intro-screen");
  const mainContent = document.getElementById("main-content");

  if (goNextBtn) {
    goNextBtn.addEventListener("click", () => {
      introScreen.style.opacity = "0";
      setTimeout(() => {
        introScreen.style.display = "none";
        // Show Letter Screen instead of Main Content
        const letterScreen = document.getElementById("letter-screen");
        letterScreen.style.display = "flex";
        
        // Trigger reflow to ensure transition can happen if we add one (optional but good practice)
        // For now, simpler fade-in logic or just display
        
      }, 1000); 
    });
  }

  const goToMainBtn = document.getElementById("go-to-main-btn");
  if (goToMainBtn) {
      goToMainBtn.addEventListener("click", () => {
          const letterScreen = document.getElementById("letter-screen");
          letterScreen.style.opacity = "0";
          setTimeout(() => {
              letterScreen.style.display = "none";
              mainContent.style.display = "block";
              
              // Optional: trigger animations on main content elements if needed
              const timerSection = document.querySelector('.timer-section');
              if(timerSection) timerSection.classList.add('fade-in');

          }, 1000);
      });
  }
};

if (input) {
  input.addEventListener("focus", (event) => {
    event.target.value = "";
  });
}
