import os
import json
import requests
import re
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer": "https://blackoutcomics.com/"
}

POSTERS_DIR = "capas"
if not os.path.exists(POSTERS_DIR):
    os.makedirs(POSTERS_DIR)

try:
    with open("links.txt", "r", encoding="utf-8") as f:
        links = []
        for line in f:
            line = line.strip()
            match = re.search(r'(https?://[^\s]+)', line)
            if match:
                links.append(match.group(1))
except FileNotFoundError:
    print("Arquivo links.txt não encontrado. Crie um com os links desejados.")
    links = []

resultado_final = []

for link in links:
    try:
        print("Escaneando:", link)
        response = requests.get(link, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")

        titulo = soup.title.text.strip() if soup.title else "Manhwa Sem Nome"
        titulo = re.sub(r'\s*[\-\|]\s*Black[oO]ut\s*Comics.*', '', titulo).strip()

        imagem = ""
        og_image = soup.find("meta", property="og:image")
        
        if og_image:
            imagem = og_image.get("content", "")

        textos = soup.get_text()
        caps = re.findall(r'(?:Chapter|Capítulo|Cap)\s*(\d+)', textos, re.IGNORECASE)
        capitulo = str(max([int(c) for c in caps])) if caps else "?"
        
        # Fazendo o download da imagem para evitar Hotlinking
        nome_arquivo_local = ""
        if imagem:
            ext = "jpg"
            if ".png" in imagem.lower(): ext = "png"
            elif ".webp" in imagem.lower(): ext = "webp"
            
            nome_arquivo_local = f"{re.sub(r'[^a-zA-Z0-9]', '_', titulo)}.{ext}"
            caminho_salvar = os.path.join(POSTERS_DIR, nome_arquivo_local)
            
            if not os.path.exists(caminho_salvar):
                try:
                    img_resp = requests.get(imagem, headers=headers, timeout=15)
                    if img_resp.status_code == 200:
                        with open(caminho_salvar, "wb") as img_file:
                            img_file.write(img_resp.content)
                except:
                    nome_arquivo_local = ""

        resultado_final.append({
            "titulo": titulo,
            "url": link,
            "capitulo": capitulo,
            "capa": f"capas/{nome_arquivo_local}" if nome_arquivo_local else imagem,
            "status": "ongoing"
        })

    except Exception as e:
        print(f"ERRO ao processar {link}: {e}")

if resultado_final:
    with open("manhwas.json", "w", encoding="utf-8") as f:
        json.dump(resultado_final, f, ensure_ascii=False, indent=4)
    print("\nFINALIZADO. JSON gerado e imagens baixadas na pasta 'capas'.")
