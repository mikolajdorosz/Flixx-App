import { img, elements } from "./constants.js";
import { removeUnderscores, capitalize } from "./functions.js";

export const createNowPlayingItem = (obj, genres) => {
	const gridItem = document.createElement("a");
	gridItem.href = `movie-details.html?id=${obj.id}`;
	gridItem.className = "gen-details-item content-container";

	const itemPoster = document.createElement("img");
	itemPoster.className = "gen-details-poster";
	itemPoster.src = `${img.url}${img.quality.poster}${obj.poster_path}`;

	const infoContainer = document.createElement("div");
	infoContainer.className = "gen-details-info content-container";

	const topInfo = document.createElement("div");
	topInfo.className = "gen-top-info content-container";

	const title = document.createElement("div");
	title.className = "gen-details-title section-title content-container";
	const titleText = document.createTextNode(obj.title);
	const overview = document.createElement("div");
	overview.className = "gen-details-overview info content-container";
	const overviewText = document.createTextNode(obj.overview);
	const genre = document.createElement("div");
	genre.className = "gen-details-genres info content-container";
	const genreText = document.createTextNode(genres);

	title.appendChild(titleText);
	overview.appendChild(overviewText);
	topInfo.appendChild(title);
	topInfo.appendChild(overview);
	genre.appendChild(genreText);
	infoContainer.appendChild(topInfo);
	infoContainer.appendChild(genre);
	gridItem.appendChild(itemPoster);
	gridItem.appendChild(infoContainer);
	elements.nowPlayingContainer.appendChild(gridItem);
};
export const createSlide = (obj, container, index, x = "append") => {
	const slide = document.createElement("a");
	slide.className = `slide content-container`;
	if (index === 0) slide.classList.add("active-slide");
	obj.title
		? (slide.href = `movie-details.html?id=${obj.id}`)
		: (slide.href = `tv-details.html?id=${obj.id}`);

	obj.backdrop_path
		? (slide.style.background = `url(${img.url}${img.quality.slide}${obj.backdrop_path}) center center / 100%`)
		: (slide.style.background = "transparent");

	const title = document.createElement("div");
	title.className =
		"slider-title slider-info section-title content-container";
	const titleText = obj.title || obj.name;

	const avgVote = document.createElement("div");
	avgVote.className =
		"slider-vote slider-info section-title content-container";
	avgVote.innerHTML = `
	<strong style="font-size: 8vh; margin-right: 2vh"><i class="fa-solid fa-star"></i></strong>
	`;
	const voteText = document.createTextNode(
		`${Math.round(obj.vote_average)} / 10`
	);

	title.append(titleText);
	avgVote.appendChild(voteText);
	slide.append(title);
	slide.appendChild(avgVote);
	if (x === "append") container.appendChild(slide);

	return slide;
};
export const createGridItem = (obj, container) => {
	const gridItem = document.createElement("a");
	gridItem.className = `hidden-grid-item content-container`;
	obj.title
		? (gridItem.href = `movie-details.html?id=${obj.id}`)
		: (gridItem.href = `tv-details.html?id=${obj.id}`);

	const posterImg = document.createElement("img");
	posterImg.className = "poster-img content-container";
	if (obj.poster_path) {
		gridItem.style.backgroundImage = `url(${img.url}${img.quality.grid}${obj.poster_path})`;
		posterImg.src = `${img.url}${img.quality.grid}${obj.poster_path}`;
	} else {
		gridItem.style.background = "transparent";
		posterImg.src = "../img/flixx_poster.png";
	}

	const title = document.createElement("div");
	title.className = "title section-title content-container";
	const titleText = obj.title || obj.name;

	title.append(titleText);
	gridItem.appendChild(posterImg);
	gridItem.appendChild(title);
	container.appendChild(gridItem);
};
export const createGeneralInfo = (obj, section, container) => {
	obj.backdrop_path
		? (section.style.background = `url(${img.url}${img.quality.backdrop}${obj.backdrop_path}) center center / 100%`)
		: (section.style.background = "transparent");

	container.classList.add("gen-details-item");

	const posterImg = document.createElement("img");
	posterImg.className = "gen-details-poster";
	obj.poster_path
		? (posterImg.src = `${img.url}${img.quality.poster}${obj.poster_path}`)
		: (posterImg.src = "../img/flixx_poster.png");

	const generalContainer = document.createElement("div");
	generalContainer.className = "gen-details-info content-container";

	const topInfo = document.createElement("div");
	topInfo.className = "gen-top-info content-container";

	const title = document.createElement("div");
	title.className = "gen-details-title section-title content-container";
	const titleText = obj.title || obj.name;

	const overview = document.createElement("div");
	overview.className = "gen-details-overview info content-container";
	const overviewText = document.createTextNode(obj.overview);

	const genres = document.createElement("div");
	genres.className = "gen-details-genres info content-container";
	let genresText = "";
	obj.genres.forEach((g, index) => {
		genresText += `${g.name}, `;
		if (index === obj.genres.length - 1) {
			genresText = genresText.slice(0, genresText.length - 2);
		}
	});

	title.append(titleText);
	overview.appendChild(overviewText);
	topInfo.appendChild(title);
	topInfo.appendChild(overview);
	genres.append(genresText);
	generalContainer.appendChild(topInfo);
	generalContainer.appendChild(genres);
	container.appendChild(posterImg);
	container.appendChild(generalContainer);
};
export const createMoreInfo = (obj, container, keys) => {
	for (let i of keys) {
		for (let [key, value] of Object.entries(obj)) {
			if (key === i) {
				const item = document.createElement("div");
				item.className = "details-tile content-container";

				const itemName = document.createElement("div");
				itemName.className =
					"details-name section-title content-container";
				let itemValue;
				if (key === "homepage" && value) {
					itemValue = document.createElement("a");
					itemValue.href = value;
					itemValue.target = "blank";
					itemValue.className = "link";
				} else {
					itemValue = document.createElement("div");
				}
				itemValue.classList.add(
					"details-value",
					"info",
					"content-container"
				);

				let itemText = "";
				if (key === "production_companies") {
					value.forEach((g) => {
						itemText += `${capitalize(g.name)}\n`;
					});
				} else {
					itemText = value.toString();
					if (key === "runtime") {
						itemText += " min";
					} else if (key === "vote_average") {
						itemText = `${Math.round(parseFloat(itemText))} / 10`;
					} else if (key === "budget" || key === "revenue") {
						let num = "";
						for (let i = 0; i < itemText.length; i += 1) {
							num += itemText[itemText.length - 1 - i];
							if (
								(i + 1) % 3 === 0 &&
								i + 1 !== itemText.length
							) {
								num += ".";
							}
						}
						itemText = `${[...num].reverse().join("")} $`;
					} else if (key === "in_production") {
						if (value) itemText = "Yes";
						else itemText = "No";
					}
				}
				if (!value || value.length === 0) itemText = "No data :(";

				itemName.append(removeUnderscores(key));
				itemValue.append(itemText);
				item.appendChild(itemName);
				item.appendChild(itemValue);
				container.appendChild(item);
			}
		}
	}
};
export const createError = () => {
	document.body.className = "error-body content-container";
	[...document.body.children].forEach((child) => child.remove());

	const div = document.createElement("div");
	div.className = "error-msg section-title";
	div.innerHTML = `<strong style="font-size: 6vh">Uuups!</strong> <br/> I cannot find this page :(`;
	document.body.appendChild(div);
};
export const createNoResults = () => {
	const div = document.createElement("div");
	div.classList.add("no-results", "content-container", "section-title");
	div.textContent = "no results found!";
	elements.searchPageFormSection.firstElementChild.appendChild(div);
};
