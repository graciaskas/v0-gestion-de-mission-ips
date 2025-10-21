# Système de Gestion de Missions - IPS

Application de gestion de missions pour l'Inspection Provinciale de Santé.

## Fonctionnalités

- 🏢 **Registre des entreprises** - Gestion complète des établissements inspectés (hôpitaux, pharmacies, hôtels, etc.)
- 📋 **Gestion des missions** - Création et suivi des missions d'inspection, encadrement, audit et enquête
- 📄 **Gestion documentaire** - Archivage et organisation des documents liés aux missions
- 📊 **Tableaux de bord** - Statistiques et rapports détaillés
- 👥 **Gestion des utilisateurs** - Système d'authentification avec rôles et permissions
- 🔔 **Notifications push** - Alertes en temps réel pour les missions et échéances

## Technologies

- **Framework**: Next.js 15 avec App Router
- **Base de données**: Mock database (pour démo) / SQLite avec Prisma (pour production)
- **Authentification**: JWT avec jose
- **UI**: Tailwind CSS + shadcn/ui
- **Graphiques**: Recharts

## Démo en ligne

L'application utilise une base de données mockée pour la démo. Pour une utilisation en production, configurez Prisma avec SQLite ou PostgreSQL.

## Connexion

Utilisez ces identifiants pour vous connecter:
- **Email**: admin@ips.gov ou j.dupont@ips.gov
- **Mot de passe**: n'importe quel mot de passe (démo)

## Installation locale avec Prisma

1. Cloner le projet
2. Installer les dépendances:
\`\`\`bash
npm install
\`\`\`

3. Remplacer `lib/mock-db.ts` par une vraie connexion Prisma
4. Initialiser la base de données:
\`\`\`bash
npx prisma generate
npx prisma db push
npx tsx scripts/seed-database.ts
\`\`\`

5. Lancer le serveur:
\`\`\`bash
npm run dev
\`\`\`

## Structure de la base de données

- **User** - Utilisateurs du système (admin, inspecteurs, archivistes)
- **Entreprise** - Établissements inspectés
- **Mission** - Missions d'inspection avec différents types
- **Constat** - Constats d'irrégularités
- **Infraction** - Faits infractionnels
- **ActionCorrectrice** - Plan de redressement avec actions et échéances
- **Document** - Documents et archives
- **Notification** - Notifications push pour les utilisateurs

## Rôles utilisateurs

- **ADMIN** - Accès complet au système
- **CHEF_SERVICE** - Gestion des missions et équipes
- **INSPECTEUR** - Création et suivi des missions
- **ARCHIVISTE** - Gestion documentaire

## Types de missions

- **Inspection contrôle** - Vérification de conformité
- **Encadrement** - Accompagnement et formation
- **Audit** - Évaluation approfondie
- **Enquête** - Investigation spécifique

## Bureaux

- Médicaux techniques
- Hygiène
- Personne
- Ressources
- Pharmacie
- Plantes médicinales
- Enseignement
