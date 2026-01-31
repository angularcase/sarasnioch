# Struktury danych - Strapi Content Types

## 1. Kategoria Zwierząt (`animal-category`)

Prosta kolekcja kategorii zwierząt.

| Pole | Typ | Opis |
|------|-----|------|
| `name` | Text (wymagane, unikalne) | Nazwa kategorii np. "Konie", "Psy", "Krowy", "Świnie" |
| `slug` | UID (z `name`) | Automatyczny slug np. "konie", "psy" |

---

## 2. Artykuł (`article`)

Artykuły/wpisy blogowe przypisane do kategorii zwierząt.

| Pole | Typ | Opis |
|------|-----|------|
| `title` | Text (wymagane) | Tytuł artykułu |
| `slug` | UID (z `title`) | Automatyczny slug z tytułu |
| `content` | Rich Text (wymagane) | Treść artykułu (formatowanie, nagłówki, listy) |
| `publishedAt` | DateTime | Data publikacji |
| `author` | Text | Imię i nazwisko autora |
| `gallery` | Media (wiele plików) | Galeria zdjęć do artykułu |
| `animalCategories` | Relacja (wiele do wielu) | Powiązane kategorie zwierząt |
| `products` | Relacja (wiele do wielu) | Powiązane produkty |

---

## 3. Producent (`manufacturer`)

Producenci produktów.

| Pole | Typ | Opis |
|------|-----|------|
| `name` | Text (wymagane, unikalne) | Nazwa producenta np. "Biowet Puławy", "Vetoquinol" |
| `slug` | UID (z `name`) | Automatyczny slug np. "biowet-pulawy" |
| `logo` | Media (pojedynczy plik) | Logo producenta (opcjonalne) |
| `website` | Text | Strona www producenta (opcjonalne) |

---

## 4. Produkt (`product`)

Produkty dla zwierząt.

| Pole | Typ | Opis |
|------|-----|------|
| `name` | Text (wymagane) | Nazwa produktu |
| `slug` | UID (z `name`) | Automatyczny slug z nazwy |
| `description` | Rich Text | Opis produktu, wskazania, dawkowanie |
| `manufacturer` | Relacja (wiele do jednego) | Producent produktu |
| `gallery` | Media (wiele plików) | Galeria zdjęć produktu |
| `animalCategories` | Relacja (wiele do wielu) | Dla jakich zwierząt jest przeznaczony |

---

## Relacje

```
┌─────────────────┐
│ AnimalCategory  │
└────────┬────────┘
         │
         │ wiele do wielu
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐◄───►┌─────────┐     ┌──────────────┐
│Article│     │ Product │────►│ Manufacturer │
└───────┘     └─────────┘     └──────────────┘
  wiele        wiele            wiele   jeden
  do wielu
```

- Artykuł może mieć wiele kategorii zwierząt (np. artykuł o szczepieniach dotyczy psów i kotów)
- Artykuł może mieć wiele powiązanych produktów (np. artykuł o odrobaczaniu linkuje do produktów na robaki)
- Produkt może być przeznaczony dla wielu kategorii zwierząt (np. produkt dla psów, kotów i koni)
- Produkt może być powiązany z wieloma artykułami
- Kategoria zwierząt może być przypisana do wielu artykułów i wielu produktów
- Produkt ma jednego producenta, producent może mieć wiele produktów

---

## Przykładowe dane

### Kategorie zwierząt:
- Konie
- Psy
- Koty
- Krowy
- Świnie
- Drób
- Owce/Kozy

### Przykładowy artykuł:
- Tytuł: "Szczepienia profilaktyczne u psów"
- Slug: "szczepienia-profilaktyczne-u-psow"
- Autor: "lek. wet. Jan Kowalski"
- Kategorie zwierząt: Psy
- Powiązane produkty: Nobivac DHPPi, Eurican DHPPI2
- Treść: ...
- Galeria: 3 zdjęcia

### Przykładowi producenci:
- Biowet Puławy
- Vetoquinol
- Ceva
- Zoetis
- Krka

### Przykładowy produkt:
- Nazwa: "Vetamoxil 500mg"
- Slug: "vetamoxil-500mg"
- Producent: Biowet Puławy (relacja)
- Kategorie: Psy, Koty, Konie
- Opis: "Produkt weterynaryjny..."
- Galeria: 2 zdjęcia opakowania
