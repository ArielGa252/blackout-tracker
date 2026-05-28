import requests
from bs4 import BeautifulSoup
import json
import re
import time

# Usamos un User-Agent de un navegador real y moderno
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Referer": "https://blackoutcomics.com/"
}

with open("links.txt", "r", encoding="utf-8") as f:
    links = [l.strip() for l in f if l.strip()]

resultado = []

for link in links:
    try:
        print(f"Escaneando: {link}")
        # Agregamos una pequeña pausa para no ser bloqueados por el servidor
        time.sleep(1) 
        response = requests.get(link, headers=headers, timeout=25)
        soup = BeautifulSoup(response.text, "html.parser")

        # Intentar obtener el título
        titulo_tag = soup.find("h1") or soup.find("title")
        titulo = titulo_tag.text.strip() if titulo_tag else "Desconocido"
        titulo = titulo.replace(" | Blackout Comics", "").strip()

        # Buscar capítulos en toda la página usando un regex más amplio
        # Buscamos patrones como: "Cap 50", "Capítulo 50", "Ch. 50", o números solos si están cerca de 'chapter'
        texto_completo = soup.get_text()
        # Buscamos números precedidos por palabras clave
        patron = re.compile(r'(?:cap[itulo]*|ch[apter]*)\.?\s*(\d+)', re.IGNORECASE)
        match_caps = patron.findall(texto_completo)
        
        # Convertir a enteros y encontrar el máximo
        numeros = [int(n) for n in match_caps if int(n) < 5000]
        
        capitulo = str(max(numeros)) if numeros else "?"

        resultado.append({
            "nome": titulo,
            "link": link,
            "capitulo": capitulo,
            "imagem": "", # La imagen se maneja mejor en el JSON
            "status": "ongoing"
        })
        print(f" -> Encontrado: {capitulo}")

    except Exception as e:
        print(f"ERROR en {link}: {e}")

with open("manhwas.json", "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=4)

print("\nScan finalizado.")
