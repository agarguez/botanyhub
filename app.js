let data = {};
let currentFilter = {
  search: "",
  category: "",
  level: "",
  tag: ""
};

fetch("data.json")
.then(r => r.json())
.then(json => {
  data = json;
  buildSections();
  populateFilters();
  renderAll();
});

/* CREAR SECCIONES AUTOMÁTICAMENTE */
function buildSections(){
  const main = document.getElementById("mainContent");

  Object.keys(data).forEach(type=>{
    const section = document.createElement("section");
    section.id = type;
    section.className = "section hidden";

    section.innerHTML = `
      <h2>${type.toUpperCase()}</h2>
      <div class="grid"></div>
    `;

    main.appendChild(section);
  });

  show("resources");
}

/* RENDER */
function renderAll(){
  Object.keys(data).forEach(type=>{
    const container = document.querySelector(`#${type} .grid`);
    if(!container) return;

    const filtered = data[type].filter(item=>{
      const text = (item.name + item.description + (item.tags||[]).join(" ")).toLowerCase();

      return (
        text.includes(currentFilter.search) &&
        (!currentFilter.category || item.category === currentFilter.category) &&
        (!currentFilter.level || item.level === currentFilter.level) &&
        (!currentFilter.tag || (item.tags||[]).includes(currentFilter.tag))
      );
    });

    container.innerHTML = filtered.map(card).join("");
  });
}

/* CARD */
function card(item){
  return `
  <div class="card">
    <img src="${item.image}">
    <div class="card-content">
      <h3>${item.name}</h3>
      <p>${item.description}</p>

      <div class="tags">
        ${(item.tags||[]).map(t=>`<span onclick="filterTag('${t}')">${t}</span>`).join("")}
      </div>

      ${item.url ? `<a href="${item.url}" target="_blank">Visitar</a>` : ""}
    </div>
  </div>
  `;
}

/* NAV */
function show(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}

/* FILTROS */
function populateFilters(){
  const categories = new Set();
  const levels = new Set();

  Object.values(data).flat().forEach(item=>{
    if(item.category) categories.add(item.category);
    if(item.level) levels.add(item.level);
  });

  const catSelect = document.getElementById("filterCategory");
  const lvlSelect = document.getElementById("filterLevel");

  categories.forEach(c=>{
    catSelect.innerHTML += `<option value="${c}">${c}</option>`;
  });

  levels.forEach(l=>{
    lvlSelect.innerHTML += `<option value="${l}">${l}</option>`;
  });
}

/* EVENTOS */
document.getElementById("searchGlobal").addEventListener("input", e=>{
  currentFilter.search = e.target.value.toLowerCase();
  renderAll();
});

document.getElementById("filterCategory").addEventListener("change", e=>{
  currentFilter.category = e.target.value;
  renderAll();
});

document.getElementById("filterLevel").addEventListener("change", e=>{
  currentFilter.level = e.target.value;
  renderAll();
});

function filterTag(tag){
  currentFilter.tag = tag;
  renderAll();
}
