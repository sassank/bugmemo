# BugMemo

BugMemo est une **SaaS pour les développeurs** qui permet de **conserver et retrouver facilement les bugs rencontrés**, leurs logs et leurs solutions.  
Idéal pour ne plus jamais oublier comment résoudre un problème rencontré précédemment.

---

## 🌟 Fonctionnalités

- Authentification des utilisateurs (login / register)  
- Dashboard personnalisé pour chaque utilisateur  
- Création, lecture, modification et suppression (CRUD) des bugs  
- Recherche et filtrage par titre ou tags  
- Interface simple et responsive avec Tailwind CSS  

---

## 🛠 Technologies utilisées

- Next.js(App Router + TypeScript)  
- Tailwind CSS
- Supabase (authentification et la base PostgreSQL)  
- Déploiement avec Vercel

---

## 🚀 Lancer le projet en local

1. Cloner le dépôt :

```bash
git clone https://github.com/ton-username/bugmemo.git
cd bugmemo
```

2. Installer les dépendances :

```
bash
Copier le code
npm install / yarn install
Créer le fichier .env.local avec tes variables Supabase :

env
Copier le code
NEXT_PUBLIC_SUPABASE_URL=ton_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3. Lancer le serveur de développement :

```
bash
npm run dev / yarn dev
```

http://localhost:3000 pour voir l’application.

## Déploiement
BugMemo est déployé sur Vercel :
https://bugmemo.vercel.app

## Contribuer
Les contributions sont les bienvenues :

- Signaler des bugs
- Proposer des améliorations
- Participer au développement de nouvelles fonctionnalités