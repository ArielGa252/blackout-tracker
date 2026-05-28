async function loadManhwas(){
    const response = await fetch("manhwas.json");
    const manhwas = await response.json();
    const grid = document.getElementById("grid");
    const search = document.getElementById("search");

    function limparTitulo(titulo) {
        if (!titulo) return "Sem Nome";
        return titulo.replace(/\s*[\-\|]\s*Black[oO]ut\s*Comics.*/i, "").trim();
    }

    function getData(nome){
        const nomeLimpo = limparTitulo(nome);
        return JSON.parse(localStorage.getItem(nomeLimpo)) || {
            readed: false,
            chapter: "",
            completed: false
        };
    }

    function saveData(nome, data){
        const nomeLimpo = limparTitulo(nome);
        localStorage.setItem(nomeLimpo, JSON.stringify(data));
        updateStats();
    }

    function updateStats(){
        let readed = 0;
        let completed = 0;
        manhwas.forEach(m => {
            // O código agora entende tanto "nome" (antigo) quanto "titulo" (novo)
            const tituloCorreto = m.titulo || m.nome;
            if(!tituloCorreto) return;
            
            const data = getData(tituloCorreto); 
            if(data.readed) readed++;
            if(data.completed) completed++;
        });
        document.getElementById("total").innerText = manhwas.length;
        document.getElementById("readed").innerText = readed;
        document.getElementById("completed").innerText = completed;
    }

    function render(lista){
        grid.innerHTML = "";
        lista.forEach(manhwa => {
            const tituloCorreto = manhwa.titulo || manhwa.nome;
            if(!tituloCorreto) return;
            
            const data = getData(tituloCorreto); 
            const nomeExibicao = limparTitulo(tituloCorreto);
            const imagemCapa = manhwa.capa || manhwa.imagem || 'https://via.placeholder.com/400x220';
            const linkUrl = manhwa.url || manhwa.link;
            
            const card = document.createElement("div");
            card.className = "card";
            if(data.completed){
                card.classList.add("completed");
            }
            card.innerHTML = `
                <img class="cover" src="${imagemCapa}" alt="${nomeExibicao}" referrerpolicy="no-referrer">
                <div class="title">
                    <a href="${linkUrl}" target="_blank">${nomeExibicao}</a>
                </div>
                <div class="info">Último capítulo: ${manhwa.capitulo || '?'}</div>
                <div class="controls">
                    <label><input type="checkbox" class="readed"> Já li</label>
                    <input type="number" class="chapter" placeholder="Capítulo atual">
                    <label><input type="checkbox" class="completedCheck"> Finalizado</label>
                </div>
            `;
            const readed = card.querySelector(".readed");
            const chapter = card.querySelector(".chapter");
            const completed = card.querySelector(".completedCheck");
            
            readed.checked = data.readed;
            chapter.value = data.chapter;
            completed.checked = data.completed;
            
            readed.addEventListener("change", () => {
                data.readed = readed.checked;
                saveData(tituloCorreto, data);
            });
            chapter.addEventListener("input", () => {
                data.chapter = chapter.value;
                saveData(tituloCorreto, data);
            });
            completed.addEventListener("change", () => {
                data.completed = completed.checked;
                if(data.completed){
                    card.classList.add("completed");
                }else{
                    card.classList.remove("completed");
                }
                saveData(tituloCorreto, data);
            });
            grid.appendChild(card);
        });
        updateStats();
    }

    search.addEventListener("input", () => {
        const value = search.value.toLowerCase();
        const filtrados = manhwas.filter(m => {
            const t = m.titulo || m.nome;
            if(!t) return false;
            return t.toLowerCase().includes(value) || limparTitulo(t).toLowerCase().includes(value);
        });
        render(filtrados);
    });

    render(manhwas);
}
loadManhwas();
