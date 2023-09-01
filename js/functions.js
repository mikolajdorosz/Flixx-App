import { img, elements, global } from "./constants.js";
import { createNoResults } from "./create.js";
import { getGrid, getSearch } from "./fetch.js";

// Global
export const resetLocalStorage = () => {
	const resetPopular = () => {
		localStorage.setItem("popularMovies", 1);
		localStorage.setItem("popularTV", 1);
	};
	const resetHome = () => {
		localStorage.setItem("moviesState", 0);
		localStorage.setItem("moviesOpen", false);
		localStorage.setItem("tvState", 0);
		localStorage.setItem("tvOpen", false);

		localStorage.setItem("trendingMovies", 1);
		localStorage.setItem("trendingTV", 1);
		localStorage.setItem("nowPlaying", 0);
	};

	if (location.pathname === "/index.html" || location.pathname === "/") {
		resetPopular();
	} else if (location.pathname === "/movies.html") {
		resetHome();
		localStorage.setItem("popularTV", 1);
	} else if (location.pathname === "/tv-shows.html") {
		resetHome();
		localStorage.setItem("popularMovies", 1);
	} else if (location.pathname === "/search.html") {
		resetHome();
		resetPopular();
	}
};
export const activePage = () => {
	if (location.pathname === "/" || location.pathname === "/index.html") {
		document.querySelector("#nav-logo").style.color = "#f1c40f";
	} else if (location.pathname === "/movies.html") {
		document.querySelector("#nav-movies").style.color = "#f1c40f";
	} else if (location.pathname === "/tv-shows.html") {
		document.querySelector("#nav-tv").style.color = `#f1c40f`;
	} else if (location.pathname.includes("/search.html")) {
		document.querySelector("#nav-search").style.color = "#f1c40f";
	}
};
export const parallaxEffectEvent = () => {
	const parallaxLayer = document.querySelector(".parallax-layer");
	parallaxLayer.style.transform = `translateY(${pageYOffset / 30}vh)`;
};
export const loadingOverlay = () => {
	const overlay = document.querySelector(".overlay");
	setTimeout(() => {
		overlay.style.opacity = 0;
		document.body.style.overflowY = "scroll";
	}, 1000);
	setTimeout(() => {
		overlay.style.display = "none";
	}, 1500);
};
export const showHideNavbar = () => {
	let timeout;
	const checkDirection = () => {
		global.scroll.direction =
			document.body.getBoundingClientRect().top > global.scroll.position
				? "up"
				: "down";
		global.scroll.position = document.body.getBoundingClientRect().top;
	};
	const displayNavbar = (val) => {
		if (pageYOffset === 0) return;
		else {
			elements.navbar.style.transform = `translateY(${-val}%)`;
		}
	};

	checkDirection();
	if (global.scroll.direction === "down") {
		displayNavbar(100);
	} else {
		timeout = setTimeout(displayNavbar, 3000, 100);
		displayNavbar(0);
	}
	elements.navbar.addEventListener("mouseenter", () => {
		if (timeout !== null) clearTimeout(timeout);
		displayNavbar(0);
	});
	elements.navbar.addEventListener("mouseleave", () => {
		if (timeout !== null) clearTimeout(timeout);
		timeout = setTimeout(displayNavbar, 3000, 100);
	});
};
export const switchSectionsEvent = () => {
	const arrows = document.querySelector(".switch-btns-container");
	const upArrow = arrows.firstElementChild;
	const downArrow = arrows.lastElementChild;

	let snapPoints, dataSnap;
	const getSnapPoints = () => {
		snapPoints = [];
		dataSnap = document.querySelectorAll("[data-snap]");
		dataSnap.forEach((item) => {
			let gridContainer,
				gridItemsInColumn,
				gridItemHeight,
				paddingTop,
				sectionTitleHeight;
			if (item.id.includes("discover") || item.id.includes("results")) {
				gridContainer =
					item.lastElementChild.firstElementChild.firstElementChild;
				gridItemsInColumn =
					getComputedStyle(gridContainer).gridTemplateRows.split(" ").length;
				gridItemHeight = parseFloat(
					getComputedStyle(gridContainer).gridAutoRows
				);
				paddingTop = parseFloat(getComputedStyle(item).paddingTop);
				sectionTitleHeight = parseFloat(
					getComputedStyle(item.firstElementChild).height
				);
			}
			if (item.id.includes("slider") || item.id.includes("more")) {
				snapPoints.push(
					item.offsetTop -
						(innerHeight - parseFloat(getComputedStyle(item).height)) / 2
				);
			} else if (
				item.id.includes("discover") ||
				(item.id.includes("results") && gridItemsInColumn > 1)
			) {
				for (let i = 0; i < gridItemsInColumn - 1; i++) {
					if (i === 0) {
						snapPoints.push(item.offsetTop);
					} else if (i === gridItemsInColumn - 2 && i === 1) {
						snapPoints.push(
							snapPoints[snapPoints.length - 1] +
								gridItemHeight -
								(innerHeight -
									2 * paddingTop -
									sectionTitleHeight -
									2 * gridItemHeight -
									innerHeight / 50) +
								2 * paddingTop +
								sectionTitleHeight
						);
					} else if (i === gridItemsInColumn - 2) {
						snapPoints.push(
							snapPoints[snapPoints.length - 1] +
								gridItemHeight +
								innerHeight / 100 +
								2 * paddingTop +
								sectionTitleHeight
						);
					} else if (i === 1) {
						snapPoints.push(
							snapPoints[snapPoints.length - 1] +
								gridItemHeight -
								(innerHeight -
									2 * paddingTop -
									sectionTitleHeight -
									2 * gridItemHeight -
									innerHeight / 50)
						);
					} else {
						snapPoints.push(
							snapPoints[snapPoints.length - 1] +
								gridItemHeight +
								innerHeight / 100
						);
					}
				}
			} else {
				snapPoints.push(item.offsetTop);
			}
		});
	};
	const getIndex = () => {
		let ind,
			toCompare,
			minn = document.body.getBoundingClientRect().height;
		snapPoints.forEach((num, i) => {
			toCompare = Math.abs(pageYOffset - num);
			if (toCompare < minn) {
				minn = toCompare;
				ind = i;
			}
		});
		return ind;
	};
	function getScrollbarWidth() {
		let div = document.createElement("div");
		div.style.cssText =
			"overflow:scroll; visibility:hidden; position:absolute;";
		document.body.appendChild(div);
		let width = div.offsetWidth - div.clientWidth;
		div.remove();
		return width;
	}
	getSnapPoints();
	let index = getIndex();
	const scrollBarWidth = getScrollbarWidth();

	const toggleHeight = () => {
		if (location.pathname === "/" || location.pathname === "/index.html") {
			index === 1
				? dataSnap[1].classList.add("full-height")
				: dataSnap[1].classList.remove("full-height");
		} else if (
			location.pathname === "/search.html" &&
			global.search.totalResults > 0
		) {
			index === 0
				? dataSnap[0].classList.add("results-height")
				: dataSnap[0].classList.remove("results-height");
		} else if (
			location.pathname === "/search.html" &&
			global.search.totalResults === 0
		) {
			index === 0
				? dataSnap[0].classList.add("full-height")
				: dataSnap[0].classList.remove("full-height");
		}
	};
	const removeFullHeight = () => {
		if (location.pathname === "/" || location.pathname === "/index.html")
			dataSnap[1].classList.remove("full-height");
	};
	const hideGrid = () => {
		if (location.pathname === "/" || location.pathname === "/index.html") {
			changeGridDisplay(elements.trendingMoviesGridSection, "25vh", 0);
			changeGridDisplay(elements.trendingTVGridSection, "25vh", 0);
			showHideSeeMoreBtn(elements.trendingMoviesSliderSection, 1);
			showHideSeeMoreBtn(elements.trendingTVSliderSection, 1);
			localStorage.setItem("moviesOpen", false);
			localStorage.setItem("tvOpen", false);
		}
	};
	const noResults = () => {
		index = 0;
		toggleHeight();
		scrollTo({
			top: snapPoints[index],
			behavior: "smooth",
		});
	};

	const showHideArrows = (e) => {
		global.cursor.x = e.clientX;
		global.cursor.y = e.clientY;

		e.clientX >= innerWidth - scrollBarWidth
			? (arrows.style.transform = "translateX(0)")
			: (arrows.style.transform = "translateX(100%)");
	};
	const switchSection = (e) => {
		if (e.currentTarget === upArrow) {
			index <= 0 ? (index = 0) : (index -= 1);
		} else {
			index >= snapPoints.length - 1
				? (index = snapPoints.length - 1)
				: (index += 1);
			if (
				JSON.parse(localStorage.getItem("moviesOpen")) &&
				(location.pathname === "/" || location.pathname === "/index.html")
			) {
				index -= 1;
			}
		}
		toggleHeight();
		hideGrid();
		scrollTo({
			top: snapPoints[index],
			behavior: "smooth",
		});
	};

	document.addEventListener("scroll", () => {
		if (
			!JSON.parse(localStorage.getItem("moviesOpen")) ||
			!JSON.parse(localStorage.getItem("tvOpen"))
		)
			index = getIndex();
		if (global.cursor.x >= innerWidth - scrollBarWidth) removeFullHeight();
	});
	window.addEventListener("mousemove", showHideArrows);
	document.addEventListener("wheel", removeFullHeight);
	upArrow.addEventListener("click", switchSection);
	downArrow.addEventListener("click", switchSection);

	if (location.pathname === "/search.html" && global.search.totalResults === 0)
		noResults();
	else if (location.pathname === "/search.html") toggleHeight();
};

