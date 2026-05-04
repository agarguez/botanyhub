function loadSection(type){
  fetch("data.json")
  .then(r=>r.json())
  .then(data=>{
    const container=document.getElementById("content");

    container.innerHTML=data[type].map(i=>`
      <div class="card" onclick="window.open('${i.url}','_blank')">
        <img src="${i.image}">
        <div class="card-content">
          <h3>${i.name}</h3>
          <p>${i.description}</p>
        </div>
      </div>
    `).join("");
  });
}
