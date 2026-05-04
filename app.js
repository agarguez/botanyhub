let data = {};

fetch("data.json")
.then(r => r.json())
.then(json => {
  data = json;
  renderAll();
});

function renderAll(){
  Object.keys(data).forEach(type => render(type));
}

function render(type){
  const container = document.getElementById(type);
  if(!container) return;

  let html = `<h2>${type.toUpperCase()}</h2><div class="grid">`;

  data[type].forEach(item => {
    html += `
    <div class="card">
      <img src="${item.image}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="tags">
          ${(item.tags || []).map(t=>`<span>${t}</span>`).join("")}
        </div>
        ${item.url ? `<a href="${item.url}" target="_blank">Visitar</a>`:""}
      </div>
    </div>`;
  });

  html += "</div>";
  container.innerHTML = html;
}

function show(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* SEARCH */

document.getElementById("searchGlobal").addEventListener("input", e=>{
  const q = e.target.value.toLowerCase();

  Object.keys(data).forEach(type=>{
    const container = document.getElementById(type);

    let html = `<h2>${type.toUpperCase()}</h2><div class="grid">`;

    data[type]
      .filter(i =>
        (i.name + i.description + (i.tags||[]).join(" "))
        .toLowerCase()
        .includes(q)
      )
      .forEach(item=>{
        html += `
        <div class="card">
          <img src="${item.image}">
          <div class="card-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
        </div>`;
      });

    html += "</div>";
    container.innerHTML = html;
  });
});
