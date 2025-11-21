# Kujuwa Consulting - Application Web

Ceci est une application Next.js pour le site de Kujuwa Consulting.

## Technologies

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Base de données & Auth**: [Supabase](https://supabase.com/)
*   **UI**: [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
*   **Hébergement**: Conçu pour des plateformes comme Vercel, Netlify, ou Firebase App Hosting.

---

## Guide de Déploiement

L'application est prête pour le déploiement. Cependant, quelques étapes de configuration sont **cruciales** pour que tout fonctionne in production.

### 1. Variables d'Environnement

Vous devez configurer les variables d'environnement suivantes sur votre plateforme d'hébergement. Copiez les valeurs depuis votre fichier local `.env.local`.

```
NEXT_PUBLIC_SUPABASE_URL=VOTRE_URL_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_SUPABASE
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE
```

**IMPORTANT :** La `SUPABASE_SERVICE_ROLE_KEY` est secrète et ne doit jamais être exposée côté client. Elle est utilisée pour les actions d'administration (comme la création d'utilisateurs). Vous la trouverez dans `Project Settings > API` dans votre tableau de bord Supabase.

### 2. Politiques de Sécurité Supabase (RLS)

Par défaut, Supabase restreint l'accès à vos tables. Pour que les formulaires de contact et de candidature fonctionnent publiquement, vous **devez** activer les politiques de sécurité (RLS) et créer des règles pour autoriser les insertions et la gestion.

1.  Allez dans votre projet Supabase.
2.  Allez dans `Authentication -> Policies`.
3.  Assurez-vous que "Enable Row Level Security (RLS)" est activé pour les tables `contactFormSubmissions` et `applications`.
4.  Allez dans le `SQL Editor` et exécutez les commandes suivantes pour créer les politiques nécessaires.

#### Pour la table `contactFormSubmissions` :
Permet à n'importe qui d'envoyer un message et aux administrateurs de les lire et de les supprimer.

```sql
-- 1. Permettre à n'importe qui d'insérer un message (visiteurs publics)
-- Exécutez cette commande si la politique n'existe pas déjà.
CREATE POLICY "Allow public insert for anyone"
ON public."contactFormSubmissions"
FOR INSERT
WITH CHECK (true);

-- 2. Permettre aux admins de tout gérer (lire, supprimer, etc.)
-- Utilise CREATE OR REPLACE pour éviter les erreurs si la politique existe déjà.
CREATE OR REPLACE POLICY "Allow all actions for authenticated users"
ON public."contactFormSubmissions"
FOR ALL -- 'ALL' inclut SELECT, INSERT, UPDATE, DELETE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

#### Pour la table `applications` :
Permet à n'importe qui de soumettre une candidature et aux administrateurs de les gérer.
```sql
-- 1. Activer RLS pour la table (si ce n'est pas déjà fait)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 2. Permettre l'insertion publique pour les candidats
-- Exécutez cette commande si la politique n'existe pas déjà.
CREATE POLICY "Allow public insert for anyone"
ON public.applications
FOR INSERT
WITH CHECK (true);

-- 3. (NOUVEAU) Permettre aux admins de lire et supprimer les candidatures
-- Cette politique est essentielle pour le panneau d'administration.
CREATE OR REPLACE POLICY "Allow all actions for authenticated users"
ON public.applications
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

### 3. Modèles d'E-mail Supabase

Cette étape n'est plus nécessaire car vous créez les utilisateurs directement.

---

Une fois ces étapes complétées, votre application sera pleinement fonctionnelle en production.
