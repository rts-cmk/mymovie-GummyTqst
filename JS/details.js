const baseImgUrl = "https://image.tmdb.org/t/p/w500";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");


function findRating(release_dates_array) {
    let us_dates = release_dates_array.results.find(element => element.iso_3166_1 === "US");
    let rated = us_dates.release_dates.find(element => element.certification !== "" );
    return rated.certification
}

fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,videos,release_dates`, {
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`
    }
})
.then(res => res.json())
.then(movie => {
    renderMovieDetails(movie);
    console.log(movie);

    // Darkmode
    darkMode("#darkmode-toggle");
});

function renderMovieDetails(movie) {
    const container = document.querySelector("#movie-details");

    container.innerHTML = `
        <div class="movie-banner">
            <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}">

            <!-- Overlay Icons -->
            <div class="banner-icons">
                <!-- Back Button -->
                <a href="index.html" class="icon-btn back-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.3074 11.3023H6.36462L9.45295 8.19101C9.7235 7.91863 9.7235 7.47676 9.45295 7.20441C9.18239 6.93186 8.74375 6.93186 8.4736 7.20441L4.20292 11.5066C3.93236 11.779 3.93236 12.2209 4.20292 12.4932L8.4736 16.7956C8.60883 16.9319 8.78607 17 8.96327 17C9.14047 17 9.31771 16.9319 9.45295 16.7956C9.7235 16.5232 9.7235 16.0814 9.45295 15.8091L6.36462 12.6976H19.3074C19.6898 12.6976 20 12.3852 20 11.9999C20 11.6146 19.6899 11.3023 19.3074 11.3023Z" fill="white"/>
                    </svg>
                </a>

                <!-- Dark/Light Switch -->
                <label class="switch toggle-btn">
                    <input type="checkbox" id="darkmode-toggle">
                    <span class="slider round"></span>
                </label>
            </div>

            <!-- Play Trailer -->
            <button class="icon-btn play-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="48" height="48" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </button>
            <span class="playTrailer-text">Play Trailer</span>
        </div>

        <article class="movie-details-content">
            <header class="movie-header">
                <h1 class="movie-title">${movie.title}</h1>
                <button class="bookmark">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2127 0.0952657C13.4531 0.186901 13.6446 0.331356 13.7869 0.528887C13.9289 0.726308 14 0.944767 14 1.18452V14.8156C14 15.0554 13.929 15.2738 13.7868 15.4712C13.6446 15.6688 13.4531 15.8134 13.2126 15.9049C13.0741 15.9613 12.9136 15.9893 12.7313 15.9893C12.3814 15.9893 12.0788 15.8765 11.8235 15.6513L7.00004 11.1671L2.17653 15.6512C1.91396 15.8836 1.61151 16 1.26868 16C1.101 16 0.940528 15.9683 0.787521 15.905C0.54694 15.8134 0.355471 15.6688 0.213305 15.4714C0.0711784 15.2738 0 15.0555 0 14.8156V1.18438C0 0.944619 0.0711784 0.72616 0.213305 0.528739C0.355471 0.331319 0.54694 0.186679 0.787521 0.0951175C0.940681 0.0317429 1.101 0 1.26868 0H12.7313V0.000148158C12.8991 0.000148158 13.0595 0.031891 13.2127 0.0952657ZM7.97354 10.1942L12.6001 14.4876V1.35377H1.40015V14.4876L6.02667 10.1942L7.00006 9.29545L7.97354 10.1942Z" fill="black"/>
                    </svg>
                </button>
            </header>

            <section class="movie-rating">
                <p class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFC319">
                        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.175L12 18.896l-7.336 3.871 1.402-8.175L.132 9.21l8.2-1.192z"/>
                    </svg>
                    Rating ${movie.vote_average.toFixed(1)}/10 IMDb
                </p>
            </section>

            <section class="movie-genres">
                <p>${movie.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join("")}</p>
            </section>

            </section>

            <section class="movie-info-grid">
                <div class="info-item">
                    <p class="label">Length</p>
                    <p>${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m</p>
                </div>
                <div class="info-item">
                    <p class="label">Language</p>
                    <p>${movie.original_language.toUpperCase()}</p>
                </div>
                <div class="info-item">
                    <p class="label">Rating</p>
                    <p>${findRating(movie.release_dates)}</p>
                </div>
            </section>

            <section class="movie-overview">
                <h2>Description</h2>
                <p>${movie.overview}</p>
            </section>

            <section class="movie-cast">
                <div class="movie-cast__section-header">
                    <h2>Cast</h2>
                    <button class="moreBtn">See more</button>
                </div>
                <div class="cast-grid">
                    ${movie.credits.cast.slice(0, 5).map(cast => `
                        <div class="cast-card">
                            <img src="${cast.profile_path ? baseImgUrl + cast.profile_path : 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${cast.name}">
                            <p class="cast-name">${cast.name}</p>
                        </div>    
                    `).join("")}
                </div>
            </section>
        </article>
    `;
}
