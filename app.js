let data = {};
let current = { search:"" };

fetch("data.json")
.then(r=>r.json())
.then(json=>{
  data=json;
  buildUI();
  buildCarousel();
  renderAll();
  checkMenu();
});

/* SECCIONES */
const sectionsInfo = {
  resources:{title:"Recursos",text:"Herramientas y bases de datos botánicas."},
  courses:{title:"Cursos",text:"Formación en botánica."},
  jobs:{title:"Empleo",text:"Oportunidades profesionales."},
  citizen:{title:"Ciencia ciudadana",text:"Plataformas colaborativas."},
  journals:{title:"Revistas científicas",text:"Publicaciones académicas."},
  societies:{title:"Sociedades científicas",text:"Organizaciones botánicas."},
  education:{title:"Educación",text:"Plataformas educativas."},
  books:{title:"Bibliografía",text:"Libros esenciales."}
};

/* UI */
function buildUI(){
  const main=document.getElementById("mainContent");
  const nav=document.getElementById("nav");

  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    const info=sectionsInfo[type];

    const btn=document.createElement("button");
    btn.innerText=info.title;
    btn.onclick=()=>scrollToSection(type,btn);
    nav.appendChild(btn);

    const sec=document.createElement("section");
    sec.id=type;
    sec.className="section";

    sec.innerHTML=`
      <h2>${info.title}</h2>
      <p>${info.text}</p>
      <div class="grid"></div>
    `;

    main.appendChild(sec);
  });
}

/* SCROLL */
function scrollToSection(id,btn){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});

  document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  document.getElementById("nav").classList.remove("open");
}

/* CAROUSEL */
let i=0;

function buildCarousel(){
  if(!data.news) return;

  const track=document.querySelector(".carousel-track");

  track.innerHTML=data.news.map(n=>`
    <div class="slide">
      <img src="${n.image}">
      <div class="slide-content">
        <h3>${n.title}</h3>
        <p>${n.description}</p>
      </div>
    </div>
  `).join("");

  setInterval(()=>{i=(i+1)%data.news.length;update();},4000);
  update();
}

function update(){
  document.querySelector(".carousel-track").style.transform=`translateX(-${i*100}%)`;
}

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

/* SEARCH */
document.getElementById("searchGlobal").addEventListener("input",e=>{
  current.search=e.target.value.toLowerCase();
  renderAll();
});

/* RESET */
function resetAll(){
  document.getElementById("searchGlobal").value="";
  current.search="";
  renderAll();
  window.scrollTo({top:0,behavior:"smooth"});
}

/* MENU */
function checkMenu(){
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".menu-toggle");

  const isMobile = window.innerWidth <= 768;

  if(isMobile){
    toggle.style.display = "block";
    nav.classList.remove("open");
  } else {
    if(nav.scrollWidth > nav.clientWidth){
      toggle.style.display = "block";
    } else {
      toggle.style.display = "none";
      nav.classList.remove("open");
    }
  }
}

window.addEventListener("resize",checkMenu);

document.querySelector(".menu-toggle").addEventListener("click",()=>{
  document.getElementById("nav").classList.toggle("open");
});
