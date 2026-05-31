#  QuizMaster — Online Kviz Platforma

> Studentski projekat — DWS & OSiRuO | Akademska godina 2024/2025

---

##  Opis projekta

**QuizMaster** je full-stack web aplikacija za online testiranje znanja. Korisnici mogu igrati kvizove iz različitih kategorija, pratiti rezultate na rang listi i takmičiti se s drugima. Administratori imaju pristup admin panelu s punim CRUD upravljanjem.

---

##  Tim i doprinos

### Član 1 — Merjem Obralić

**DWS:** Glavni fajl sa svim putanjama koji spaja sve stranice (App js), početna stranica (HomePage), stranica za prijavu (LoginPage), stranica za registraciju (RegisterPage)

**OSiRuO:** Db JSON, postavke za JSON server (package), Docker konfiguracija za backend (dockerfile), Docker Compose - jednim klikom povezuje i pokreće čitav projekat.

### Član 2 — Adna Salatović

**DWS:** Sve biblioteke i zavisnosti za React (frontend package), glavni HTML prozor aplikacije (index HTML), glavna ulazna tačka za React (index js), globalni CSS sa dizajnom i varijablama (index css), globalno upravljanje prijavom i odjavom korisnika (Auth), validacija za email, lozinke i forme (validators), lista svih dostupnih kvizova (quizzesPage), igranje kviza sa tajmerom (quizPlayPage), rang lista sa najboljim rezultatima (LeaderboardPage), admin panel za upravljanje kvizovima i korisnicima (AdminPage)

**OSiRuO:** 

### Član 3 — Adna Hrustanović

**DWS:** Funkcionalnosti: povlačenje podataka is db json baze (useFetch), lakše upravljanje formama (useForm), tajmer za odbrojavanje vremena tokom kviza (useTimer). Glavni meni na vrhu stranice (navbar), podnožje stranice (footer), zaštita koja brani običnim korsinicima da uđu na Admin stranicu (PrivateRoute), "O nama" stranica, kontakt forma sa Google mapom, 404 stranica za nepostojeće linkove

**OSiRuO:** GitIgnore

---

## 🛠️ Tech Stack

| Tehnologija | Verzija | Svrha |


| React | 18.2.0 | Frontend framework |
| React Router | 6.22.0 | Rutiranje + zaštićene  rute |

| Context API | React 18 | Globalno auth stanje |

| react-hot-toast | 2.4.1 | Toast notifikacije |
| json-server | 0.17.4 | REST API backend |
| Node.js | 18.x | Runtime |
| Docker | 24.x | Kontejnerizacija |
| nginx | alpine | SPA serving |
| GitHub Actions | — | CI/CD |
| GCP Cloud Run | — | Produkcijski hosting |

---

## 🏗️ Arhitekturni dijagram

```
┌─────────────────────────────────────────┐
│           React SPA (Port 3000/80)      │
│                                         │
│  AuthContext  │  React Router v6        │
│  useFetch     │  PrivateRoute           │
│  useForm      │  useTimer               │
│                                         │
│  Pages:                                 │
│  / | /quizzes | /quizzes/:id            │
│  /leaderboard | /about | /contact       │
│  /login | /register | /admin/*          │
│  * (404)                                │
└──────────────┬──────────────────────────┘
               │ HTTP REST
┌──────────────▼──────────────────────────┐
│       json-server (Port 3001)           │
│                                         │
│  /users   /quizzes   /results           │
│  /contacts                              │
│                                         │
│  db.json (perzistentni podaci)          │
└─────────────────────────────────────────┘

CI/CD: push → main → GitHub Actions
  → build Docker images
  → push to GCR
  → deploy GCP Cloud Run
  → health-check
```

---

## 🎨 Dizajn sistem

### Paleta boja

| Varijabla | Hex | Svrha |
|---|---|---|
| `--color-bg` | `#0a0a14` | Pozadina |
| `--color-surface` | `#12121f` | Kartice |
| `--color-primary` | `#6c63ff` | Primarne akcije |
| `--color-accent` | `#00d9a6` | Sekundarne akcije |
| `--color-danger` | `#ff4d6d` | Greške, brisanje |
| `--color-warning` | `#ffd166` | Upozorenja |
| `--color-text` | `#f0f0f8` | Tekst |

### Fontovi

| Font | Težine | Upotreba |
|---|---|---|
| **Syne** | 400/600/700/800 | Naslovi, logo |
| **DM Sans** | 300/400/500 | Body tekst, UI |

---

## 👤 Korisničke uloge

| Uloga | Pristup |
|---|---|
| **Admin** | Sve + Admin panel (CRUD kvizovi/korisnici/rezultati/poruke) |
| **Guest** | Javne stranice + igranje kvizova (rezultati se čuvaju) |
| **Neregistrovan** | Pregled kvizova (rezultati se NE čuvaju) |

### Demo nalozi

| Email | Lozinka | Uloga |
|---|---|---|
| `admin@quiz.com` | `admin123` | Admin |
| `user@quiz.com` | `user123` | Guest |

---

## 🚀 Lokalno pokretanje

### Preduslovi
- Node.js 18+
- npm 9+
- Docker 24+ *(za Docker opciju)*

### Opcija A — Docker (preporučeno)

```bash
git clone https://github.com/VAS-USERNAME/quizmaster.git
cd quizmaster
docker-compose up --build
```

- Frontend → http://localhost:3000  
- Backend → http://localhost:3001

### Opcija B — Manuelno

```bash
# Terminal 1 — backend
cd backend
npm install
npm start

# Terminal 2 — frontend
cd frontend
npm install
npm start
```

### Environment varijable

`frontend/.env`:
```
REACT_APP_API_URL=http://localhost:3001
```

---

## 📁 Struktura repozitorija

```
quizmaster/
├── frontend/
│   ├── src/
│   │   ├── components/auth/PrivateRoute.js
│   │   ├── components/layout/Navbar.js
│   │   ├── components/layout/Footer.js
│   │   ├── context/AuthContext.js
│   │   ├── hooks/useFetch.js
│   │   ├── hooks/useForm.js
│   │   ├── hooks/useTimer.js
│   │   ├── pages/ (10 stranica)
│   │   ├── utils/validators.js
│   │   ├── App.js
│   │   └── index.css
│   ├── public/index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── db.json
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/workflows/deploy.yml
├── scripts/health-check.sh
└── README.md
```

---

## 🔒 Zaštićene rute

| Ruta | Zaštita |
|---|---|
| `/admin/*` | Samo Admin (PrivateRoute adminOnly) |
| `/login`, `/register` | Samo neulogovani (GuestRoute) |
| Sve ostale | Javne |

---

## 📸 Snimci ekrana

> Dodajte u `/docs/screenshots/`:

| Prikaz | Fajl |
|---|---|
| Landing page | `landing.png` |
| Prijava | `login.png` |
| Admin panel | `admin.png` |
| Mobilni prikaz | `mobile.png` |
| GCP Cloud Run konzola | `gcp.png` |

---

## 🌐 Produkcijski URL

> **Frontend:** https://quizmaster-frontend-XXXX-ew.a.run.app  
> **Backend:** https://quizmaster-backend-XXXX-ew.a.run.app

*(Zamijenite stvarnim URL-ovima nakon deploymenta)*

---

## ⚙️ GCP Secrets (za CI/CD)

| Secret | Opis |
|---|---|
| `GCP_PROJECT_ID` | Vaš GCP project ID |
| `GCP_SA_KEY` | JSON ključ service accounta (Cloud Run Admin + Storage Admin) |