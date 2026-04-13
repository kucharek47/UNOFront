# UNOFront

Interaktywna aplikacja kliencka do gry w UNO, stworzona z wykorzystaniem frameworka Angular. Projekt umożliwia rozgrywkę wieloosobową dzięki integracji z `socket.io-client`.

🌐 **Wersja na żywo:** [uno.kucharek47.pl](https://uno.kucharek47.pl/)

## 🛠 Technologie

Projekt został zbudowany przy użyciu następujących technologii i narzędzi:

* **Angular** (v21.2.0) - główny framework frontendowy.
* **TypeScript** - główny język programowania, zapewniający typowanie statyczne.
* **Socket.io-client** (v4.8.3) - biblioteka do obsługi komunikacji w czasie rzeczywistym (WebSockets).
* **Vitest** - środowisko do testów jednostkowych.
* **RxJS** - programowanie reaktywne.

## 🚀 Uruchomienie lokalne

Aby uruchomić projekt na swoim lokalnym środowisku, postępuj zgodnie z poniższymi instrukcjami.

### Wymagania wstępne

Upewnij się, że masz zainstalowane środowisko Node.js oraz menedżer pakietów npm (projekt korzysta z npm@11.6.1).

### Instalacja i uruchomienie

1. Sklonuj repozytorium na swój dysk.
2. Przejdź do katalogu projektu:
   ```bash
   cd UNOFront
   ```
3. Zainstaluj wszystkie wymagane zależności:
   ```bash
   npm install
   ```
4. Uruchom serwer deweloperski:
   ```bash
   npm start
   ```
   *lub używając Angular CLI:*
   ```bash
   ng serve
   ```

Aplikacja będzie dostępna w przeglądarce pod adresem `http://localhost:4200/`. Aplikacja przeładuje się automatycznie po wprowadzeniu i zapisaniu zmian w plikach źródłowych.

## ⚙️ Budowanie aplikacji (Produkcja)

Aby zbudować zoptymalizowaną wersję aplikacji gotową do wdrożenia na serwer produkcyjny, uruchom polecenie:

```bash
npm run build
```
*lub*
```bash
ng build
```

Pliki wynikowe zostaną wygenerowane w katalogu `dist/`.

## 🧪 Testy

Projekt wykorzystuje Vitest jako narzędzie do uruchamiania testów jednostkowych. Aby uruchomić testy, użyj polecenia:

```bash
npm test
```
*lub*
```bash
ng test
```
