let data = {};

/* ================================
   FETCH DATA
================================ */
fetch("data.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    renderAll();
  });

/* ================================
   RENDER ALL SECTIONS
================================ */
function renderAll() {
  Object.keys(data).forEach(type => {
    if (document.querySelector(`#${type} .grid`)) {
      render(type, data[type]);
    }
  });
}

/* ================================
   RENDER SECTION
================================ */
function render(type, items) {
  const container = document.querySelector(`#${type} .grid`);
  if (!container) return;

  container.innerHTML = items.map(item => cardTemplate(item)).join("");
}

/* ================================
   CARD TEMPLATE
================================ */
function cardTemplate(item) {
  return `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>

        <div class="tags">
          ${(item.tags || []).map(t => `<span>${t}</span>`).join("")}
        </div>

        ${item.url ? `<a href="${item.url}" target="_blank">Visitar →</a>` : ""}
      </div>
    </div>
  `;
}

/* ================================
   NAVIGATION
================================ */
function show(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(id);
  if (section) section.classList.remove("hidden");
}

/* ================================
   SEARCH (GLOBAL)
================================ */
const searchInput = document.getElementById("searchGlobal");

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();

  Object.keys(data).forEach(type => {
    const container = document.querySelector(`#${type} .grid`);
    if (!container) return;

    const filtered = data[type].filter(item => {
      const text = (
        item.name +
        item.description +
        (item.tags || []).join(" ")
      ).toLowerCase();

      return text.includes(q);
    });

    render(type, filtered);
  });
});
