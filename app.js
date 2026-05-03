let data = {};

fetch("data.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    renderAll();
  });

function renderAll() {
  render("resources");
  render("courses");
  render("jobs");
}

function render(type) {
  const container = document.getElementById(type + "List");
  container.innerHTML = "";

  data[type].forEach(item => {
    container.innerHTML += `
      <div class="card">
        <img src="${item.image}">
        <div class="card-content">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <a href="${item.url}" target="_blank">Visitar →</a>
        </div>
      </div>
    `;
  });
}

/* navegación */
function show(section) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(section).classList.remove("hidden");
}

/* buscador global */
document.getElementById("searchGlobal").addEventListener("input", function(e) {
  const q = e.target.value.toLowerCase();

  ["resources","courses","jobs"].forEach(type => {
    const container = document.getElementById(type + "List");
    container.innerHTML = "";

    data[type]
      .filter(i => i.name.toLowerCase().includes(q))
      .forEach(item => {
        container.innerHTML += `
          <div class="card">
            <img src="${item.image}">
            <div class="card-content">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <a href="${item.url}" target="_blank">Visitar →</a>
            </div>
          </div>
        `;
      });
  });
});
