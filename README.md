# **bookoteka**
Kompleksowa aplikacja na komputer służąca do śledzenia przeczytanych książek

## Instalacja
### 🍎 macOS
Możesz zainstalować aplikację bezpośrednio przez menedżer pakietów **Homebrew**:
1. Zainstaluj Caska z dedykowanego repozytorium:
   ```bash
   brew install --cask bookoteka/tap/bookoteka
   ```
2. Ważne (Gatekeeper): Ponieważ aplikacja jest projektem Open Source i nie posiada płatnego certyfikatu Apple Developer ID, macOS domyślnie zablokuje jej pierwsze uruchomienie. Aby odblokować aplikację, wykonaj w terminalu jednorazowe polecenie:
   ```bash
   xattr -d com.apple.quarantine /Applications/Bookoteka.app
   ```

### 🪟 Windows
1. Pobierz instalator .msi lub .exe ze strony [repo](https://github.com/bookoteka/bookoteka/releases/latest)
2. Uruchom instalator
3. Wyskoczy okienko, że Microsoft Defender zablokował instalację
4. Kliknij "Więcej informacji"
5. Kliknij "Uruchom mimo tego"
6. Uruchomi się kreator. Podążaj za jego instrukcjami

### 🐧 Linux
Pobierz odpowiedni plik instalacyjny dla swojego systemu z zakładki [Releases](https://github.com/bookoteka/bookoteka/releases/latest), uruchom go, a w razie potrzeby systemowego ostrzeżenia (SmartScreen) zezwól na jego wykonanie.
