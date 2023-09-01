export const api = {
	url: "https://api.themoviedb.org/3/",
	endpoints: {
		nowPlaying: `movie/now_playing`,
		trendingMovies: `trending/movie/day`,
		trendingTV: `trending/tv/day`,
		movieDetails: `movie/`,
		tvDetails: `tv/`,
		popularMovies: `movie/popular`,
		discoverMovies: `discover/movie`,
		popularTV: `tv/popular`,
		discoverTV: `discover/tv`,
		search: `search/`,
		genres: `genre/movie/list`,
	},
	key: "api_key=7cad679f98e76a92e630048bdf3dc0a2",
	lan: "language=en-US",
};
export const img = {
	url: "https://image.tmdb.org/t/p/",
	quality: {
		backdrop: "original",
		poster: "w500",
		slide: "original",
		grid: "w300",
	},
};
export const global = {
	nowPlayingArr: [],
	search: {
		urlParams: new URLSearchParams(location.search),
		results: 0,
		totalPages: 1,
		totalResults: 0,
	},
	scroll: {
		position: 0,
		direction: "",
	},
	cursor: {
		x: 0,
		y: 0,
	},
	keys: {
		movieKeys: [
			"release_date",
			"runtime",
			"vote_average",
			"production_companies",
			"budget",
			"revenue",
			"homepage",
		],
		tvKeys: [
			"first_air_date",
			"last_air_date",
			"vote_average",
			"number_of_seasons",
			"production_companies",
			"in_production",
			"homepage",
		],
	},
};
export const elements = {
	navbar: document.querySelector("nav"),
	main: document.querySelector("main"),

	// Now Playing
	nowPlayingContainer: document.querySelector("#now-playing-container"),
	backdropContainer: document.querySelector(".backdrop-container"),
	progressbar: document.querySelector(".progress-bar"),

	// Trending Movies
	trendingMoviesSliderSection: document.querySelector(
		"#trending-movies-slider-section"
	),
	trendingMoviesSliderContainer: document.querySelector(
		"#trending-movies-slider-container"
	),
	trendingMoviesGridSection: document.querySelector(
		"#trending-movies-grid-section"
	),
	trendingMoviesGridContainer: document.querySelector(
		"#trending-movies-grid-container"
	),

	// Trending TV
	trendingTVSliderSection: document.querySelector(
		"#trending-tv-slider-section"
	),
	trendingTVSliderContainer: document.querySelector(
		"#trending-tv-slider-container"
	),
	trendingTVGridSection: document.querySelector("#trending-tv-grid-section"),
	trendingTVGridContainer: document.querySelector(
		"#trending-tv-grid-container"
	),

	// Popular Movies
	popularMoviesSection: document.querySelector("#popular-movies-section"),
	popularMoviesSliderContainer: document.querySelector(
		"#popular-movies-slider-container"
	),

	// Discover Movies
	discoverMoviesSection: document.querySelector("#discover-movies-section"),
	discoverMoviesGridContainer: document.querySelector(
		"#discover-movies-grid-container"
	),

	// Popular TV
	popularTVSection: document.querySelector("#popular-tv-section"),
	popularTVSliderContainer: document.querySelector(
		"#popular-tv-slider-container"
	),

	// Discover TV
	discoverTVSection: document.querySelector("#discover-tv-section"),
	discoverTVGridContainer: document.querySelector(
		"#discover-tv-grid-container"
	),

	// Search Page
	searchPageFormSection: document.querySelector("#search-page-form-section"),
	searchPageResultsSection: document.querySelector(
		"#search-page-results-section"
	),
	searchResultsInfo: document.querySelector("#search-results-info"),
	searchPageGridContainer: document.querySelector(
		"#search-page-grid-container"
	),

	// Movie Details
	movieDetailsGeneralSection: document.querySelector(
		"#movie-details-general-section"
	),
	movieMoreContainer: document.querySelector("#movie-more-container"),

	// TV Details
	tvDetailsGeneralSection: document.querySelector(
		"#tv-details-general-section"
	),
	tvMoreContainer: document.querySelector("#tv-more-container"),
};
