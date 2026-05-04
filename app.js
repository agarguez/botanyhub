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

/* UI */
function buildUI(){
  const main=document.getElementById("mainContent");
  const nav=document.getElementById("nav");

  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    const btn=document.createElement("button");
    btn.innerText=type;
    btn.onclick=()=>show(type,btn);
    nav.appendChild(btn);

    const sec=document.createElement("section");
    sec.id=type;
    sec.className="section";
    sec.innerHTML=`<h2>${type}</h2><div class="grid"></div>`;
    main.appendChild(sec);
  });
}

/* CAROUSEL SEGURO */
let slideIndex=0;
let interval=null;

function buildCarousel(){
  if(!data.news || !Array.isArray(data.news) || data.news.length===0){
    document.getElementById("carousel").style.display="none";
    return;
  }

  const track=document.querySelector(".carousel-track");
  const dots=document.querySelector(".carousel-dots");

  track.innerHTML=data.news.map(n=>`
    <div class="slide">
      <img src="${n.image || ''}">
      <div class="slide-content">
        <h3>${n.title}</h3>
        <p>${n.description}</p>
        ${n.url ? `<a href="${n.url}" target="_blank">Leer más →</a>` : ""}
      </div>
    </div>
  `).join("");

  dots.innerHTML=data.news.map((_,i)=>`<span data-i="${i}"></span>`).join("");

  document.querySelectorAll(".carousel-dots span").forEach(d=>{
    d.onclick=()=>goToSlide(parseInt(d.dataset.i));
  });

  document.querySelector(".next").onclick=nextSlide;
  document.querySelector(".prev").onclick=prevSlide;

  startAuto();
  updateCarousel();
}

function updateCarousel(){
  const track=document.querySelector(".carousel-track");
  if(!track) return;

  track.style.transform=`translateX(-${slideIndex*100}%)`;

  document.querySelectorAll(".carousel-dots span")
    .forEach((d,i)=>d.classList.toggle("active",i===slideIndex));
}

function nextSlide(){
  if(!data.news) return;
  slideIndex=(slideIndex+1)%data.news.length;
  updateCarousel();
}

function prevSlide(){
  if(!data.news) return;
  slideIndex=(slideIndex-1+data.news.length)%data.news.length;
  updateCarousel();
}

function goToSlide(i){
  slideIndex=i;
  updateCarousel();
}

function startAuto(){
  stopAuto();
  interval=setInterval(nextSlide,4000);
}

function stopAuto(){
  if(interval) clearInterval(interval);
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

function card(i){
  return `
  <div class="card">
    <img src="${i.image || ''}">
    <div class="card-content">
      <h3>${i.name}</h3>
      <p>${i.description}</p>
      ${i.url?`<a href="${i.url}" target="_blank">Visitar</a>`:""}
    </div>
  </div>`;
}

function show(id,btn){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";

  document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
}

document.getElementById("searchGlobal").addEventListener("input",e=>{
  current.search=e.target.value.toLowerCase();
  renderAll();
});
