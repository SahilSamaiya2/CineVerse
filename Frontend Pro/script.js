const API_KEY = "b6ce7acd";
const BASE_URL = "https://www.omdbapi.com/";

// 📌 Get elements
const input = document.getElementById("searchInput");
const moviesDiv = document.getElementById("movies");
const trendingDiv = document.getElementById("trending"); // ✅ NEW
const loading = document.getElementById("loading");
const error = document.getElementById("error");

let timeout;

// 🎬 Trending list
const trendingList = [
  "Avengers",
  "Batman",
  "Spider Man",
  "Inception",
  "Interstellar",
  "Pushpa",
  "KGF",
  "Pathaan",
  "Jawan",
  "Dangal"
];

// 🔍 Debounced input event
input.addEventListener("input", () => {
  clearTimeout(timeout);

  const query = input.value.trim();

  timeout = setTimeout(() => {
    searchMovies(query);
  }, 500);
});

// 🔥 LOAD TRENDING ON PAGE LOAD
window.addEventListener("load", () => {
  loadTrendingMovies();
});

// 🎬 Fetch movies from API
async function searchMovies(query) {
  if (!query) {
    moviesDiv.innerHTML = "";
    return;
  }

  const type = document.getElementById("typeFilter").value;
  const year = document.getElementById("yearFilter").value;
  const industry = document.getElementById("industryFilter").value;

  loading.classList.remove("hidden");
  error.textContent = "";

  try {
    let searchQuery = query;

    if (industry === "bollywood") {
      searchQuery += " india";
    } else if (industry === "hollywood") {
      searchQuery += " english";
    }

    let url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=b6ce7acd`;

    if (type) url += `&type=${type}`;
    if (year) url += `&y=${year}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True" && data.Search) {
      displayMovies(data.Search);
    } else {
      moviesDiv.innerHTML = "";
      error.textContent = data.Error || "Movie not found";
    }

  } catch (err) {
    console.error(err);
    error.textContent = "Something went wrong!";
  }

  loading.classList.add("hidden");
}

// 📺 Display searched movies
function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    const card = createMovieCard(movie);
    moviesDiv.appendChild(card);
  });
}

// 🔥 LOAD TRENDING MOVIES
async function loadTrendingMovies() {
  trendingDiv.innerHTML = "";

  for (let movieName of trendingList) {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${searchQuery}&apikey=b6ce7acd`
      );

      const data = await res.json();

      if (data.Response === "True") {
        displayTrending(data.Search.slice(0, 2)); // limit
      }

    } catch (err) {
      console.error(err);
    }
  }
}

// 🔥 DISPLAY TRENDING
function displayTrending(movies) {
  movies.forEach(movie => {
    const card = createMovieCard(movie);
    trendingDiv.appendChild(card);
  });
}

// 🎬 REUSABLE CARD FUNCTION (BEST PRACTICE)
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie");

  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x400";

  card.innerHTML = `
    <img src="${poster}" />
    <div class="movie-info">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    getMovieDetails(movie.imdbID);
  });
  console.log("CLICK:", movie.Title);

  return card;
}

// 🎬 Modal
const modal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

closeModal.onclick = () => modal.classList.add("hidden");

window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
};

// 🎬 Movie Details
async function getMovieDetails(id) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${searchQuery}&apikey=b6ce7acd`
    );

    const movie = await res.json();

    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x400";

    modalBody.innerHTML = `
      <img src="${poster}" />
      <h2>${movie.Title}</h2>
      <p><strong>⭐ Rating:</strong> ${movie.imdbRating}</p>
      <p><strong>🎭 Genre:</strong> ${movie.Genre}</p>
      <p><strong>🎬 Actors:</strong> ${movie.Actors}</p>
      <p><strong>⏱ Runtime:</strong> ${movie.Runtime}</p>
      <p>${movie.Plot}</p>
    `;

    modal.classList.remove("hidden");

  } catch (err) {
    console.error(err);
    alert("Failed to load details");
  }
}
// 🎬 Background images (you can change/add more)
const backgrounds = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  "https://images.unsplash.com/photo-1505685296765-3a2736de412f",
  "https://images.unsplash.com/photo-1517602302552-471fe67acf66",
  "https://images.unsplash.com/photo-1497032205916-ac775f0649ae"
];

let bgIndex = 0;
const bgLayer = document.getElementById("bg-layer");

// 🔄 Change background every 5 seconds
setInterval(() => {
  bgLayer.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
  bgIndex = (bgIndex + 1) % backgrounds.length;
}, 5000);

// 👉 Set initial background
bgLayer.style.backgroundImage = `url(${backgrounds[0]})`;