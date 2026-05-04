let data = {};
let current = { search:"" };

fetch("data.json")
.then(r=>r.json())
.then(json=>{
  data=json;
  buildUI();
  buildCarousel();
  renderAll();
});

/* TITLES */
const titles = {
  resources:"Recursos",
  courses:"Cursos",
  jobs:"Empleo",
  citizen:"Ciencia ciudadana",
  journals:"Revistas científicas",
  societies:"Sociedades científicas",
  education:"Educación",
  books:"Bibliografía"
};

/* UI */
function buildUI(){
  const main=document.getElementById("mainContent");
  const nav=document.getElementById("nav");

  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    const btn=document.createElement("button");
    btn.innerText=titles[type] || type;
    btn.onclick=()=>show(type,btn);
    nav.appendChild(btn);

    const sec=document.createElement("section");
    sec.id=type;
    sec.className="section";
    sec.innerHTML=`<h2>${titles[type]}</h2><div class="grid"></div>`;
    main.appendChild(sec);
  });
}

/* CAROUSEL */
let i=0;

function buildCarousel(){
  if(!data.news) return;

  const track=document.querySelector(".carousel-track");
  const dots=document.querySelector(".carousel-dots");

  track.innerHTML=data.news.map(n=>`
    <div class="slide">
      <img src="${n.image}">
      <div class="slide-content">
        <h3>${n.title}</h3>
        <p>${n.description}</p>
      </div>
    </div>
  `).join("");

  dots.innerHTML=data.news.map((_,idx)=>`<span onclick="go(${idx})"></span>`).join("");

  setInterval(()=>{i=(i+1)%data.news.length; update();},4000);
  update();
}

function update(){
  document.querySelector(".carousel-track").style.transform=`translateX(-${i*100}%)`;
  document.querySelectorAll(".carousel-dots span")
    .forEach((d,idx)=>d.classList.toggle("active",idx===i));
}

function go(n){ i=n; update(); }

/* RENDER */
function renderAll(){
  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    const container=document.querySelector(`#${type} .grid`);
    if(!container) return;

    const items=data[type].filter(i=>{
      return (i.name+i.description).toLowerCase().includes(current.search);
    });

    container.innerHTML=items.map(card).join("");
  });
}

/* CARD */
function card(i){
  return `
  <div class="card" onclick="openLink('${i.url}')">
    <img src="${i.image}">
    <div class="card-content">
      <h3>${i.name}</h3>
      <p>${i.description}</p>
    </div>
  </div>`;
}

function openLink(url){
  if(url) window.open(url,"_blank");
}

/* NAV */
function show(id,btn){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";

  document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}

/* SEARCH */
document.getElementById("searchGlobal").addEventListener("input",e=>{
  current.search=e.target.value.toLowerCase();
  renderAll();
});
