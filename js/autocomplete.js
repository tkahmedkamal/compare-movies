const _autocomplete = ({
  root,
  renderAnchorElement,
  inputValue,
  itemSelect,
  fetchData,
}) => {
  root.innerHTML = `
  <input
    type="text"
    class="compare__search site--radius"
    placeholder="Search For a Movie"
  />
  <div class="compare__dropdown">
  <div class="compare__dropdown-menu">
    <div class="compare__dropdown-content"></div>
  </div>
  </div>
`;

  const searchInput = root.querySelector(".compare__search");
  const dropdown = root.querySelector(".compare__dropdown");
  const dorpDownContent = root.querySelector(".compare__dropdown-content");

  const _onInput = async (event) => {
    const items = await fetchData(event.target.value);

    // Handling empty responses
    if (!items.length) {
      dropdown.classList.remove("is--active");
      return;
    }

    dropdown.classList.add("is--active");
    dorpDownContent.innerHTML = "";

    items.forEach((item) => {
      const { Title, imdbID } = item;
      const anchorElement = document.createElement("a");
      anchorElement.setAttribute("class", "compare__dropdown-item");
      anchorElement.innerHTML = renderAnchorElement(item);

      anchorElement.addEventListener("click", () => {
        dropdown.classList.remove("is--active");
        searchInput.value = inputValue(Title);
        itemSelect(imdbID);
      });

      dorpDownContent.appendChild(anchorElement);
    });
  };

  searchInput.addEventListener("keyup", _debounce(_onInput, 500));

  // When click outside root section, hide dropdown
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is--active");
    }
  });
};
