# Druhý projekt do předmětu WAP

## Hlavička

- **Autor:** Tomáš Zaviačič  
- **Login:** xzavia00  
- **Akademický rok:** 2024/2025  
- **Název zadání:** Vytvoření webového API 

## Popis projektu 

Cílem projektu bylo vytvořit webové API umožňující nabízet otevřená data pomocí webových rozhraní.

### Zdroj dat

Zdrojem dat je jiná API webové stránky pro deskové hry [BoardGameGeek](https://boardgamegeek.com/), která nabízí volná data o deskových hrách, uživateli zaznamenaných průchodech hrami, kolekce uživatelů, vyhledávání a další položky. Popis zdrojové API lze najít [zde](https://boardgamegeek.com/wiki/page/BGG_XML_API2). Vytvořená API zpracovává vstupní data ve formátu **XML** a na výstup vkládá data ve formátu **JSON**.

### Výsledná API

Vytvořená API funguje po spuštění lokálně na portu $3000$, pokud není v proměnných prostředí specifikovaný proměnnou `PORT` jiný. Všechny požadavky musí mít v hlavičce záhlaví `x-api-key` s platným klíčem pro autentizaci. Autentizační klíč má výchozí hodnotu `debug-api-key` a dá se přenastavit v proměnných prostředí proměnnou `API_KEY`. Dále je využit i jednoduchý systém omezování rychlosti toku požadavků od jednoho uživatele podle IP adresy, ze které jsou požadavky poslány. Získaná data ze zdrojové API jsou uložena v mezi paměti podle klíče na hodinu. Pro zobrazení dat pomocí jednoduché aplikace  bylo nutné povolit tzv. **Cross-Origin Rousource Sharing** pomocí **CORS** knihovny.

Výsledná API má celkově čtyři cesty (z angl. routes). První dvě `boardgames` a `plays` mají více konečných bodů (z angl. endpoints), které pracují s konkrétní částí zpracovaných dat a provádí nad němi různé výpočty nebo z nich vytahují jiná data. Kromě toho také obsahují určité přepínače pro filtrování dat. Poslední dvě cesty `collection` a `search` obsahují pouze filtrování dat, nebo omezené seřazení. Více o každé cestě je popsáno níže.

## Popis cest (routes)

Každá z cest nejdříve načítá vstupní data ze zdrojové API a následně podle endpointu/filtrů vrací výsledek. V případě překročení limitu požadavků na zdrojové API každá cesta detekuje tuto událost a provede odpovídající zotavení.

Podrobný popis cest, konečných bodů a schémat lze najít v automaticky generované dokumentaci pomocí **openAPI Swagger**. Za předpokladu, že port je nastavený na $3000$ lze tuto dokumentaci najít [zde](http://localhost:3000/api-docs). Pro úspěšné vyzkoušení výsledné API v generované dokumentaci je potřeba se autorizovat platným API klíčem!

### Boardgames cesta

Vstupní informací je identifikační číslo deskové hry. Tímto identifikačním číslem jsou ve zdrojové databázi označeny nejen deskovky, ale také expanze, tzv. *rpgitem*, nebo videohry. Podle zadání projektu podporuje vytvořená API pouze načítání deskových her. Pokud požadavek obsahuje identifikační číslo, které neodpovídá deskové hře, je vrácen chybový kód $400$ s odpovídající chybovou hláškou. 

Kromě zpracovaných dat lze také vypisovat u konkrétní hry jak si u hráčích vedla při hraní sólo (pouze jeden hráč) pomocí konečného bodu `soloRef`. Výsledkem jsou tři čísla reprezentující procentuálně jestli hraní sólo je nejlepší, pouze doporučovaná nebo nedoporučovaná. Dalším konečným bodem je `publishers`, který vypíše všechny vydavatele dané hry. Posledním konečným bodem je `marketplace` vytahující všechny přidané nabídky dané hry. S přepínači `fromdate` a `todate` lze specifikovat přesné časové okno, ve kterém se vypsané nabídky musí pohybovat. Časový formát je `YYYY-MM-DD` a při nespecifikování se nestanovuje horní/dolní omezení. Přepínač `sort` seřadí nabídky podle ceny buď vzestupně (hodnota *ascending*), nebo sestupně (hodnota *descending*).

### Plays cesta

Jedná se průběhy dané hry, které si uživatelé můžou zaznamenávat. Výsledky zaznamenaných her trpí datovou neúplností, kdy například nemusí být uveden čas hraní ani seznam hráčů, a pokud chybí hráči, nejsou uvedeni ani výherci. Konečné body cesty potom pracují pouze se záznamy her, které obsahují potřebné informace.

Při načítání záznamů her ze zdrojové API bylo potřeba implementovat postupné dotazování. Odpověď zdrojové API je omezena na 100 záznamů her a obsahuje stránkovací přepínač. Pokud počet načítaných záznamů přesáhne 100, výsledná API nejprve zpracuje a uloží prvních 100 záznamů a poté pokračuje na další stránku, dokud nezíská všechny výsledky. Tento způsob načítání přivádí problém delšího získávání zaznamenaných her v případě, kdy dotaz na výslednou API požaduje velké časové okno s 1000+ záznamy, potom každých 100 záznamů potřebuje samostatný dotaz na zdrojovou API. U populárnějších deskových her potom dochází k překonání limitu požadavků na zdrojovu API při časovém okně větším jak 3 měsíce.

Všechny koncové body této cesty fungují s přepínači `fromdate` a `todate` s formátem datumu `YYYY-MM-DD`. V případě absence `fromdate` přepínače se nastaví včerejší den a u `todate` se nastaví aktuální datum. Prvním konečným bodem je `summary` zobrazující časové informace a počet unikátních hráčů v zaznamenaných hrách v rámci daného časového okna. Dalším je `winrate` poskytující kolik hráčů vyhrálo v daném časovém okně ve hře, ve které může vyhrát více hráčů. Poslední konečný bod `daily` vypisuje kolik her se hrálo v daném časovém okně a také seznam všech datumů v časovém okně a ke každému hodnotu kolik her bylo zaznamenaných.

### Collection cesta

Při načítání kolekcí se bylo nutno vypořádat s opožděním, které zdrojová API má při poskytování dat o kolekcích. Zdrojová API na požadavek na kolekce odpovídá stavovým kódem $200$ se zprávou *Požadavek byl zpracován a bude vykonán, opakujte dotaz za moment*. Vytvořená API tedy kromě zotavení po překročení limitu dotazů na zdrojvou API také odchytává zmíněnou odpověď a opakuje dotaz po půl sekundě tolikrát, kolik je nastaveno v proměnných prostředí v proměnné `COLLECTION_TRY_LIMIT` (výchozí hodnota je 10). Při manuálním testování bylo nutné opakovat dotazy v intervalech od půl sekundy do jedné sekundy, avšak u některých uživatelů s rozsáhlou kolekcí zdrojová API neposkytla data ani po dvou a půl sekundách. Lze tedy říct, že potenciálně můžou existovat uživatelé, u kterých by tento dotaz mohl trvat řádově až v desítkách sekund.

Kolekce uživatele jsou vyhledávány pomocí uživatelského jména. Obsahuje deskové hry i expanze, které uživatel vlastní, vlastnil, chce vyměnit, shání, chce hrát, chce koupit, přeje si nebo má předobjednané. Položky ve vstupních datech obsahují každý vyjmenovaný stav s hodnotou $0$ nebo $1$ (např. `own=1`). Vytvořená API si tyto informace uchovává jako stavový kód o osmi stavech nabývajících hodnot $0$ nebo $1$. Tento mechanismus využívá přepínač display, který přijímá uvedené stavy v angličtině, například `own=1,wanttoplay=0` zobrazující pouze položky, které uživatel vlastní, ale nechce hrát.

### Search cesta

Tato cesta vyhledává položky v databázi zdrojové API podle obsahu vyhledávacího pole. Vyhledávané položky mohou být deskové hry, expanze k deskových hrám, tzv. *rpgitem* a videohry. Zde se vyskytuje nekonzistence s typy, protože některé z položek mají typ `boardgame` ačkoliv se nejedná o deskovou hru, ale třeba o promo karty, nebo o jiný dodatečný obsah do dané deskovky. Proto třeba při zobrazení vydavatelů dané položky může vzniknout problém pro tento projekt, protože v rámci zadání lze načítat pouze deskové hry. Tento problém by šel eventuálně vyřešit tím, že by se provedl na každou položku dotaz na detailnější popis, ve kterém se již správný popis nachází.

Obsahuje přepínače pro vyhledávání pouze v daném časovém oknu s formátem `YYYY-MM-DD` a pokud nejsou specifikovány, tak se zobrazí data bez horní/dolní časové hranice. Dále obsahuje cesta přepínač `exact` nabývající výchozí hodnoty $0$ nebo hodnoty $1$. V případě přepínače nastaveného na $1$ se vypíšou pouze výsledky přesně odpovídajícímu vyhledávanému řetězci. Poslední přepínač `type` zanechá pouze položky s daným typem. Na výběr je `boardgame`,`boardgameexpansion`,`rpg`,`rpgitem` a `videogame`.

## Prerekvizity
- Docker

## Závisloti

Všechny závislosti jsou uvedeny v `package.json` a při manuálním spuštění API jsou nainstalovány pomocí **npm** pro správu balíčků. Závislosti jako **express-rate-limit** a **zod** se používají zejména v tzv. *middleware* funkcích, které pomáhají při zpracování dotazů.

- **axios**: HTTP klient pro dotazování zdrojového API.
- **cors**: Middleware zajišťující tzv. *Cross-Origin* sdílení zdrojů (potřeba pro aplikaci zobrazující data).
- **dotenv**: Pro načítání proměnných prostředí jako `API_KEY` a `COLLECTION_TRY_LIMIT`.
- **express**: Webový framework pro sestavení API.
- **express-rate-limit**: *Middleware* pro kontrolování toku požadavků od jednotlivých uživatelů.
- **fast-xml-parser**: Zpracování příchozích **XML** odpovědí od zdrojové API. 
- **node-cache**: Ukládání lokálně nefiltrovaných odpovědí podle klíče na omezenou časovou dobu.
- **swagger-jsdoc**: Generuje OpenAPI dokumentaci z JSDoc komentářů.
- **swagger-ui-express**: Pomáhá Swagger UI s generovanou API dokumentací.
- **zod**: Validuje vstupní argumenty podle navolených schémat.

## Instalace

Přiložený `Dockerfile` obsahuje již všechna nastavení potřebné k vytvoření obrazu pomocí prvního příkazu. Jakmile se obraz stáhne a úspěšně nastaví, druhým příkazem se spustí kontejner s vytvořenou API. Pro nastavení hodnoty portu (`PORT`), api klíče (`API_KEY`) nebo počtu zkoušení při čekání na kolekce (`COLLECTION_TRY_LIMIT`) stačí změnit náležité proměnné v proměnných prostředí před vytvoření obrazu.

```
docker build -t boardgame-api .

docker run -p 3000:3000 boardgame-api
```
## Chybové výstupy

- **400**: Používá se při neplatných parametrech nebo požadavcích, například při validaci vstupů.
- **401**: Používá se při poskytnutí neplatného API klíče.
- **404**: Používá se, pokud bylo poskytnuto neplatné identifikační číslo deskové hry.
- **429**: Používá se při limitaci toku požadavků, pokud je překročen limit u dané IP adresy.
- **504**: Používá se u kolekcí, pokud zdrojová API neodpoví v očekávaném časovém rámci.
- **500**: Používá se jako výchozí chybový kód, pokud není specifikován jiný kód.

## Proměnné prostředí

Pro změnu portu, počtu vyzkoušení získání kolekce nebo změnu autentizačního klíče je potřeba v souboru proměnných prostředí `.env` náležité proměnné. Příklady zde zobrazené jsou výchozí hodnoty nastavené při jejich absenci.

- **API_KEY**=debug-api-key
- **COLLECTION_TRY_LIMIT**=10
- **PORT**=3000

## Dojmy z vypracovaného řešení

..Po prozkoumání možností ohledně problému z cesty `Search`, kdy položky obsahují chybně typ `boardgame` ačkoliv se jedná o expanze, se objevilo východisko v podobě dotazování na více deskovek jedním dotazem. Takové dotazování zdrojová API podporuje a tímto způsobem by se dalo u každé vyhledávané položky ověřit zda-li se opravdu jedná o deskovou hru, nebo o expanzi. Každopádně stále by zde byla otázka rychlosti odpovědi, kdy více jak 10 deskovek už může trvat déle a limit počtu načtení deskovek je 20. Z toho důvodu a také kvůli časovému se autor rozhodl tuto funkcionalitu nezakomponovat do řešení.

<!-- ## Struktura projektu

```

``` -->