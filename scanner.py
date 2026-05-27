import requests
from bs4 import BeautifulSoup
import json
import re

headers = {
    "User-Agent": "Mozilla/5.0"
}

with open("links.txt", "r", encoding="utf-8") as f:
    links = [l.strip() for l in f if l.strip()]

resultado = []

for link in links:

    try:

        print("Escaneando:", link)

        response = requests.get(link, headers=headers, timeout=15)

        soup = BeautifulSoup(response.text, "html.parser")

        titulo = soup.title.text.strip()

        titulo = titulo.replace(" | Blackout Comics", "")
        titulo = titulo.replace(" - BlackOut Comics", "")
        titulo = titulo.strip()

        imagem = ""

        og = soup.find("meta", property="og:image")

        if og:
            imagem = og.get("content", "")

        textos = soup.get_text()

        caps = re.findall(r'Chapter\s*(\d+)', textos, re.IGNORECASE)

        capitulo = max(caps) if caps else "?"

        resultado.append({
            "nome": titulo,
            "link": link,
            "capitulo": capitulo,
            "imagem": imagem,
            "status": "ongoing"
        })

    except Exception as e:
        print("ERRO:", link)
        print(e)

with open("manhwas.json", "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=4)

print("\nFINALIZADO")
print("Total:", len(resultado))
