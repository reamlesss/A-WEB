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

    if (timeParagraph) timeParagraph.textContent = timeString;
    if (timeParagraph2) timeParagraph2.textContent = timeString;
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
const API_BASE_URL = ""; // Using relative paths for better Vercel/Local compatibility



async function loadTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);
    const todos = await response.json();
    const todoList = document.getElementById("todo-list");
    if (todoList) {
      todoList.innerHTML = "";
      todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.innerHTML = `
          <span class="todo-text">${todo}</span>
          <button class="delete-btn" onclick="removeTodo(${index})">×</button>
        `;
        todoList.appendChild(li);
      });
    }
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

// Movie List Logic
async function loadMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`);
    const movies = await response.json();
    const moviesList = document.getElementById("movies-list");
    if (moviesList) {
      moviesList.innerHTML = "";
      movies.forEach((movie, index) => {
        const li = document.createElement("li");
        li.className = "todo-item movie-item";
        li.innerHTML = `
          <div class="movie-info">
            <span class="todo-text">${movie.name}</span>
            <div class="movie-genre-label">${movie.genre}</div>
          </div>
          <button class="delete-btn" onclick="removeMovie(${index})">×</button>
        `;
        moviesList.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

async function addMovie() {
  const nameInput = document.getElementById("movie-name");
  const genreInput = document.getElementById("movie-genre");
  const name = nameInput.value.trim();
  const genre = genreInput.value.trim();

  if (!name || !genre) {
    alert("Please enter both movie name and genre!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, genre }),
    });

    if (response.ok) {
      loadMovies();
      nameInput.value = "";
      genreInput.value = "";
    }
  } catch (error) {
    console.error("Error adding movie:", error);
  }
}

async function removeMovie(index) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${index}`, {
      method: "DELETE",
    });
    if (response.ok) {
      loadMovies();
    }
  } catch (error) {
    console.error("Error removing movie:", error);
  }
}


