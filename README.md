---
<div align="center">
  <img src="static_github/images/Github_logo_white.png?raw=true" alt="Writers Block" width="400"/>
</div>

---
### Abstract
> The name of the app is `Writers Block`. It is a role-base web application using Django (backend)
> and React.js (frontend), designed to manage users and content creation with different access levels.
> The application supports three primary roles: `Admin`, `Manager`, and `Writer`. Each role has specific
> permissions and capabilities:

---
### 🕹️ Tech Stack
| **Tech/Tool** | ***Layer*** | ***Purpose/Reason*** |
|:----------- |:-----------:|:-----------|
| **Python + Django** | Backend/Framework| Main web framework |
| **Postgresql** | Database (ORM) | Often used aside from the default db sqlite in django |
| **Django Templates, HTML, CSS** | Templating / Frontend | To render UI for (Homepage, resto listings, menus, account or order page, etc.) |
| **Django's auth system** | User Auth / Permission / Protected Views | Role base access controlled views / pages |
| **Python classes / methods, views, payment API integration** | order / e-commerce flows | FOr placing orders, processing carts, statuses, payment |
| **GitHub** | Version Control | For code management |
| **VSCode** | Development | Local development |

---
### 👍 Features
✅ 1. User Registration - Allows new users to create an account.  
✅ 2. Login Funtionality - Enable users to access the system securely using authentication tokens or sessions.  
✅ 3. Email Verification - Implement an email confirmation process to verify user accounts before granting access to certain features.  

---
### Project Set Up and Starting

- **Step 1**: Create Root Folder, open a cmd/bash. (Usually in the ~Desktop)
    ```
    mkdir <ProjectName>
    ```
    
- **Step 2**: Access the created Root Folder.
    ```
    cd <ProjectName>
    ```
    
- **Step 3**: Inside the Root Folder, open a cmd/bash then create a `virtual environment`. ***Note: (important)***
    ```
    python3 -m venv .venv
    ```
    ... `.venv` ← is the name of the virtual environment ***BUT you can named it base on you as developer***.
  
- **Step 4**: Now that you have `.venv` ← virtual environment inside the Project Root Folder, from here on, ***you need to work only--inside the virtual environment*** nothing more. Let's enable the .venv inside your cmd/bash.
    ***For macOS/Linux***
    ```
    source .venv/bin/activate
    ```
    ***For windows OS***
    ```
    .venv/Scripts/activate 
    ```
- **Step 5**: `(.venv) ~Desktop/<ProjectName> %` ← Seeing this prefix `(.venv)` in your cmd/bash means you are working inside the virtual environment and good to go working inside your project folder. In here, we need to **Install Django and DRF**
    ```
    pip install django djangorestframework
    ```

    [IMPORTANT]  
  - if you add or create some `django apps`, you need to register it in the `main/core django` ← the one you created using this command `django-admin startproject <django-project-name>`.
      
  - 👇 in the illustration, the added `django apps` is `core`.

    ![INSTALLED_APPS](static_github/images/rest_framework.png?raw=true) 

- **Step 6**: Now, let's set up our folders that we need to use. (`backend`, `frontend`, `.gitignore`, `README`, etc.)
---
### 📂 backend 
- **Step 7**: Inside `.venv` root folder make a directory folder named `backend`.

    ```
    mkdir backend
    ```

- **Step 8**: Access backend folder.
    ```
    cd backend
    ```
- **Step 9**: Inside the backend folder, create a new `django` project
    ```
    django-admin startproject <django-project-name>
    ```
    ... `<django-project-name>` ← is the name of main/core django ***BUT you can named it base on you as developer***.

    **(NOTE)**  
    ... also, in this backend folder where you create a `django app`, (you can create as much or many as you want, depends on what your project/system needs)
    ```
    python manage.py startapp <appName>
    ```
    ... `<appName>` ← is the name of the app ***BUT you can named it base on you as developer***.
  
  [IMPORTANT]  
  - if you add or create some `django apps`, you need to register it in the `main/core django` ← the one you created using this command `django-admin startproject <django-project-name>`.
  
  - 👇 in the illustration, the added `django apps` is `core`.

      ![INSTALLED_APPS](static_github/images/installed_aps.png?raw=true) 


- **Step 10**: Now, that we already set up to run the `backend`. First, we need to run an initial migrations.
    ```
    python manage.py migrate
    ```

- **Step 11**: Run the server, invoke this command inside the `.venv` backend cmd/bash.
    ```
    python manage.py runserver
    ```
    ![DJANGO_SUCCESS](static_github/images/django_success.png?raw=true) 
  
---
### 📂 frontend
- **Step 12**: Inside `.venv` root folder make a directory folder named `frontend`.

    ```
    mkdir frontend
    ```

- **Step 13**: Access backend folder.
    ```
    cd frontend
    ```
- **Step 14**: Inside the frontend folder, create a new `react` project
    ```
    npx create-react-app <frontend>
    ```
    ... `<frontend>` ← is the name of main/core django ***BUT you can named it base on you as developer***.
  
- **Step 15**: Now, that we already set up the `frontend`. Start the React developement server.
    ```
    npm start
    ```
    ![DJANGO_SUCCESS](static_github/images/react_success.png?raw=true)

---
### (GitHub) for Version Control
- **Step 16**: To initialized git, we need to do it inside the project root folder.
    ```
    cd path/<ProjectName>
    ```
    ... then, invoke this command.
    ```
    git init
    ```
- **Step 2**: Add all the files to git, using this command.
    ```
    git add .
    ```
- **Step 3**: Commit your changes.
    ```
    git commit -m "Your project related notes for changes/progress"
    ```
- **Step 4**: Creating a Github repository
> 1. Go to Github website &rarr; login to your personal Github account
> 2. Click New Repository &rarr; give it a name (e.g., <MainFolder>)
> 3. Choose visibility &rarr; between Public and Private  
>    ``` Public = the repository can be seen or visibile to everyone. ```  
>    ```Private = exclusive to yu and collaborators/team members you invite to the repo```
> 4. As is, for initializing README, .gitignore, or license.
> 5. Click `Create Repository`.  
![DJANGO_SUCCESS](static_github/images/new_repo.png?raw=true)
---
> 7. Link you `local development` to the newly created Github Repository.  
> 8. Inside the project folder terminal, invoke this following commands:  
```
git remote add origin https://github.com/<your Github username>/<git repo name>.git
```
```
git branch -M main
```
```
git push -u origin main
```
---
<p align="center">Congratulations your local dev is now connected to online github repo. 🥳</p>


---

### 🗂️ Folder Structure

```
EL106_MidTerm_PIT/              ← Main project folder (root Git repo)
├── .git/                       ← Git version control folder
├── .venv/                      ← Python virtual environment
├── .gitignore                  ← Global ignore file for backend + frontend
│
├── backend/                    ← Django REST Framework backend
│   ├── manage.py
│   ├── core/                   ← Django project folder (settings, urls, wsgi)
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── api/                    ← Django app for user authentication
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   └── db.sqlite3              ← Local database (auto-created)
│
└── frontend/                   ← React app (frontend UI)
|   ├── package.json
|   ├── public/
|   └── src/
|
└── static_github
    ├── images                  ← thumbnails, etc.
    ├── videos                  ← demo videos

```



---
### 🎥 Video Url for the App Demonstration
> Hover and Click the thumbnail 👇👇👇 to get redirected to my youtube channel... 
[![Watch the video](static_github/images/thumbnail2.png?raw=true)](https://youtu.be/viwDder5NMQ?si=p3kPbQC_YckOe3LY)

---
<p align="center">Thank You ❤️</p>
