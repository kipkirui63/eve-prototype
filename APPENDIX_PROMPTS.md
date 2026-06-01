# Appendix: Key Development Prompts

This appendix records the main prompts used to develop and deploy the EcoVerify application for BUS4012 Assignment 03.

## 1. Backend Framework And Supabase Setup

```text
postgresql://postgres:[YOUR-PASSWORD]@db.kbsldrdochhsmybpdxuj.supabase.co:5432/postgres
i have created the env but i haven't added anything
and can we use django?
```

## 2. Django Backend, Authentication, And Submissions

```text
i have updated the backend with django, please now lets build the backend for our application, authentication and any submission or anything uploaded:

Part A: Individual Development & Deployment
The application must include a React frontend, Python backend, Supabase database, functional screens, user-submitted data saved to and retrieved from Supabase, environment variables for sensitive credentials, prompts appendix, and GitHub repository walkthrough.
```

## 3. Supabase Connection Debugging

```text
I tried running python manage.py runserver and got a PostgreSQL connection error saying Network is unreachable for the Supabase database host.
```

## 4. Register And Sign In Flow

```text
now i have been able to connect to the db successfully, now, i dont see the signup page in the frontend, lets have the signup-register and the sign in , ensure its working well
```

## 5. Auth Page UI Refinement

```text
on the signin and register buttons to switch remove so we only remain with register here and sign in here
```

## 6. Registration Fields

```text
now in signup what do we have to collect? currently its just email and password, is that enough?
```

```text
for register shouldn't we add the phone number?
```

## 7. Password Visibility And Clean URLs

```text
also in password add the eye icon
http://localhost:5173/#/onboarding, all my links have these #, i dont want it
now- frontend should go to git@github.com:kipkirui63/eve-prototype.git
backend should go to : git@github.com:kipkirui63/ecoverify-backend.git
```

## 8. Immediate Onboarding Profile Saving

```text
now, the data we enter during the onboarding process, is it sent to the db?
```

```text
update to immediate profile saving,commit each change for both the frontend and backend strictly, each change
```

## 9. Render Backend Deployment

```text
now, i want to deploy the backend in render
```

## 10. Production Frontend And Backend URLs

```text
https://ecoverify-backend.onrender.com
https://eve-prototype.vercel.app

thats my frontend and backend
```

## 11. Supabase Demo Explanation

```text
now, i have created registered on the hosted frontend but the Supabase says no users on authentication - there are currently no users that signed up in your project
```

```text
Demonstrates the functioning application, including a user completing a full workflow and data being saved to and retrieved from the Supabase database.
Opens the Supabase Table Editor or dashboard to confirm that data submitted through the application is correctly saved to the database.

how do i show these?
```

## 12. Architecture And Repository Walkthrough Script

```text
Briefly explains your application architecture, covering your React frontend, Python backend, and Supabase integration, and demonstrates how sensitive credentials have been managed securely. Include a walkthrough of the key prompts used to develop the application.
Showcases your GitHub repository, including a brief walkthrough of your repository structure, committed folders, and your .gitignore file.

give me what to say here
```
