const introBtn = document.querySelector(".intro__btn");
const compareSection = document.querySelector(".compare");
const defaultImageSrc = "https://bit.ly/3u6e5ye";

// Show compare section when pressing the intro button
introBtn.addEventListener("click", () => (compareSection.style.top = "0"));

// Autocomplete config
const autocompleteConfig = {
  renderAnchorElement(item) {
    const checkImage = item.Poster === "N/A" ? defaultImageSrc : item.Poster;
    return `
      <img src="${checkImage}" alt="${item.Title}" />
      ${item.Title}
    `;
  },

  inputValue(item) {
    return item;
  },

  itemSelect(imdbID) {
    _onItemSelect(imdbID, document.querySelector(".compare__left-details"));
  },

  async fetchData(term) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "30bf4535",
        s: term,
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};

// Autocomplete Function, Left Side
_autocomplete({
  ...autocompleteConfig,
  root: document.querySelector(".compare__left-root"),
  itemSelect(imdbID) {
    document.querySelector(".compare__msg").classList.add("is--hide");
    _onItemSelect({
      id: imdbID,
      selector: document.querySelector(".compare__left-details"),
      side: "left",
    });
  },
});

// Autocomplete Function, Right Side
_autocomplete({
  ...autocompleteConfig,
  root: document.querySelector(".compare__right-root"),
  itemSelect(imdbID) {
    document.querySelector(".compare__msg").classList.add("is--hide");
    _onItemSelect({
      id: imdbID,
      selector: document.querySelector(".compare__right-details"),
      side: "right",
    });
  },
});

let leftItem;
let rightItem;
const _onItemSelect = async ({ id, selector, side }) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "30bf4535",
      i: id,
    },
  });
  selector.innerHTML = _itemTemplate(response.data);

  if (side === "left") {
    leftItem = response.data;
  } else {
    rightItem = response.data;
  }

  if (leftItem && rightItem) {
    runComparison();
  }
};

/* 
 ** Comparison between the right and the left side by:
  - Awards
  - BoxOffice
  - Metascore
  - imdb Rating
  - imdb Votes
*/
const runComparison = () => {
  const leftSideItems = document.querySelectorAll(
    ".compare__left-details .compare__list"
  );
  const rightSideItems = document.querySelectorAll(
    ".compare__right-details .compare__list"
  );

  leftSideItems.forEach((leftState, index) => {
    const rightState = rightSideItems[index];

    const leftSideItemsValue = parseInt(leftState.dataset.value);
    const rightSideItemsValue = parseInt(rightState.dataset.value);

    if (rightSideItemsValue > leftSideItemsValue) {
      leftState.classList.remove("is--success");
      leftState.classList.add("is--failure");
    } else if (leftSideItemsValue > rightSideItemsValue) {
      rightState.classList.remove("is--success");
      rightState.classList.add("is--failure");
    } else {
      leftState.classList.add("is--equal");
      rightState.classList.add("is--equal");
    }
  });
};

const _itemTemplate = ({
  Poster,
  Title,
  Genre,
  Plot,
  Awards,
  BoxOffice,
  Metascore,
  imdbRating,
  imdbVotes,
}) => {
  const dollars = parseInt(BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
  const metascore = parseInt(Metascore);
  const imdbRate = parseFloat(imdbRating);
  const imdbVote = parseInt(imdbVotes.replace(/,/g, ""));

  const awards = Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
    <article class="compare__media">
      <figure class="compare__media-figure">
        <img
          src="${Poster}"
          alt="${Title}"
          class="compare__media-image"
        />
      </figure>
      <section class="compare__media-content">
        <h2 class="compare__media-title">${Title}</h2>
        <h4 class="compare__media-subtitle">${Genre}</h4>
        <p class="compare__media-para">${Plot}</p>
      </section>
    </article>

    <div data-value="${awards}" class="compare__list is--success site--radius">
      <h3 class="compare__list-title">${Awards}</h3>
      <p class="compare__list-subtitle">awards</p>
    </div>
    <div data-value="${dollars}" class="compare__list is--success site--radius">
      <h3 class="compare__list-title">${BoxOffice}</h3>
      <p class="compare__list-subtitle">box office</p>
    </div>
    <div data-value="${metascore}" class="compare__list is--success site--radius">
      <h3 class="compare__list-title">${Metascore}</h3>
      <p class="compare__list-subtitle">metascore</p>
    </div>
    <div data-value="${imdbRate}" class="compare__list is--success site--radius">
      <h3 class="compare__list-title">${imdbRating}</h3>
      <p class="compare__list-subtitle">imdb rating</p>
    </div>
    <div data-value="${imdbVote}" class="compare__list is--success site--radius">
      <h3 class="compare__list-title">${imdbVotes}</h3>
      <p class="compare__list-subtitle">imdb votes</p>
    </div>
  `;
};
