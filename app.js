async function loadManhwas(){

    const response = await fetch("manhwas.json");
    const manhwas = await response.json();

    const grid = document.getElementById("grid");
    const search = document.getElementById("search");

    function getData(nome){

        return JSON.parse(localStorage.getItem(nome)) || {
            readed:false,
            chapter:"",
            completed:false
        };

    }

    function saveData(nome,data){

        localStorage.setItem(nome,JSON.stringify(data));
        updateStats();

    }

    function updateStats(){

        let readed = 0;
        let completed = 0;

        manhwas.forEach(m => {

            const data = getData(m.nome);

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

            const data = getData(manhwa.nome);

            const card = document.createElement("div");

            card.className = "card";

            if(data.completed){
                card.classList.add("completed");
            }

            card.innerHTML = `
                <img class="cover" src="${manhwa.imagem || 'https://via.placeholder.com/400x220'}">

                <div class="title">
                    <a href="${manhwa.link}" target="_blank">
                        ${manhwa.nome}
                    </a>
                </div>

                <div class="info">
                    Último capítulo: ${manhwa.capitulo}
                </div>

                <div class="controls">

                    <label>
                        <input type="checkbox" class="readed">
                        Já li
                    </label>

                    <input type="number"
                           class="chapter"
                           placeholder="Capítulo atual">

                    <label>
                        <input type="checkbox" class="completedCheck">
                        Finalizado
                    </label>

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
                saveData(manhwa.nome,data);

            });

            chapter.addEventListener("input", () => {

                data.chapter = chapter.value;
                saveData(manhwa.nome,data);

            });

            completed.addEventListener("change", () => {

                data.completed = completed.checked;

                if(data.completed){
                    card.classList.add("completed");
                }else{
                    card.classList.remove("completed");
                }

                saveData(manhwa.nome,data);

            });

            grid.appendChild(card);

        });

        updateStats();

    }

    search.addEventListener("input", () => {

        const value = search.value.toLowerCase();

        const filtrados = manhwas.filter(m =>
            m.nome.toLowerCase().includes(value)
        );

        render(filtrados);

    });

    render(manhwas);

}

loadManhwas();
