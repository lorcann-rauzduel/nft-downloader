# NFT Video Downloader

Ce repository permet de télécharger automatiquement les vidéos et miniatures de la collection FullHouseNFT.

## Fonctionnalités

- Téléchargement automatique des vidéos NFT
- Génération de miniatures pour chaque vidéo
- Rapport détaillé des téléchargements
- Reprise automatique en cas d'interruption
- Logs détaillés du processus

## Prérequis

### Windows

1. Installer Node.js

   - Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org/)
   - Choisissez la version "LTS" (recommandée pour la plupart des utilisateurs)
   - Suivez l'assistant d'installation en laissant les options par défaut

2. Installer FFmpeg
   - Téléchargez FFmpeg depuis [ffmpeg.org](https://ffmpeg.org/download.html)
   - Extrayez le fichier ZIP téléchargé
   - Ajoutez le chemin de FFmpeg aux variables d'environnement Windows :
     1. Recherchez "variables d'environnement" dans le menu Démarrer
     2. Cliquez sur "Modifier les variables d'environnement système"
     3. Cliquez sur "Variables d'environnement"
     4. Dans "Variables système", sélectionnez "Path" et cliquez sur "Modifier"
     5. Cliquez sur "Nouveau" et ajoutez le chemin vers le dossier FFmpeg/bin

### macOS

1. Installer Homebrew (si pas déjà installé)

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Installer Node.js et FFmpeg
   ```bash
   brew install node
   brew install ffmpeg
   ```

### Linux (Ubuntu/Debian)

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer FFmpeg
sudo apt-get install ffmpeg
```

## Installation

1. Téléchargez le projet sur votre ordinateur

   - Cliquez sur le bouton vert "Code" en haut de la page
   - Sélectionnez "Download ZIP"
   - Extrayez le fichier ZIP dans un dossier de votre choix

2. Ouvrez un terminal/invite de commande :

   - Windows : Win + R, tapez "cmd" et appuyez sur Entrée
   - macOS : Ouvrez "Terminal" depuis les Applications
   - Linux : Ctrl + Alt + T

3. Naviguez vers le dossier du projet :

   ```bash
   cd chemin/vers/le/dossier/fullhousenft
   ```

4. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration

1. Créez votre fichier de configuration :

   ```bash
   # Windows
   copy .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` avec vos informations :
   - `MORALIS_API_KEY` : Votre clé API Moralis
   - `NFT_CONTRACT_ADDRESS` : L'adresse de votre contrat NFT
   - `CHAIN_ID` : "0x89" pour Polygon Mainnet
   - `TOTAL_NFTS` : Nombre total de NFTs dans votre collection
   - `IPFS_BASE_URI` : L'URI de base IPFS de vos vidéos
   - `DIR_PATH` : Dossier où seront sauvegardées les vidéos (par défaut: "assets")

## Utilisation

1. Démarrez le script :

   ```bash
   npm start
   ```

2. Le script va :

   - Se connecter à la blockchain
   - Télécharger les vidéos une par une
   - Créer des miniatures
   - Générer un rapport détaillé

3. Les fichiers seront organisés comme suit :
   ```
   assets/
   ├── video1.mp4
   ├── video1_thumb.jpg
   ├── video2.mp4
   ├── video2_thumb.jpg
   └── ...
   ```

## Résultats

À la fin du processus, vous trouverez :

- Les vidéos dans le dossier `assets/`
- Les miniatures avec le suffixe `_thumb.jpg`
- Un fichier `download_results.json` avec les statistiques détaillées

## Résolution des problèmes courants

### Le script ne démarre pas

- Vérifiez que Node.js est bien installé : `node --version`
- Vérifiez que FFmpeg est bien installé : `ffmpeg -version`
- Vérifiez que toutes les dépendances sont installées : `npm install`

### Erreur de téléchargement

- Vérifiez votre connexion internet
- Vérifiez que votre clé API Moralis est valide
- Vérifiez que l'adresse du contrat est correcte
- Attention : Il est possible que le fichier vidéo ne soit plus disponible sur IPFS (vérifiez directement sur IPFS).

### Les miniatures ne sont pas générées

- Vérifiez que FFmpeg est bien installé et accessible
- Vérifiez les permissions du dossier de destination
