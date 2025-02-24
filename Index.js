const api_key = "2a3c21f7203959050cb73bdefd2b2ae2";
const imageBaseURL = "http://image.tmdb.org/t/p/";
const totalPages = 5;
const movieList = [];
const genres = [
  { id: 28, name: 'Həftəlik Populyar Filmlər' },
  { id: 12, name: 'Ən Yüksək Reytinqli Filmlər' },
  { id: 14, name: 'Gələcək Filmlər' },
];
const searchMoviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=`;
const genresListURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=aze`;
const trendingMoviesURL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}`;
const topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}`;
const upcomingMoviesURL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}`;

const movieContainer = document.getElementById('movie-container');

// Kategoriyaları göstərəcək
const displayGenres = (genres) => {
  const genresList = document.getElementById('genres-list');
  genresList.innerHTML = ''; // Mövcud kategoriyaları təmizləyirik

  genres.forEach(genre => {
    const listItem = document.createElement('li');
    listItem.textContent = genre.name;

    // Hər bir kategoriyaya tıklanan zaman filmləri göstərmək üçün event listener əlavə edirik
    listItem.addEventListener('click', () => showMoviesByGenre(genre.id, genre.name));
    
    genresList.appendChild(listItem);
  });
};

// Kateqoriyaya görə filmləri göstərmək
const showMoviesByGenre = async (genreId, genreName) => {
  try {
    // Kategoriyaların altında olan filmləri yükleyirik
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genreId}`);
    const data = await response.json();
    const movies = data.results;

    // Filmləri yalnız bu kateqoriyaya görə göstəririk
    displayMoviesForSelectedCategory(movies, genreName);
  } catch (error) {
    console.error("Xəta:", error);
  }
};

// Seçilmiş kateqoriyanın altında filmləri göstərmək
const displayMoviesForSelectedCategory = (movies, genreName) => {
  movieContainer.innerHTML = ''; // Əvvəlki filmləri silirik

  // Kateqoriya başlığını göstəririk
  const genreTitle = document.createElement('h2');
  genreTitle.textContent = genreName;
  movieContainer.appendChild(genreTitle);

  // Filmləri göstərəcəyik
  const movieRow = document.createElement('div');
  movieRow.classList.add('movie-row');

  movies.forEach(movie => {
    const posterPath = movie.poster_path ? `${imageBaseURL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Poster+Yoxdur';
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

// Genres API-sindən məlumatları çəkirik
const fetchGenres = async () => {
  try {
    const response = await fetch(genresListURL);
    const data = await response.json();
    displayGenres(data.genres); // Filmləri göstərmək
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

// Kategoriyalar göstərilməyə başlasın
fetchGenres();

// Movie search handling
const searchMovies = async () => {
  const query = document.getElementById('searchInput').value.trim();
  const movieContainer = document.getElementById('movie-container');
  const searchResultsSection = document.getElementById('search-results'); 

  if (!query) {
    movieContainer.style.display = 'block';
    searchResultsSection.style.display = 'none'; 
    return;
  }
  
  movieContainer.style.display = 'none';
  searchResultsSection.style.display = 'block';

  try {
    const response = await fetch(searchMoviesURL + query);
    const data = await response.json();

    displaySearchResults(data.results);
  } catch (error) {
    console.error("Xəta:", error);
  }
};

const displaySearchResults = (movies) => {
  const searchResultContainer = document.getElementById('search-movie-row');
  searchResultContainer.innerHTML = ''; 

  if (movies.length === 0) {
    searchResultContainer.innerHTML = '<p>Heç bir nəticə tapılmadı.</p>';
    return;
  }

  movies.forEach(movie => {
    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Poster+Yoxdur';
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
    
    searchResultContainer.appendChild(movieDiv);
  });
};

document.getElementById('searchInput').addEventListener('input', searchMovies);

// Fetch trending, top-rated, and upcoming movies
const fetchMovies = async () => {
  try {
    const trendingResponse = await fetch(trendingMoviesURL);
    const trendingData = await trendingResponse.json();

    const topRatedResponse = await fetch(topRatedMoviesURL);
    const topRatedData = await topRatedResponse.json();

    const upcomingResponse = await fetch(upcomingMoviesURL);
    const upcomingData = await upcomingResponse.json();

    const movies = {
      trending: trendingData.results,
      topRated: topRatedData.results,
      upcoming: upcomingData.results,
    };

    displayMoviesByCategory(movies);
  } catch (error) {
    console.error("Xəta:", error);
  }
};

// Fetch and display movies by category
const displayMoviesByCategory = (movies) => {
  const movieContainer = document.getElementById('movie-container');
  movieContainer.innerHTML = ''; 

  genres.forEach(genre => {
    const genreTitle = document.createElement('h2');
    genreTitle.textContent = genre.name;
    
    const genreContainer = document.createElement('div');
    genreContainer.id = `${genre.name.toLowerCase().replace(/\s+/g, '-')}-category`; 
    genreContainer.classList.add('category');
    
    let genreMovies = [];
    if (genre.id === 28) genreMovies = movies.trending;
    if (genre.id === 12) genreMovies = movies.topRated;
    if (genre.id === 14) genreMovies = movies.upcoming;

    const displayedMovies = new Set();
    const movieRow = document.createElement('div');
    movieRow.classList.add('movie-row');
    
    genreMovies.forEach(movie => {
      if (!displayedMovies.has(movie.title)) { 
        displayedMovies.add(movie.title);

        const posterPath = movie.poster_path ? `${imageBaseURL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Poster+Yoxdur';
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
      }
    });

    genreContainer.appendChild(genreTitle);
    genreContainer.appendChild(movieRow);
    movieContainer.appendChild(genreContainer);
  });
};

// Fetch and display movies
fetchMovies();
