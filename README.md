# 🗂️ TaskFlow — Système de gestion de tâches collaboratif

Application full-stack de gestion de tâches développée avec **Laravel 12** (API REST) et **Angular 20** (Frontend).

---

## 🧰 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js 20+](https://nodejs.org) + npm
- [Angular CLI](https://angular.io/cli) : `npm install -g @angular/cli`
- Git

---

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/bossombra1/taskflow.git
cd taskflow
```

### 2. Backend Laravel
```bash
# Lancer les conteneurs Docker
docker compose up -d --build

# Copier le fichier d'environnement
cp taskflow-api/.env.example taskflow-api/.env

# Installer les dépendances
docker compose exec app composer install

# Générer la clé JWT
docker compose exec app php artisan jwt:secret

# Lancer les migrations
docker compose exec app php artisan migrate
```

### 3. Frontend Angular
```bash
cd taskflow-front
npm install
ng serve
```

---

## 🌐 Accès

| Service | URL |
|---|---|
| Frontend Angular | http://localhost:4200 |
| API Laravel | http://localhost:8000/api |
| Base de données | localhost:3306 |

---

## 🔑 Créer un compte test
```bash
docker compose exec app php artisan tinker
```
```php
App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test@test.com',
    'password' => bcrypt('password123'),
]);
```

Ou directement via **http://localhost:4200/register**

---

## 📡 Endpoints API

### Auth
| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/register | Inscription |
| POST | /api/login | Connexion |
| POST | /api/logout | Déconnexion |
| GET | /api/me | Utilisateur connecté |

### Projets
| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/projects | Liste des projets |
| POST | /api/projects | Créer un projet |
| GET | /api/projects/{id} | Détail d'un projet |
| PUT | /api/projects/{id} | Modifier un projet |
| DELETE | /api/projects/{id} | Supprimer un projet |

### Tâches
| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/projects/{id}/tasks | Liste des tâches (filtrable) |
| POST | /api/projects/{id}/tasks | Créer une tâche |
| GET | /api/projects/{id}/tasks/{taskId} | Détail d'une tâche |
| PUT | /api/projects/{id}/tasks/{taskId} | Modifier une tâche |
| DELETE | /api/projects/{id}/tasks/{taskId} | Supprimer une tâche |

### Dashboard
| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard | Statistiques utilisateur |

---

## 🏗️ Stack technique

| Côté | Technologie |
|---|---|
| Backend | Laravel 12, PHP 8.2, JWT Auth |
| Frontend | Angular 20, Signals, RxJS |
| Base de données | MySQL 8.0 |
| Infrastructure | Docker, Nginx |

---

## 🧪 Tests
```bash
docker compose exec app php artisan test
```

---

## 📁 Structure du projet
```
taskflow/
├── docker-compose.yml
├── README.md
├── taskflow-api/          # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   └── Models/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── tests/
└── taskflow-front/        # Frontend Angular
    └── src/app/
        ├── components/
        ├── services/
        ├── guards/
        ├── interceptors/
        └── models/
```