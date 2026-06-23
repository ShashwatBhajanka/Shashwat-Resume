# Shashwat Bhajanka — Resume Website

A personal resume site built with **Django**, created as a learning project to get hands-on with the framework — routing, templates, and the admin/debug tooling that come with it. The resume page itself is a single creatively-styled template (data-notebook theme: grid background, timeline-style experience log, tag chips for skills).

🔗 Live demo: _add your deployed link here once hosted_

---

## Features

- Single-page resume rendered through a Django template (education, experience, clubs & societies, skills, achievements, certifications)
- Custom "field log" visual theme — grid-paper background, timeline markers, monospace data labels
- Django admin enabled at `/admin/` for future content management
- `django-debug-toolbar` wired in for inspecting queries/requests during development

## Tech Stack

| Layer       | Tool                          |
|-------------|-------------------------------|
| Backend     | Django 6.0.6                  |
| Database    | SQLite3 (default, dev)        |
| Frontend    | HTML, CSS (templating via Django) |
| Dev tooling | django-debug-toolbar          |

## Project Structure

```
MyDjangoProject/
├── manage.py
├── db.sqlite3
├── requirements.txt
├── MyDjangoProject/          # project config
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── playground/                # app serving the resume page
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── migrations/
    ├── models.py
    ├── templates/
    │   └── playground/
    │       └── index.html     # resume template
    ├── urls.py
    └── views.py
```

> Adjust template/view file names above to match whatever you've named them inside `playground/`.

## Prerequisites

- Python 3.10+
- pip

## Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/ShashwatBhajanka/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   If you don't have a `requirements.txt` yet, generate one with:
   ```bash
   pip freeze > requirements.txt
   ```
   At minimum it should include `django` and `django-debug-toolbar`.

4. **Apply migrations**
   ```bash
   python manage.py migrate
   ```

5. **Run the development server**
   ```bash
   python manage.py runserver
   ```

6. **View the site**
   - Resume page: `http://127.0.0.1:8000/playground/`
   - Admin panel: `http://127.0.0.1:8000/admin/`
   - Debug toolbar: appears automatically on the right side while `DEBUG=True` and you're browsing from `127.0.0.1`

## Configuration Notes

- `DEBUG = True` and `ALLOWED_HOSTS = []` are dev-only defaults — update both before deploying anywhere.
- The `SECRET_KEY` currently sits directly in `settings.py`. Before pushing this repo publicly or deploying, move it to an environment variable instead, e.g.:
  ```python
  import os
  SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
  ```
- Static files are served from `STATIC_URL = 'static/'` — run `python manage.py collectstatic` if/when deploying.

## What I'm Learning Here

This project is part of getting comfortable with Django fundamentals:
- Project vs. app structure
- URL routing and the Django template engine
- Using the admin site and debug toolbar during development
- Eventually: deploying a Django app properly (env vars, static files, a real database)

## Roadmap

- [ ] Move resume content into a Django model so it's editable via `/admin/` instead of hardcoded in the template
- [ ] Add `requirements.txt`
- [ ] Deploy (Render / Railway / PythonAnywhere)
- [ ] Move `SECRET_KEY` to environment variables

## Contact

- Email: bhajankashashwat@gmail.com
- LinkedIn: [linkedin.com/in/shashwat-bhajanka](https://linkedin.com/in/shashwat-bhajanka)
- GitHub: [github.com/ShashwatBhajanka](https://github.com/ShashwatBhajanka)

## License

This project is for personal/portfolio use.
