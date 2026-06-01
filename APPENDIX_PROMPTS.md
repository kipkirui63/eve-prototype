# Appendix: Key Development Prompts

These are the main prompts that guided the development and deployment of the EcoVerify application.

## 1. Build The Application

```text
Build a full EcoVerify MVP using React for the frontend, Python/Django for the backend, and Supabase Postgres as the database. The application should allow merchants to register, complete onboarding, submit product verification evidence, and view saved verification results.
```

Purpose: This prompt defined the overall application scope, technology stack, and main user workflow.

## 2. Add Authentication

```text
Create a working sign-in and registration flow. Registration should collect business email, phone number, password, and confirm password. Sign-in should authenticate existing users and keep protected screens unavailable until the user is logged in.
```

Purpose: This prompt guided the creation of user accounts, login protection, and the registration form fields needed for merchant users.

## 3. Save User Data To Supabase

```text
Connect the Django backend to Supabase Postgres and save real user-submitted data. Onboarding profile data should be saved immediately, and product verification submissions, uploaded evidence metadata, generated reports, and activity history should be saved and retrieved from Supabase.
```

Purpose: This prompt ensured the app used Supabase as the persistent database and that submitted user data could be both stored and retrieved.

## 4. Improve The Frontend Experience

```text
Make all application screens functional and polished. Add a password visibility eye icon, remove hash-based URLs, use clean routes such as /register and /onboarding, and ensure the dashboard, products, history, onboarding, and verification screens continue working after deployment.
```

Purpose: This prompt focused on improving usability, navigation, and the frontend experience across the full application.

## 5. Deploy And Secure The Application

```text
Prepare the application for deployment with the React frontend on Vercel and the Django backend on Render. Store sensitive credentials such as the Django secret key and Supabase database connection string in environment variables, keep them out of the frontend, and add .gitignore rules so secrets, virtual environments, build folders, and local databases are not committed.
```

Purpose: This prompt guided deployment setup and secure credential management for the live production application.
