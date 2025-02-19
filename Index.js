const api_key = "2a3c21f7203959050cb73bdefd2b2ae2";
const imageBaseURL = "http://image.tmdb.org/t/p/";
const totalPages = 5;
const movieList = [];
const genres = [
  { id: 28, name: 'Həftəlik Populyar Filmlər', endpoint: 'popular' },
  { id: 12, name: 'Ən Yüksək Reytinqli Filmlər', endpoint: 'top_rated' },
  { id: 14, name: 'Gələcək Filmlər', endpoint: 'upcoming' },
];

const api_url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`;

let currentMovies = [];

async function fetchMoviesByCategory(category) {
  const promises = [];
  const movieCategory = category.endpoint;
  
  for (let page = 1; page <= totalPages; page++) {
    const promise = fetch(`https://api.themoviedb.org/3/movie/${movieCategory}?api_key=${api_key}&page=${page}`)
      .then(response => response.json())
      .then(({ results }) => {
        category.movies = category.movies ? [...category.movies, ...results] : results;
      });
    promises.push(promise);
  }
  
  await Promise.all(promises);
}

async function fetchGenres() {
  try {
    const response = await fetch(api_url);
    const data = await response.json();

    const genresList = document.getElementById("genres-list");
    data.genres.forEach(genre => {
      const listItem = document.createElement("li");
      listItem.textContent = genre.name;
      listItem.setAttribute("data-id", genre.id);
      listItem.addEventListener('click', () => filterMoviesByCategory(genre));
      genresList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Xəta:", error);
  }
}

const filterMoviesByCategory = (genre) => {
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = '';

  const genreMovies = genre.movies.filter(movie => movie.genre_ids.includes(genre.id));

  const movieRow = document.createElement('div');
  movieRow.classList.add('movie-row');

  genreMovies.forEach(movie => {
    const posterPath = movie.poster_path ? `${imageBaseURL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster+Available';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 0;
    const starIcon = `<i class="fas fa-star" style="color: yellow;"></i>`;
    const releaseYear = new Date(movie.release_date).getFullYear();

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');
    
    movieDiv.innerHTML = `
      <img src="${posterPath}" alt="${movie.title} Poster">
      <h3>${movie.title}</h3>
      <div class="movie-details">
        <div class="left">
          <div class="stars">${starIcon} ${rating}</div>
        </div>
        <div class="right">
          <p>${releaseYear}</p>
        </div>
      </div>
    `;
    
    movieRow.appendChild(movieDiv);
  });

  movieContainer.appendChild(movieRow);
};

const displayMoviesByCategory = () => {
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = '';

  genres.forEach(genre => {
    const genreTitle = document.createElement('h2');
    genreTitle.textContent = genre.name;
    
    const genreContainer = document.createElement('div');
    genreContainer.id = `${genre.name.toLowerCase().replace(/\s+/g, '-')}-category`;
    genreContainer.classList.add('category');
    
    const movieRow = document.createElement('div');
    movieRow.classList.add('movie-row');

    genre.movies.forEach(movie => {
      const posterPath = movie.poster_path ? `${imageBaseURL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster+Available';
      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 0;
      const starIcon = `<i class="fas fa-star" style="color: yellow;"></i>`;
      const releaseYear = new Date(movie.release_date).getFullYear();

      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie');
      
      movieDiv.innerHTML = `
        <img src="${posterPath}" alt="${movie.title} Poster">
        <h3>${movie.title}</h3>
        <div class="movie-details">
          <div class="left">
            <div class="stars">${starIcon} ${rating}</div>
          </div>
          <div class="right">
            <p>${releaseYear}</p>
          </div>
        </div>
      `;
      
      movieRow.appendChild(movieDiv);
    });

    genreContainer.appendChild(genreTitle);
    genreContainer.appendChild(movieRow);
    movieContainer.appendChild(genreContainer);
  });
};

const fetchMovies = async () => {
  for (let i = 0; i < genres.length; i++) {
    await fetchMoviesByCategory(genres[i]);
  }

  displayMoviesByCategory();
};

fetchGenres();
fetchMovies();