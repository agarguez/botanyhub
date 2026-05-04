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

/* TITLES + DESCRIPCIÓN */
const sectionsInfo = {
  resources:{
    title:"Recursos",
    text:"Herramientas digitales y bases de datos para identificar y estudiar plantas."
  },
  courses:{
    title:"Cursos",
    text:"Formación académica y online en botánica."
  },
  jobs:{
    title:"Empleo",
    text:"Oportunidades profesionales en el ámbito botánico."
  },
  citizen:{
    title:"Ciencia ciudadana",
    text:"Plataformas colaborativas de biodiversidad."
  },
  journals:{
    title:"Revistas científicas",
    text:"Publicaciones académicas de referencia."
  },
  societies:{
    title:"Sociedades científicas",
    text:"Organizaciones dedicadas a la botánica."
  },
  education:{
    title:"Educación",
    text:"Recursos formativos y plataformas educativas."
  },
  books:{
    title:"Bibliografía",
    text:"Libros clave para el estudio botánico."
  }
};

/* UI */
function buildUI(){
  const main=document.getElementById("mainContent");
  const nav=document.getElementById("nav");

  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    const info = sectionsInfo[type] || {title:type,text:""};

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

/* MOBILE MENU */
document.querySelector(".menu-toggle").addEventListener("click",()=>{
  document.getElementById("nav").classList.toggle("open");
});
