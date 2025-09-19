const wrapper = document.querySelector("#wrapper")

const baseImgUrl = "https://image.tmdb.org/t/p/w500"

// Darkmode
darkMode("#darkmode-toggle");

let popularPage = 1
let isLoading = false
const popularContainer = document.querySelector("#popular")

// Create observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
            fetchPopular(popularPage)
        }
    })
}, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
})

function fetchPopular(page) {
    if (isLoading) return;
    isLoading = true;

    fetch(`https://api.themoviedb.org/3/movie/popular?page=${page}`, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(movies => {
        renderMovies(movies.results, popularContainer, "popular");
        popularPage++;
        isLoading = false;
    })
    .catch(error => {
        console.error("Error fetching popular movies:", error);
        isLoading = false;
    });
}

fetchPopular(popularPage)

// Fetch Now Showing
fetch("https://api.themoviedb.org/3/movie/now_playing", {
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`
    }
})
    .then(response => response.json())
    .then(movies => {
        renderMovies(movies.results, document.querySelector("#now-showing"), "now-showing")
    })

// Fetch Popular
// fetch("https://api.themoviedb.org/3/movie/popular", {
//     headers: {
//         accept: "application/json",
//         Authorization: `Bearer ${token}`
//     }
// })
//     .then(response => response.json())
//     .then(movies => {
//         renderMovies(movies.results, document.querySelector("#popular"), "popular")
//     })

// Movie
function formatRuntime(minutes) {
    if (!minutes) return "N/A"
    const hrs = Math.floor(minutes / 60) // Divide by 60 and round down to get hours
    const mins = minutes % 60 // Get the remainder of minutes after dividing by 60
    return `${hrs}h ${mins}m`
}

function renderMovies(movies, container, type) {
    let movieCards = movies.map(movie => {
        if (type === "now-showing") {
            return `
                <div class="movie-card now-showing" data-id="${movie.id}">
                    <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p class="rating">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFC319">
                                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.175L12 18.896l-7.336 3.871 1.402-8.175L.132 9.21l8.2-1.192z"/>
                            </svg>
                            Rating ${movie.vote_average.toFixed(1)}/10 IMDb
                        </p>
                    </div>
                </div>
            `;
        } else if (type === "popular") {
            return `
                <div class="movie-card popular" id="movie-${movie.id}" data-id="${movie.id}">
                    <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p class="rating">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFC319">
                                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.175L12 18.896l-7.336 3.871 1.402-8.175L.132 9.21l8.2-1.192z"/>
                            </svg>
                            Rating ${movie.vote_average.toFixed(1)}/10
                        </p>
                        <p>${movie.genre_ids.map(id => `<span class="genre-badge"> ${genres.find(genre => genre.id == id).name} </span>`).join("")}</p>
                        <p class="runtime"></p> 
                    </div>
                </div>
            `; 
        }
    }).join("")

    container.insertAdjacentHTML("beforeend", movieCards)

    container.querySelectorAll(".movie-card").forEach(card => {
        card.addEventListener("click", () => {
            let movieId = card.dataset.id;
            window.location.href = `detail.html?id=${movieId}`;
        })
    })

    // Fetch Movie times
    movies.forEach(movie => {
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(details => {
            const runtime = document.querySelector(`#movie-${details.id} .runtime`);
            if (runtime) {
                runtime.textContent = formatRuntime(details.runtime);
            }
        });
    });

    if (type === "popular" && movies.length > 0) {
        observer.disconnect();
        const popularMovies = container.querySelectorAll(".movie-card.popular");
        if (popularMovies.length > 0) {
            const lastMovie = popularMovies[popularMovies.length - 1];
            observer.observe(lastMovie);
        }
    }
}

