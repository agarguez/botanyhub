let data={};

/* LOAD DATA */
fetch("data.json")
.then(r=>r.json())
.then(json=>{
  data=json;
  buildCarousel();
});

/* GLOBAL SEARCH */
document.getElementById("searchGlobal")?.addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();

  const results=[];
  Object.keys(data).forEach(type=>{
    if(type==="news") return;

    data[type].forEach(i=>{
      if((i.name+i.description+(i.tags||[]).join(" ")).toLowerCase().includes(q)){
        results.push(i);
      }
    });
  });

  const container=document.getElementById("results");
  const section=document.querySelector(".results-section");

  if(q.length===0){
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");

  container.innerHTML=results.map(card).join("");
});

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

  setInterval(()=>{i=(i+1)%data.news.length;update();},4000);
  update();
}

function update(){
  document.querySelector(".carousel-track").style.transform=`translateX(-${i*100}%)`;
}

function go(n){i=n;update();}

/* RESET */
function resetAll(){
  localStorage.clear();
  location.reload();
}

/* MENU */
document.querySelector(".menu-toggle")?.addEventListener("click",()=>{
  document.querySelector("nav").classList.toggle("open");
});
