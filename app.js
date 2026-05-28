const list = document.getElementById('list');
const search = document.getElementById('search');

function render(data){
  list.innerHTML = "";
  data.forEach(m => {
    const div = document.createElement('div');
    div.className = "card";
    div.innerHTML = `<h3>${m.title}</h3><a href="${m.link}" target="_blank">Abrir</a>`;
    list.appendChild(div);
  });
}

render(manhwas);

search.addEventListener('input', e => {
  const value = e.target.value.toLowerCase();
  render(manhwas.filter(m => m.title.toLowerCase().includes(value)));
});
