import { api, elements, global } from "./constants.js";
import {
	createNowPlayingItem,
	createSlide,
	createGridItem,
	createGeneralInfo,
	createMoreInfo,
	createError,
} from "./create.js";
import {
	nowPlayingAnimation,
	addBackdrop,
	sliderNavHandler,
	seeMoreTrending,
	checkSearchResults,
	switchSectionsEvent,
	loadingOverlay,
} from "./functions.js";

// Fetch
const fetchData = async (path, query = "") => {
	const res = await fetch(`${api.url}${path}?${api.key}&${api.lan}${query}`);
	if (res.status !== 200) {
		createError();
		return;
	} else {
		const data = res.json();
		return data;
	}
};

// Get Functions
export const getNowPlaying = async () => {
	const { results } = await fetchData(api.endpoints.nowPlaying, "&page=1");
	const genresObj = await fetchData(api.endpoints.genres);

	let arr = [];
	results.forEach((item) => {
		for (const i of genresObj.genres) {
			for (const j of item.genre_ids) {
				if (j === i.id) {
					arr.push(` ${i.name}`);
				}
			}
		}
		createNowPlayingItem(item, arr);
		addBackdrop(item.backdrop_path);
		arr = [];
	});
	nowPlayingAnimation();
};
export const getSlider = async (type) => {
	let apiUrl, sliderContainer;
	if (type === "trendingMovies") {
		apiUrl = api.endpoints.trendingMovies;
		sliderContainer = elements.trendingMoviesSliderContainer;
	} else if (type === "trendingTV") {
		apiUrl = api.endpoints.trendingTV;
		sliderContainer = elements.trendingTVSliderContainer;
	} else if (type === "popularMovies") {
		apiUrl = api.endpoints.popularMovies;
		sliderContainer = elements.popularMoviesSliderContainer;
	} else {
		apiUrl = api.endpoints.popularTV;
		sliderContainer = elements.popularTVSliderContainer;
	}

	const { results } = await fetchData(apiUrl, "&page=1");
	let firstSlide, lastSlide;
	results.forEach((item, index) => {
		if (index === 0) {
			firstSlide = createSlide(
				item,
				sliderContainer,
				index,
				"don't append"
			);
		}
		createSlide(item, sliderContainer, index);
		if (index === 19) {
			lastSlide = createSlide(
				item,
				sliderContainer,
				index,
				"don't append"
			);
			sliderContainer.append(firstSlide);
			sliderContainer.prepend(lastSlide);
		}
	});
	sliderNavHandler(type);
};
export const getGrid = async (type, page = 2) => {
	let apiUrl, gridContainer;
	if (type === "trendingMovies") {
		apiUrl = api.endpoints.trendingMovies;
		gridContainer = elements.trendingMoviesGridContainer;
	} else if (type === "trendingTV") {
		apiUrl = api.endpoints.trendingTV;
		gridContainer = elements.trendingTVGridContainer;
	} else if (type === "discoverMovies") {
		apiUrl = api.endpoints.discoverMovies;
		gridContainer = elements.discoverMoviesGridContainer;
	} else {
		apiUrl = api.endpoints.discoverTV;
		gridContainer = elements.discoverTVGridContainer;
	}

	const { results } = await fetchData(apiUrl, `&page=${page}`);
	results.forEach((item) => {
		createGridItem(item, gridContainer);
	});
	if (type !== "trendingMovies") {
		switchSectionsEvent();
		loadingOverlay();
	}
	if (type.includes("trending")) seeMoreTrending(type);
};
export const getDetails = async (type) => {
	let apiUrl, generalSection, generalContainer, moreContainer, keys;
	if (type === "movie") {
		apiUrl = api.endpoints.movieDetails;
		generalSection = elements.movieDetailsGeneralSection;
		moreContainer = elements.movieMoreContainer;
		keys = global.keys.movieKeys;
	} else {
		apiUrl = api.endpoints.tvDetails;
		generalSection = elements.tvDetailsGeneralSection;
		moreContainer = elements.tvMoreContainer;
		keys = global.keys.tvKeys;
	}
	generalContainer = generalSection.firstElementChild;

	const data = await fetchData(`${apiUrl}${location.search.split("=")[1]}`);
	createGeneralInfo(data, generalSection, generalContainer);
	createMoreInfo(data, moreContainer, keys);
	switchSectionsEvent();
	loadingOverlay();
};
export const getSearch = async (radio, searchField, page) => {
	const { results, total_pages, total_results } = await fetchData(
		`${api.endpoints.search}${radio}`,
		`&query=${searchField}&page=${page}`
	);
	global.search.totalPages = total_pages;
	global.search.totalResults = total_results;
	global.search.results = results.length;
	results.forEach((item) => {
		createGridItem(item, elements.searchPageGridContainer);
	});
	checkSearchResults(page);
	switchSectionsEvent();
	loadingOverlay();
};
