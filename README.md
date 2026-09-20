# **bookoteka**
Kompleksowa aplikacja na komputer służąca do śledzenia przeczytanych książek

## Instalacja
### 🍎 macOS
Możesz zainstalować aplikację bezpośrednio przez menedżer pakietów **Homebrew**:
1. Zainstaluj Caska z dedykowanego repozytorium:
   ```bash
   brew install --cask bookoteka/tap/bookoteka
2. Ważne (Gatekeeper): Ponieważ aplikacja jest projektem Open Source i nie posiada płatnego certyfikatu Apple Developer ID, macOS domyślnie zablokuje jej pierwsze uruchomienie. Aby odblokować aplikację, wykonaj w terminalu jednorazowe polecenie:
   ```bash
   xattr -d com.apple.quarantine /Applications/Bookoteka.app
#### 🌐 Pobranie i instalacja przez Terminal (curl)

Jeśli nie używasz Homebrew, możesz pobrać i zainstalować aplikację jedną komendą:

##### 1. Pobranie i rozpakowanie do /Applications
```bash
curl -L -o /tmp/Bookoteka.dmg $(curl -s [https://api.github.com/repos/bookoteka/bookoteka/releases/latest](https://api.github.com/repos/bookoteka/bookoteka/releases/latest) | grep "browser_download_url.*_aarch64.dmg" | cut -d '"' -f 4) && \
hdiutil attach /tmp/Bookoteka.dmg -mountpoint /tmp/Bookoteka_mount -quiet && \
cp -R /tmp/Bookoteka_mount/Bookoteka.app /Applications/ && \
hdiutil detach /tmp/Bookoteka_mount -quiet && \
rm /tmp/Bookoteka.dmg
```

##### 2. Zdjecie kwarantanny macOS (Gatekeeper)
```bash
xattr -d com.apple.quarantine /Applications/Bookoteka.app
