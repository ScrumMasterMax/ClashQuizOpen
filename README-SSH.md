# SSH‑Zugriff (Kurzinfo)

Wir empfehlen SSH für Git‑Zugriff — sicherer und komfortabler für Entwickler. Kurz: Jeder Entwickler nutzt seinen eigenen SSH‑Key, der Public‑Key wird ins eigene GitHub‑Profil geladen.

Kurzanleitung
1. SSH‑Key erzeugen (einmalig)
```bash
ssh-keygen -t ed25519 -C "deine.email@example.com"
```
2. Public Key zu GitHub hinzufügen
- GitHub → Settings → SSH and GPG keys → New SSH key → Public Key (`~/.ssh/id_ed25519.pub`) einfügen.

3. Verbindung testen
```bash
ssh -T git@github.com
# Erwartet: "Hi <username>! You've successfully authenticated..."
```

4. Repo per SSH klonen
```bash
git clone git@github.com:ScrumMasterMax/ClashQuizOpen.git
cd ClashQuizOpen
git fetch origin
git checkout -b feat/python-mariadb-scaffold origin/feat/python-mariadb-scaffold
```

Wichtig
- Teile niemals private Keys.
- Nutzt GitHub‑Teams oder Collaborator‑Rollen, um Repo‑Zugriff zu vergeben.
- Alternative: HTTPS mit Personal Access Token (PAT), falls SSH nicht möglich.
````
