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

Pour que l'application fonctionne correctement, vous **devez** activer les politiques de sécurité (RLS) sur vos tables et créer les règles ci-dessous.

1.  Allez dans votre projet Supabase.
2.  Allez dans `Authentication -> Policies` et assurez-vous que "Enable Row Level Security (RLS)" est activé pour les tables `contactFormSubmissions` et `applications`.
3.  Allez dans le `SQL Editor` et exécutez les commandes suivantes.

#### Pour la table `contactFormSubmissions` :
Permet à n'importe qui d'envoyer un message, et aux administrateurs (utilisateurs connectés) de tout gérer.

```sql
-- Supprime l'ancienne politique de lecture si elle existe, pour éviter les conflits.
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public."contactFormSubmissions";

-- Crée une politique "fourre-tout" pour les administrateurs
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public."contactFormSubmissions";
CREATE POLICY "Allow all actions for authenticated users"
ON public."contactFormSubmissions"
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Crée une politique pour permettre aux visiteurs de soumettre le formulaire
DROP POLICY IF EXISTS "Allow public insert for anyone" ON public."contactFormSubmissions";
CREATE POLICY "Allow public insert for anyone"
ON public."contactFormSubmissions"
FOR INSERT
WITH CHECK (true);
```

#### Pour la table `applications` :
Permet à n'importe qui de postuler, et aux administrateurs (utilisateurs connectés) de tout gérer.

```sql
-- Supprime l'ancienne politique de lecture si elle existe, pour éviter les conflits.
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.applications;

-- Crée une politique "fourre-tout" pour les administrateurs
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.applications;
CREATE POLICY "Allow all actions for authenticated users"
ON public.applications
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Crée une politique pour permettre aux visiteurs de soumettre une candidature
DROP POLICY IF EXISTS "Allow public insert for anyone" ON public.applications;
CREATE POLICY "Allow public insert for anyone"
ON public.applications
FOR INSERT
WITH CHECK (true);
```

### 3. Modèles d'E-mail Supabase

Cette étape n'est plus nécessaire car vous créez les utilisateurs directement.

---

Une fois ces étapes complétées, votre application sera pleinement fonctionnelle en production.