window.onload = function () {
  const mainContent = document.getElementById("main-content");
  if (mainContent) mainContent.style.display = "block";

  startCounting();
  loadTodos();
  loadMovies();

  const goNextBtn = document.getElementById("go-next-btn");
  const introScreen = document.getElementById("intro-screen");
  const audio = document.getElementById("bgMusic");

  let isPlaying = false;
  
  if (goNextBtn) {
    goNextBtn.addEventListener("click", () => {
      introScreen.style.opacity = "0";
      setTimeout(() => {
        introScreen.style.display = "none";
        mainContent.style.display = "block";
        
        const timerSection = document.querySelector('.timer-section');
        if(timerSection) timerSection.classList.add('fade-in');
      }, 1000); 
    });
  }

  const openLetterBtn = document.getElementById("open-letter-btn");
  if (openLetterBtn) {
    openLetterBtn.addEventListener("click", () => {
      mainContent.style.display = "none";
      const letterScreen = document.getElementById("letter-screen");
      letterScreen.style.display = "flex";
      letterScreen.style.opacity = "1";
      
      // Reset story to beginning
      currentSlide = 0;
      updateSlide(0);
      
      if (audio) {
        audio.currentTime = 0;
        audio.play();
        isPlaying = true;
      }
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
              
              if (audio) {
                audio.pause();
                isPlaying = false;
              }

              const timerSection = document.querySelector('.timer-section');
              if(timerSection) timerSection.classList.add('fade-in');

          }, 1000);
      });
  }
  const bucketlistBtn = document.getElementById("bucketlist-btn");
  if (bucketlistBtn) {
    bucketlistBtn.addEventListener("click", () => {
      mainContent.style.display = "none";
      const bucketlistScreen = document.getElementById("bucketlist-screen");
      bucketlistScreen.style.display = "flex";
      bucketlistScreen.style.opacity = "1";
      loadTodos();
    });
  }

  const closeBucketlistBtn = document.getElementById("close-bucketlist-btn");
  if (closeBucketlistBtn) {
    closeBucketlistBtn.addEventListener("click", () => {
      const bucketlistScreen = document.getElementById("bucketlist-screen");
      bucketlistScreen.style.opacity = "0";
      setTimeout(() => {
        bucketlistScreen.style.display = "none";
        mainContent.style.display = "block";
      }, 800);
    });
  }
  const moviesBtn = document.getElementById("movies-btn");
  if (moviesBtn) {
    moviesBtn.addEventListener("click", () => {
      mainContent.style.display = "none";
      const moviesScreen = document.getElementById("movies-screen");
      moviesScreen.style.display = "flex";
      moviesScreen.style.opacity = "1";
      loadMovies();
    });
  }

  const closeMoviesBtn = document.getElementById("close-movies-btn");
  if (closeMoviesBtn) {
    closeMoviesBtn.addEventListener("click", () => {
      const moviesScreen = document.getElementById("movies-screen");
      moviesScreen.style.opacity = "0";
      setTimeout(() => {
        moviesScreen.style.display = "none";
        mainContent.style.display = "block";
      }, 800);
    });
  }
};


  /* Story Mode Logic */
  let currentSlide = 0;
  const slides = document.querySelectorAll('.story-slide');
  const progressBar = document.getElementById('story-progress-bar');
  const prevBtn = document.getElementById('prev-story-btn');
  const nextBtn = document.getElementById('next-story-btn');
  const finishBtn = document.getElementById('go-to-main-btn');
  const storyControls = document.querySelector('.story-controls');

  function updateSlide(index) {
      slides.forEach((slide, i) => {
          slide.classList.remove('active', 'prev');
          if (i === index) {
              slide.classList.add('active');
          } else if (i < index) {
              slide.classList.add('prev');
          }
      });

      // Update Progress Bar
      const progress = ((index + 1) / slides.length) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;

      // Update Controls
      if (prevBtn) {
          prevBtn.style.opacity = index === 0 ? '0' : '1';
          prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
      }

      // Check if last slide
      if (index === slides.length - 1) {
          if (nextBtn) nextBtn.style.display = 'none';
          if (storyControls) storyControls.style.display = 'none'; // Hide controls on last slide to show big finish button
          if (finishBtn) finishBtn.style.display = 'block';
      } else {
          if (nextBtn) nextBtn.style.display = 'block';
          if (storyControls) storyControls.style.display = 'flex';
          if (finishBtn) finishBtn.style.display = 'none';
      }
  }

  if (nextBtn) {
      nextBtn.addEventListener('click', () => {
          if (currentSlide < slides.length - 1) {
              currentSlide++;
              updateSlide(currentSlide);
          }
      });
  }

  if (prevBtn) {
      prevBtn.addEventListener('click', () => {
          if (currentSlide > 0) {
              currentSlide--;
              updateSlide(currentSlide);
          }
      });
  }
  
  // Initialize progress
  if (slides.length > 0) updateSlide(0);

  // Optional: Tap anywhere on letter content to advance (for mobile feel)
  const storyWrapper = document.querySelector('.story-wrapper');
  if (storyWrapper) {
      storyWrapper.addEventListener('click', (e) => {
           // Only advance if not clicking a button and not on the last slide
           if (e.target.tagName !== 'BUTTON' && currentSlide < slides.length - 1) {
               currentSlide++;
               updateSlide(currentSlide);
           }
      });
  }

  /* Heart Trail Effect */
  let lastHeartTime = 0;
  document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastHeartTime > 100) { // Limit number of hearts (every 100ms)
          createHeart(e.clientX, e.clientY);
          lastHeartTime = now;
      }
      
      /* 3D Tilt Effect for Letter Card */
      const letterCard = document.querySelector('.letter-card');
      if (letterCard && letterCard.offsetParent !== null) { // Only if visible
          const rect = letterCard.getBoundingClientRect();
          const x = e.clientX - rect.left; // x position within the element.
          const y = e.clientY - rect.top;  // y position within the element.
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
          const rotateY = ((x - centerX) / centerX) * 5;

          letterCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
  });

  function createHeart(x, y) {
      const heart = document.createElement('div');
      heart.classList.add('heart-trail');
      heart.innerHTML = '❤'; // You can use other symbols or SVGs
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      
      // Randomize slight movement
      const randomX = (Math.random() - 0.5) * 20;
      heart.style.transform = `translateX(${randomX}px)`;

      document.body.appendChild(heart);

      setTimeout(() => {
          heart.remove();
      }, 1000);
  }

if (input) {
  input.addEventListener("focus", (event) => {
    event.target.value = "";
  });
}
