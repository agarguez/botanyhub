let data = {};
let current = { search:"", category:"", level:"", tag:"" };

fetch("data.json")
.then(r=>r.json())
.then(json=>{
  data=json;
  buildUI();
  populateFilters();
  renderAll();
});

/* UI */
function buildUI(){
  const main = document.getElementById("mainContent");
  const nav = document.getElementById("nav");

  Object.keys(data).forEach(type=>{
    // NAV
    const btn = document.createElement("button");
    btn.innerText = type;
    btn.onclick = ()=>show(type, btn);
    nav.appendChild(btn);

    // SECTION
    const sec = document.createElement("section");
    sec.id = type;
    sec.className = "section";

    sec.innerHTML = `<h2>${type}</h2><div class="grid"></div>`;
    main.appendChild(sec);
  });
}

/* RENDER */
function renderAll(){
  Object.keys(data).forEach(type=>{
    const container = document.querySelector(`#${type} .grid`);
    if(!container) return;

    let items = data[type].filter(item=>{
      let text = (item.name+item.description+(item.tags||[]).join(" ")).toLowerCase();
      return text.includes(current.search)
        && (!current.category || item.category===current.category)
        && (!current.level || item.level===current.level)
        && (!current.tag || (item.tags||[]).includes(current.tag));
    });

    if(items.length===0){
      container.innerHTML = "<p>No hay resultados</p>";
      return;
    }

    container.innerHTML = items.map(card).join("");
  });
}

/* CARD */
function card(i){
  return `
  <div class="card">
    <img src="${i.image}">
    <div class="card-content">
      <h3>${i.name}</h3>
      <p>${i.description}</p>

      <div class="tags">
        ${(i.tags||[]).map(t=>`<span onclick="setTag('${t}')">${t}</span>`).join("")}
      </div>

      ${i.url ? `<a href="${i.url}" target="_blank">Visitar →</a>`:""}
    </div>
  </div>`;
}

/* NAV */
function show(id, btn){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";

  document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");

  window.scrollTo({top:0,behavior:"smooth"});
}

/* FILTERS */
function populateFilters(){
  const cat = new Set();
  const lvl = new Set();

  Object.values(data).flat().forEach(i=>{
    if(i.category) cat.add(i.category);
    if(i.level) lvl.add(i.level);
  });

  cat.forEach(c=>{
    document.getElementById("filterCategory").innerHTML += `<option>${c}</option>`;
  });

  lvl.forEach(l=>{
    document.getElementById("filterLevel").innerHTML += `<option>${l}</option>`;
  });
}

/* EVENTS */
document.getElementById("searchGlobal").addEventListener("input", e=>{
  current.search = e.target.value.toLowerCase();
  renderAll();
});

document.getElementById("filterCategory").addEventListener("change", e=>{
  current.category = e.target.value;
  renderAll();
});

document.getElementById("filterLevel").addEventListener("change", e=>{
  current.level = e.target.value;
  renderAll();
});

function setTag(tag){
  current.tag = (current.tag===tag) ? "" : tag;
  renderAll();
}