// Home
export const addBackdrop = (path) => {
	const div = document.createElement("div");
	div.className = "backdrop content-container";
	div.style.background = `url(${img.url}${img.quality.backdrop}${path}) center center / 100%`;
	elements.backdropContainer.appendChild(div);
	global.nowPlayingArr.push(div);
};
export const nowPlayingAnimation = () => {
	let barWidth = 0,
		initScale,
		operator,
		lsIndex = "nowPlaying";

	if (!localStorage.getItem(lsIndex)) localStorage.setItem(lsIndex, 0);
	let index = parseInt(localStorage.getItem(lsIndex));

	const checkIndex = () => {
		if (index % 2 === 0) {
			initScale = "100%";
			operator = "+";
		} else {
			initScale = "110%";
			operator = "-";
		}
	};
	const moveContainer = () => {
		elements.nowPlayingContainer.style.transform = `translateX(calc(${-index} * 100% / 20))`;
		elements.backdropContainer.style.transform = `translateX(calc(${-index} * 100% / 20))`;
	};
	const scaleBg = () => {
		global.nowPlayingArr[
			index
		].style.backgroundSize = `calc(${initScale} ${operator} ${barWidth / 20}%)`;
	};
	const showHideItem = (val) => {
		elements.nowPlayingContainer.style.opacity = val;
		elements.progressbar.style.opacity = val;
		elements.backdropContainer.style.opacity = val;
	};
	const progress = () => {
		checkIndex();
		if (barWidth > 100) {
			barWidth = 0;
			index < 19 ? (index += 1) : (index = 0);
			localStorage.setItem(lsIndex, index);
			moveContainer();
		} else {
			if (barWidth > 3) {
				showHideItem(1);
			}
			if (barWidth > 95) {
				showHideItem(0);
			}
			barWidth += 0.1;
		}
		elements.progressbar.style.width = `${barWidth}vw`;
		scaleBg();
	};
	moveContainer();
	setInterval(progress, 10);
};
const changeGridDisplay = (gridSection, ht, op) => {
	gridSection.style.cssText = `height: ${ht} !important;`;
	gridSection.firstElementChild.style.opacity = op;
	gridSection.lastElementChild.style.opacity = op;
};
const showHideSeeMoreBtn = (sliderSection, val) => {
	sliderSection.lastElementChild.style.opacity = val;
};
export const seeMoreTrending = (type) => {
	let gridSection, sliderSection, lsState, lsOpen;
	if (type === "trendingMovies") {
		gridSection = elements.trendingMoviesGridSection;
		sliderSection = elements.trendingMoviesSliderSection;
		lsState = "moviesState";
		lsOpen = "moviesOpen";
	} else {
		gridSection = elements.trendingTVGridSection;
		sliderSection = elements.trendingTVSliderSection;
		lsState = "tvState";
		lsOpen = "tvOpen";
	}

	const seeMoreBtn = sliderSection.lastElementChild;
	const moreWrapper = gridSection.lastElementChild;
	const upBtn = moreWrapper.lastElementChild;
	const downBtn = moreWrapper.firstElementChild;
	const gridContainer = gridSection.firstElementChild.firstElementChild;

	const gridItemsInRow =
		getComputedStyle(gridContainer).gridTemplateColumns.split(" ").length;
	const maxIndex = Math.ceil(20 / gridItemsInRow) - 2;

	const changeView = () => {
		let position;
		JSON.parse(localStorage.getItem(lsOpen))
			? (position = gridSection.offsetTop)
			: (position =
					sliderSection.offsetTop -
					elements.navbar.getBoundingClientRect().height / 2);
		scrollTo({
			top: position,
			behavior: "smooth",
		});
	};
	const changeDownBtnDisplay = (dp) => {
		downBtn.style.display = dp;
	};
	const moveGrid = () => {
		const toTranslate =
			parseFloat(
				getComputedStyle(gridContainer).getPropertyValue("grid-auto-rows")
			) +
			innerHeight / 100;
		gridContainer.style.transform = `translateY(calc(${
			-index * toTranslate
		}px))`;
	};
	const seeMoreEvent = (e) => {
		if (e.currentTarget === upBtn) {
			if (index <= 0) {
				index = 0;
				changeGridDisplay(gridSection, "25vh", 0);
				localStorage.setItem(lsOpen, false);
				changeView();
				showHideSeeMoreBtn(sliderSection, 1);
			} else {
				index -= 1;
				changeDownBtnDisplay("flex");
			}
		} else {
			if (index >= maxIndex - 1) {
				index = maxIndex;
				changeDownBtnDisplay("none");
			} else {
				index += 1;
			}
		}
		moveGrid();
		localStorage.setItem(lsState, index);
	};

	upBtn.addEventListener("click", seeMoreEvent);
	downBtn.addEventListener("click", seeMoreEvent);
	seeMoreBtn.addEventListener("click", () => {
		changeGridDisplay(gridSection, "100vh", 1);
		localStorage.setItem(lsOpen, true);
		changeView();
		showHideSeeMoreBtn(sliderSection, 0);
	});

	let index = parseInt(localStorage.getItem(lsState)) || 0;
	if (!index) localStorage.setItem(lsState, 0);
	else if (index === maxIndex) changeDownBtnDisplay("none");

	if (JSON.parse(localStorage.getItem(lsOpen))) {
		changeGridDisplay(gridSection, "100vh", 1);
		moveGrid();
		showHideSeeMoreBtn(sliderSection, 0);
	} else {
		changeGridDisplay(gridSection, "25vh", 0);
	}
};

