let data = {};
let current = { search:"", category:"", level:"", tag:"" };

/* FETCH */
fetch("data.json")
.then(r=>r.json())
.then(json=>{
  data=json;
  buildUI();
  populateFilters();
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

/* CAROUSEL */
let slideIndex=0, interval;

function buildCarousel(){
  const track=document.querySelector(".carousel-track");
  const dots=document.querySelector(".carousel-dots");

  if(!data.news) return;

  track.innerHTML=data.news.map(n=>`
    <div class="slide">
      <img src="${n.image}">
      <div class="slide-content">
        <h3>${n.title}</h3>
        <p>${n.description}</p>
        <a href="${n.url}" target="_blank">Leer más →</a>
      </div>
    </div>
  `).join("");

  dots.innerHTML=data.news.map((_,i)=>`<span onclick="goToSlide(${i})"></span>`).join("");

  startAuto();
  updateCarousel();

  /* swipe */
  let startX=0;
  track.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
  track.addEventListener("touchend",e=>{
    let endX=e.changedTouches[0].clientX;
    if(endX-startX>50) prevSlide();
    if(startX-endX>50) nextSlide();
  });

  /* hover pause */
  const carousel=document.getElementById("carousel");
  carousel.addEventListener("mouseenter",stopAuto);
  carousel.addEventListener("mouseleave",startAuto);
}

function updateCarousel(){
  const track=document.querySelector(".carousel-track");
  track.style.transform=`translateX(-${slideIndex*100}%)`;

  document.querySelectorAll(".carousel-dots span")
    .forEach((d,i)=>d.classList.toggle("active",i===slideIndex));
}

function nextSlide(){
  slideIndex=(slideIndex+1)%data.news.length;
  updateCarousel();
}

function prevSlide(){
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
  clearInterval(interval);
}

document.addEventListener("click",e=>{
  if(e.target.classList.contains("next")) nextSlide();
  if(e.target.classList.contains("prev")) prevSlide();
});

/* RENDER */
function renderAll(){
  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    const container=document.querySelector(`#${type} .grid`);
    if(!container) return;

    let items=data[type].filter(i=>{
      let text=(i.name+i.description+(i.tags||[]).join(" ")).toLowerCase();
      return text.includes(current.search);
    });

    container.innerHTML=items.map(card).join("");
  });
}

function card(i){
  return `
  <div class="card">
    <img src="${i.image}">
    <div class="card-content">
      <h3>${i.name}</h3>
      <p>${i.description}</p>
      <div class="tags">
        ${(i.tags||[]).map(t=>`<span>${t}</span>`).join("")}
      </div>
      ${i.url?`<a href="${i.url}" target="_blank">Visitar</a>`:""}
    </div>
  </div>`;
}

/* FILTERS */
function populateFilters(){}

document.getElementById("searchGlobal").addEventListener("input",e=>{
  current.search=e.target.value.toLowerCase();
  renderAll();
});
