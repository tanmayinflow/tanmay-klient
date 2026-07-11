# tanmay — soukromy workspace

Single-file React aplikace (Notion mirror). Nasazuje se pres Cloudflare Pages,
zamcena za prihlaseni jen pro tebe (Cloudflare Access).

## Co je co
- src/App.tsx    — cela aplikace (jeden soubor)
- src/main.tsx   — vstupni bod
- index.html     — fonty + nastaveni
- build prikaz: npm run build   ·   vystup: slozka dist

## Faze nasazeni (klikaci, provedu te jimi)
1. Ucet na GitHubu -> nahrat tuto slozku do PRIVATNIHO repozitare
2. Ucet na Cloudflare
3. Cloudflare Pages -> propojit s repozitarem
     Framework preset:  Vite
     Build command:     npm run build
     Output directory:  dist
4. (volitelne, kdykoli pozdeji) koupit domenu na Cloudflare Registrar a pripojit ji
5. Cloudflare Access -> zamknout na tvuj e-mail (login jen pro tebe)

## Upravy pozdeji
Zmeny reknes Claudovi -> upravi src/App.tsx -> nahrajes novy soubor do repozitare
-> Cloudflare Pages nasadi sam.

## Pozdeji: verze pro klienty
Osobni data (dopisy, denikove zapisky) jsou zatim natvrdo v src/App.tsx.
Pro klientskou verzi se oddeli ven, aby v kodu nebyla.
