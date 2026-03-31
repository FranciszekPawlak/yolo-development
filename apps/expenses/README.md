# Expense Analyzer

Prosta aplikacja do analizy wydatków osobistych. Wrzucasz pliki z transakcjami z banków, a apka łączy je, deduplikuje, kategoryzuje i wyświetla na interaktywnym dashboardzie.

## Obsługiwane banki

| Bank    | Format | Wykrywanie                             |
| ------- | ------ | -------------------------------------- |
| ING     | CSV    | Nagłówek "ING Bank" w pliku            |
| Revolut | XLSX   | Nazwa pliku `consolidated-statement*`  |

## Wymagania

- **Node.js** 20+
- **pnpm** (monorepo)
- **Konto Google Cloud** z włączonym Google Drive API

## Konfiguracja Google Cloud

1. Wejdź na [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz nowy projekt (lub użyj istniejącego)
3. Włącz **Google Drive API** (`APIs & Services → Library → Google Drive API → Enable`)
4. Utwórz **OAuth 2.0 Client ID** (`APIs & Services → Credentials → Create Credentials → OAuth client ID`):
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - (produkcja: dodaj też URL produkcyjny)
5. Zapisz **Client ID** i **Client Secret**
6. Skonfiguruj **OAuth consent screen**:
   - Dodaj scope: `openid`, `email`, `profile`, `https://www.googleapis.com/auth/drive.file`
   - Dodaj swój email jako test user (dopóki app jest w trybie "Testing")

## Zmienne środowiskowe

Utwórz plik `apps/expenses/.env.local`:

```env
# Auth.js secret - wygeneruj: npx auth secret
AUTH_SECRET=wygenerowany-secret

# Google OAuth credentials z Cloud Console
AUTH_GOOGLE_ID=twoj-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=twoj-client-secret

# Nazwa folderu na Google Drive (opcjonalne, domyślnie: ExpenseAnalyzer)
DRIVE_FOLDER_NAME=ExpenseAnalyzer
```

### Opis zmiennych

| Zmienna             | Wymagana | Opis                                                                                       |
| ------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `AUTH_SECRET`       | Tak      | Losowy secret dla Auth.js. Generuj: `npx auth secret`                                      |
| `AUTH_GOOGLE_ID`    | Tak      | OAuth 2.0 Client ID z Google Cloud Console                                                 |
| `AUTH_GOOGLE_SECRET`| Tak      | OAuth 2.0 Client Secret z Google Cloud Console                                             |
| `DRIVE_FOLDER_NAME` | Nie      | Nazwa folderu na Google Drive do przechowywania plików. Domyślnie: `ExpenseAnalyzer`       |

## Struktura plików na Google Drive

Aplikacja automatycznie tworzy strukturę folderów:

```
{DRIVE_FOLDER_NAME}/
├── raw/                          # Surowe pliki z banków (backup)
│   ├── Lista_transakcji_nr_...csv
│   └── consolidated-statement_...xlsx
└── master.json                   # Skombinowany plik ze wszystkimi transakcjami
```

## Uruchomienie

```bash
# Z roota monorepo
cd apps/expenses

# Zainstaluj zależności (jeśli nie było)
pnpm install

# Uruchom dev server
pnpm dev
```

Aplikacja startuje na `http://localhost:3000`.

## Jak to działa

1. **Logowanie** — Auth.js z Google OAuth. Dostęp ograniczony do jednego konta email.
2. **Upload** — Przeciągnij pliki CSV/XLSX z banków. Automatyczne wykrywanie banku.
3. **Generuj** — Apka parsuje pliki, deduplikuje transakcje po unikalnym ID, kategoryzuje je regułami, łączy z istniejącym `master.json` i zapisuje na Google Drive.
4. **Dashboard** — Interaktywne wykresy i tabele: podsumowanie, wydatki wg kategorii, trendy miesięczne, top kontrahenci, koszty stałe.

## Stack

- **Next.js 16** (App Router, Server Actions)
- **Auth.js v5** (Google OAuth + Drive API token)
- **HeroUI v3** (design system)
- **Recharts** (wykresy)
- **Tailwind CSS v4**
- **Google Drive API v3** (storage zamiast bazy danych)
- **PapaParse** (parsowanie CSV)
- **SheetJS / xlsx** (parsowanie XLSX)

## Dodawanie nowego banku

1. Utwórz plik `src/lib/parsers/nowybank.ts` implementujący interfejs `BankParser`
2. Dodaj parser do tablicy `parsers` w `src/lib/parsers/index.ts`
3. Interfejs `BankParser` wymaga:
   - `name` — identyfikator banku
   - `detect(fileName, firstLines)` — czy plik pochodzi z tego banku
   - `parse(content: Buffer)` — zwraca tablicę `Transaction[]`
