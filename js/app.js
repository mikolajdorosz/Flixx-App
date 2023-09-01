import { getNowPlaying, getSlider, getGrid, getDetails } from "./fetch.js";
import { elements } from "./constants.js";
import {
	resetLocalStorage,
	activePage,
	parallaxEffectEvent,
	pagination,
	instantScroll,
	showHideNavbar,
} from "./functions.js";

const init = () => {
	resetLocalStorage();
	activePage();
	window.addEventListener("scroll", showHideNavbar);
	document.addEventListener("scroll", parallaxEffectEvent);

	switch (location.pathname) {
		case "/":
		case "/index.html":
			getNowPlaying();
			getSlider("trendingMovies");
			getSlider("trendingTV");
			getGrid("trendingMovies");
			getGrid("trendingTV");
			break;

		case "/movies.html":
			getSlider("popularMovies");
			pagination("discoverMovies");
			instantScroll(elements.discoverMoviesSection);
			break;

		case "/tv-shows.html":
			getSlider("popularTV");
			pagination("discoverTV");
			instantScroll(elements.discoverTVSection);
			break;

		case "/movie-details.html":
			getDetails("movie");
			break;

		case "/tv-details.html":
			getDetails("tv");
			break;

		case "/search.html":
			pagination("search");
			instantScroll(elements.searchPageResultsSection);
			break;
	}
};
document.addEventListener("DOMContentLoaded", init);
