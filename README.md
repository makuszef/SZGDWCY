# Konfiguracja środowiska programistycznego: REACT (klient) - ASP.NET (serwer)

## Środowisko programistyczne

Jako środowisko programistyczne polecam **[Rider](https://www.jetbrains.com/rider/)**, które świetnie obsługuje zarówno projekty ASP.NET, jak i React.

Dodatkowo, potrzebujemy zainstalować **Node.js**, które można pobrać [tutaj](https://nodejs.org/en/download/package-manager). Warto jednak zaznaczyć, że **środowisko** powinno automatycznie doinstalować potrzebne składniki podczas uruchamiania projektu.

---

## Klonowanie projektu

Aby rozpocząć pracę, klonujemy projekt z repozytorium przy użyciu opcji **Get from version control**:

![Klonowanie projektu](https://github.com/user-attachments/assets/49c0e4e7-8744-4adb-8540-3b642b889b23)

---

## Konfiguracja uruchamiania projektu

Po sklonowaniu repozytorium, należy skonfigurować ustawienia w Rider, aby uruchamiać **dwa serwery**: jeden dla **React** (frontend) i drugi dla **ASP.NET** (backend).

### Krok 1: Konfiguracja uruchamiania obu serwerów
W poniższych ustawieniach pokazano, jak skonfigurować równoczesne uruchamianie serwera React oraz ASP.NET:

![Konfiguracja 1](https://github.com/user-attachments/assets/388b9940-9419-4fc8-a1fa-3ef205e6c89a)
![Konfiguracja 2](https://github.com/user-attachments/assets/2e75a7fd-607a-4261-90ed-277ac7206d94)

### Krok 2: Ustawienia dodatkowe
Należy również upewnić się, że poniższe ustawienia są poprawnie skonfigurowane:

![Ustawienia 1](https://github.com/user-attachments/assets/f674882f-5309-40c5-b3cc-cc57136d03f7)
![Ustawienia 2](https://github.com/user-attachments/assets/cba4c4e7-4f8a-43d4-8595-354dc5bee8de)

### Krok 3: Równoczesne uruchamianie serwerów
Zwróć uwagę na to, aby oba serwery były skonfigurowane do uruchamiania równocześnie:

![Konfiguracja końcowa](https://github.com/user-attachments/assets/a213c3ee-8303-4273-a7f6-9988a7dbee8d)
![Serwery](https://github.com/user-attachments/assets/7390f329-7615-4134-9cf3-49df17d3848c)

---

## Podsumowanie

- **Rider**: Polecane środowisko do pracy z projektami React i ASP.NET.
- **Node.js**: Niezbędne do uruchomienia aplikacji React.
- **Klonowanie**: Projekt klonujemy z repozytorium przez opcję *Get from version control*.
- **Konfiguracja**: Ustawienia w Rider pozwalają uruchamiać dwa serwery: frontend (React) i backend (ASP.NET).

# Struktura aplikacji: REACT (klient) - ASP.NET (serwer)

## 1. Klient - REACT (na zielono)
![React - Klient](https://github.com/user-attachments/assets/b3f8b08f-92f5-4eb6-be3f-c4172ca525f1)

Aplikacja **klient** (front-end) zbudowana w technologii **REACT**. Głównym folderem, nad którym pracujemy, jest folder **`src`** (oznaczony na czerwono).

![Główny folder src](https://github.com/user-attachments/assets/e3d98c1e-a4b3-49c0-8ff3-b0a6fb42739e)

---

## 2. Serwer - ASP.NET (na czerwono)
Aplikacja **serwerowa** (back-end) działa na technologii **ASP.NET**. Odpowiada za logikę aplikacji, obsługę żądań i odpowiedzi serwera.

---

## 3. Path, komponent i endpointy

Na rysunkach:
- **Zielony** – oznacza **path (ścieżkę)**, czyli endpoint URL, dla którego generowany jest komponent.
- **Niebieski** – oznacza komponent **JavaScript** generowany przez REACT.
- **Czerwony** – oznacza **endpoint** serwera, który obsługuje dane żądanie.

![Path i komponent](https://github.com/user-attachments/assets/dabe009e-bc3c-4e11-bd1e-eb113268f840)
![Komponent - path](https://github.com/user-attachments/assets/150666d8-9c2e-46b9-babb-cb21177010ea)
![Komponent js i endpoint](https://github.com/user-attachments/assets/e49359f3-7d3b-4978-9d64-392a66769c4e)
## 4. ASP.NET
- **Zielony** na zielono endpoint api ASP.NET
- **Czerwony** na czerowo wyświetlają się kontrolery
- **Niebieski** na niebiesko wyświetlają się metody GET/PUT/POST/DELETE
![image](https://github.com/user-attachments/assets/5aed1286-9d1c-4e50-992c-5c34cff36025)

Przykładowa struktura:
- **Path**: `/sprzet` (endpoint react).
- **Komponent**: `UserList.js`
- **Endpoint**: `/api/users` (serwer ASP.NET).
