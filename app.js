let data = {};

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    render("resources");
    render("courses");
    render("jobs");
  });

function render(type) {
  const container = document.getElementById(type + "List");
  container.innerHTML = "";

  data[type].forEach(item => {
    container.innerHTML += card(item);
  });
}

function card(item) {
  return `
    <div class="card">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a href="${item.url}" target="_blank">Visitar →</a>
    </div>
  `;
}

function show(section) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(section).classList.remove("hidden");
}

function filter(type, query) {
  const container = document.getElementById(type + "List");
  container.innerHTML = "";

  data[type]
    .filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    .forEach(item => {
      container.innerHTML += card(item);
    });
}