// Common
export const sliderNavHandler = (type) => {
	let animation,
		interval = 10000,
		section,
		lsIndex;
	if (type === "trendingMovies") {
		section = elements.trendingMoviesSliderSection;
		lsIndex = "trendingMovies";
	} else if (type === "trendingTV") {
		section = elements.trendingTVSliderSection;
		lsIndex = "trendingTV";
	} else if (type === "popularMovies") {
		section = elements.popularMoviesSection;
		lsIndex = "trendingMovies";
	} else {
		section = elements.popularTVSection;
		lsIndex = "trendingTV";
	}
	const sliderContainer = section.querySelector(".slider-container");
	const leftArrow = section.querySelector(".slider-left");
	const rightArrow = section.querySelector(".slider-right");
	const navDots = section.querySelectorAll(".slider-btn");

	const changeActiveSlide = () => {
		if (sliderContainer.children[0] !== undefined) {
			[...sliderContainer.children].forEach((child) => {
				child.classList.remove("active-slide");
			});
			sliderContainer.children[index].classList.add("active-slide");
		}
		sliderContainer.style.transform = `translateX(calc((100%) / 22 * -${index}))`;
	};
	const changeActiveDot = (next) => {
		navDots.forEach((dot) => {
			dot.removeAttribute("data-active");
		});
		next.setAttribute("data-active", true);
	};
	const sliderAnimation = () => {
		index > 20 ? (index = 1) : (index += 1);
		sliderContainer.style.transition = "transform 150ms ease-out";
		changeActiveSlide();
		changeActiveDot(navDots[index]);
		localStorage.setItem(lsIndex, index);
	};
	const onSliderEdge = (num) => {
		sliderContainer.style.transition = "none";
		changeActiveSlide();
		changeActiveDot(navDots[num]);
	};
	const navClickEvent = (e) => {
		if (e.currentTarget.classList.contains("slider-btn")) {
			index = [...navDots].findIndex((x) => x === e.currentTarget);
			changeActiveDot(e.currentTarget);
		} else {
			e.currentTarget === leftArrow ? (index -= 1) : (index += 1);
			changeActiveDot(navDots[index]);
		}
		sliderContainer.style.transition = `transform 0.15s ease-out`;
		changeActiveSlide();

		localStorage.setItem(lsIndex, index);
		clearInterval(animation);
		animation = setInterval(sliderAnimation, interval);
	};

	leftArrow.addEventListener("click", navClickEvent);
	rightArrow.addEventListener("click", navClickEvent);
	navDots.forEach((dot) => dot.addEventListener("click", navClickEvent));
	sliderContainer.addEventListener("transitionend", () => {
		if (index === 0) {
			index = 20;
		} else if (index === 21) {
			index = 1;
		}
		localStorage.setItem(lsIndex, index);
		onSliderEdge(parseInt(localStorage.getItem(lsIndex)));
	});
	sliderContainer.addEventListener("mouseover", () => clearInterval(animation));
	sliderContainer.addEventListener(
		"mouseleave",
		() => (animation = setInterval(sliderAnimation, interval))
	);

	if (!localStorage.getItem(lsIndex)) localStorage.setItem(lsIndex, 1);
	let index = parseInt(localStorage.getItem(lsIndex));

	changeActiveDot(navDots[index]);
	changeActiveSlide();
	animation = setInterval(sliderAnimation, interval);
};
export const pagination = (type) => {
	const firstPage = document.querySelector(".first-page");
	const previousPage = document.querySelector(".previous-page");
	const currentPage = document.querySelector(".current-page");
	const nextPage = document.querySelector(".next-page");
	const lastPage = document.querySelector(".last-page");
	const check = type === "search";
	let page = parseInt(global.search.urlParams.get("page"));

	const onClickEvent = () => {
		global.search.urlParams.set("page", page);
		location.search = global.search.urlParams.toString();
	};

	firstPage.addEventListener("click", () => {
		page = 1;
		onClickEvent();
	});
	previousPage.addEventListener("click", () => {
		if (page < 2) {
			page = 1;
		} else {
			page -= 1;
			onClickEvent();
		}
	});
	nextPage.addEventListener("click", () => {
		if (!check && page > 499) {
			page = 500;
		} else if (check && page > global.search.totalPages - 1) {
			page = global.search.totalPages;
		} else {
			page += 1;
			onClickEvent();
		}
	});
	lastPage.addEventListener("click", () => {
		if (check) {
			page = global.search.totalPages;
		} else {
			page = 500;
		}
		onClickEvent();
	});

	if (check) {
		getSearch(
			global.search.urlParams.get("radio"),
			global.search.urlParams.get("search-field"),
			page
		);
	} else {
		getGrid(type, page);
		currentPage.textContent = `${page} of 500`;
	}
};
export const instantScroll = (section) => {
	if (
		global.search.urlParams.get("page") === "1" &&
		section.id.includes("discover")
	)
		return;
	else
		scrollTo({
			top: section.offsetTop,
			behavior: "instant",
		});
};
export const removeUnderscores = (text) => {
	for (let i = 0; i < text.length; i += 1) {
		if (text[i] === "_") {
			text = text.replace("_", " ");
		}
	}
	return text;
};
export const capitalize = (text) => {
	return `${text[0].toUpperCase()}${text.slice(1, text.length)}`;
};

// Search
export const clearSearchPage = () => {
	[...elements.main.children].forEach((child) => {
		if (
			child.id === "search-page-results-section" ||
			child.classList.contains("pagination-section") ||
			child.classList.contains("break")
		)
			child.remove();
	});
};
export const checkSearchResults = (page) => {
	if (global.search.totalResults === 0) {
		clearSearchPage();
		if (global.search.urlParams.get("search-field") !== "noInputProvided") {
			createNoResults();
		}
	} else {
		const currentPage = document.querySelector(".current-page");
		const lastPage = document.querySelector(".last-page");

		if (page === global.search.totalPages) {
			elements.searchResultsInfo.textContent = `Results: \xA0\xA0 ${global.search.totalResults} of ${global.search.totalResults} `;
		} else {
			elements.searchResultsInfo.textContent = `Results: \xA0\xA0 ${
				global.search.results * page
			} of ${global.search.totalResults} `;
		}
		currentPage.textContent = `${page} of ${global.search.totalPages}`;
		lastPage.textContent = global.search.totalPages;
	}
};
