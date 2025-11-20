# Kujuwa Consulting - Application Web

Ceci est une application Next.js pour le site de Kujuwa Consulting.

## Technologies

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Base de données & Auth**: [Supabase](https://supabase.com/)
*   **UI**: [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
*   **Hébergement**: Conçu pour des plateformes comme Vercel, Netlify, ou Firebase App Hosting.

---

## Guide de Déploiement

L'application est prête pour le déploiement. Cependant, quelques étapes de configuration sont **cruciales** pour que tout fonctionne en production.

### 1. Variables d'Environnement

Vous devez configurer les variables d'environnement suivantes sur votre plateforme d'hébergement. Copiez les valeurs depuis votre fichier local `.env.local`.

```
NEXT_PUBLIC_SUPABASE_URL=VOTRE_URL_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_SUPABASE
```

### 2. Politiques de Sécurité Supabase (RLS)

Par défaut, Supabase restreint l'accès à vos tables. Pour que les formulaires de contact et de candidature fonctionnent publiquement, vous **devez** activer les politiques de sécurité (RLS) et créer des règles pour autoriser les insertions.

1.  Allez dans votre projet Supabase.
2.  Allez dans `Authentication -> Policies`.
3.  Assurez-vous que "Enable Row Level Security (RLS)" est activé pour les tables `contactFormSubmissions` et `applications`.
4.  Allez dans le `SQL Editor` et exécutez les commandes suivantes pour créer les politiques nécessaires.

#### Pour la table `contactFormSubmissions` :
Permet à n'importe qui (visiteur anonyme inclus) d'envoyer un message via le formulaire de contact.
```sql
-- 1. Enable RLS for the table
ALTER TABLE public."contactFormSubmissions" ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow public insert
CREATE POLICY "Allow public insert for anyone"
ON public."contactFormSubmissions"
FOR INSERT
WITH CHECK (true);
```

#### Pour la table `applications` :
Permet à n'importe qui de soumettre une candidature.
```sql
-- 1. Enable RLS for the table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow public insert
CREATE POLICY "Allow public insert for anyone"
ON public.applications
FOR INSERT
WITH CHECK (true);
```

### 3. Modèles d'E-mail Supabase

Pour que la fonctionnalité d'invitation d'administrateurs fonctionne :
1.  Allez dans votre projet Supabase.
2.  Allez dans `Authentication -> Email Templates`.
3.  Activez le modèle **"Invite User"**.

---

Une fois ces trois étapes complétées, votre application sera pleinement fonctionnelle en production.
