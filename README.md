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

Par défaut, Supabase restreint l'accès à vos tables. Pour que les formulaires de contact et de candidature fonctionnent publiquement, vous **devez** activer les politiques de sécurité (RLS) et créer des règles pour autoriser les insertions.

1.  Allez dans votre projet Supabase.
2.  Allez dans `Authentication -> Policies`.
3.  Assurez-vous que "Enable Row Level Security (RLS)" est activé pour les tables `contactFormSubmissions` et `applications`.
4.  Allez dans le `SQL Editor` et exécutez les commandes suivantes pour créer les politiques nécessaires.

#### Pour la table `contactFormSubmissions` :
Permet à n'importe qui d'envoyer un message et aux administrateurs de les lire.
```sql
-- 1. Activer RLS pour la table (si ce n'est pas déjà fait)
ALTER TABLE public."contactFormSubmissions" ENABLE ROW LEVEL SECURITY;

-- 2. Créer une politique pour autoriser l'insertion publique
CREATE POLICY "Allow public insert for anyone"
ON public."contactFormSubmissions"
FOR INSERT
WITH CHECK (true);

-- 3. CRUCIAL : Créer une politique pour autoriser la lecture par les administrateurs
CREATE POLICY "Allow read for authenticated users"
ON public."contactFormSubmissions"
FOR SELECT
USING (auth.role() = 'authenticated');
```

#### Pour la table `applications` :
Permet à n'importe qui de soumettre une candidature.
```sql
-- 1. Activer RLS pour la table (si ce n'est pas déjà fait)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 2. Créer une politique pour autoriser l'insertion publique
CREATE POLICY "Allow public insert for anyone"
ON public.applications
FOR INSERT
WITH CHECK (true);
```

### 3. Modèles d'E-mail Supabase

Cette étape n'est plus nécessaire si vous utilisez la création directe d'utilisateurs.

---

Une fois ces étapes complétées, votre application sera pleinement fonctionnelle en production.
