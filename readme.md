# Sarasnioch

## Architektura projektu

```
┌─────────────┐     GET /cms/*             ┌─────────────┐
│   Angular   │ ◄──────────────────────────│   Strapi    │
│  (Frontend) │     dane do wyświetlania   │    (CMS)    │
└──────┬──────┘                            └──────┬──────┘
       │                                          │
       │ POST /api/*                              │
       │ (reCAPTCHA, formularze)                  │
       ▼                                          ▼
┌─────────────┐                           ┌─────────────┐
│   NestJS    │ ────────────────────────► │ PostgreSQL  │
│  (Backend)  │                           │    (DB)     │
└─────────────┘                           └─────────────┘
```

## Struktura folderów

```
sarasnioch/
├── frontend/          # Angular 21 SSR
│   └── src/
│
├── strapi/            # Strapi 5 CMS
│   └── config/
│
├── backend/           # NestJS (TypeScript)
│   └── src/
│
└── readme.md
```

## Serwisy i ich role

### 1. Frontend (Angular 21 SSR)
- Interfejs użytkownika, Server-Side Rendering
- Komunikacja:
  - Bezpośrednio do Strapi - pobieranie treści do wyświetlania
  - Do NestJS - custom akcje (formularze, reCAPTCHA)

### 2. Strapi 5 CMS
- Zarządzanie treścią
- REST API dla frontu
- Panel administracyjny
- Baza: PostgreSQL

### 3. NestJS Backend
- Custom akcje server-side:
  - Weryfikacja reCAPTCHA
  - Wysyłka maili (formularze kontaktowe)
  - Integracje z zewnętrznymi API
  - Logika biznesowa której nie można zrobić w Strapi
- Baza: PostgreSQL

## Flow danych

**Angular → Strapi (bezpośrednio):**
- Pobieranie artykułów, treści, mediów
- Wszystkie dane do renderowania

**Angular → NestJS:**
- Weryfikacja reCAPTCHA
- Wysyłka maili
- Customowe akcje server-side

**Ważne:** Frontend NIE przepuszcza wszystkiego przez NestJS. Dane do wyświetlania pobiera bezpośrednio ze Strapi.

## Uruchomienie (development)

```bash
# Terminal 1 - Strapi
cd strapi && npm run develop

# Terminal 2 - Backend
cd backend && npm run start:dev

# Terminal 3 - Frontend
cd frontend && npm run start
```

## Porty (development)

| Serwis | Port |
|--------|------|
| Frontend | 4200 |
| Strapi | 1337 |
| Backend | 3000 |
| PostgreSQL | 5432 |
