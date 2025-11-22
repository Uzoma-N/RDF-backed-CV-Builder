# CV Builder (RDF-backed Flask Portfolio)

A small Flask-based portfolio/resume site that uses RDF (Turtle) as the single source of truth. The backend converts RDF data into JSON which the front-end consumes to render a dynamic, filterable CV/portfolio.

**Features**
- RDF-based data storage (Turtle `.ttl`) for structured resume data.
- Python backend (Flask + rdflib) that runs SPARQL queries and transforms results into a front-end friendly JSON shape.
- Simple client-side rendering using a minimal JS file and server-rendered template that injects the JSON payload.
- Query strings centralized in `pyscript/rdfquery.py` for easy modification.

**Tools & Libraries Used**
- **Python**: core runtime.
- **Flask**: web framework for serving templates and JSON.
- **rdflib**: RDF parsing and SPARQL execution.
- **Jinja2**: server-side templating (via Flask).
- **Vanilla JavaScript**: front-end rendering (`backend2/static/script.js`).

**Repository Layout (key files)**
- `backend2/app.py` — Flask entry point (GET serves initial page; POST returns filtered JSON for selected profile).
- `backend2/pyscript/grapher.py` — RDF loader and transformation logic (builds JSON from query results).
- `backend2/pyscript/rdfquery.py` — All SPARQL queries and common prefixes.
- `backend2/database/resume.ttl` — Turtle file containing RDF data (source of truth).
- `backend2/templates/index.html` — Template that receives JSON payload inside `<script id="all-data-container">`.
- `backend2/static/script.js` — Front-end renderer and filtering logic.
- `backend2/static/*` — CSS, assets, and JS.

**Important Data Shape**
The backend produces a JSON object with these top-level keys (used by `script.js`):
- `NameList`, `Name`, `Details`, `Category`, `Education`, `WorkExperience`, `Skills`, `Certificate`, `SkillType`, `Project`, `ProjectClass`, `Service`, `Social`

```

**How to run (development)**
Run from the repository root so relative paths to `resume.ttl` resolve correctly.

PowerShell (Windows) example:
```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install Flask rdflib
python backend2/app.py
```
The app runs in debug mode by default.

**Where to make common changes**
- Edit RDF data: `backend2/database/resume.ttl`.
- Change/extend SPARQL queries: `backend2/pyscript/rdfquery.py`.
- Change how queries are turned into JSON: `backend2/pyscript/grapher.py` (helpers: `aggregate_by_keys`, `process_uri_fragment`, `format_date_string`).
- Modify front-end rendering: `backend2/static/script.js` (look for `getAllData`, `renderAllData`, `fetchFilteredCV`).

**Publishing to GitHub**
Initialize, commit, and push to a new remote repository (example commands):

PowerShell:
```powershell
git init; git add .; git commit -m "Initial import: RDF-backed CV builder";
# Create a repo on GitHub (via website) and add the remote, or use the GitHub CLI:
# gh repo create <username>/<repo-name> --public --source=. --remote=origin
git remote add origin https://github.com/<username>/<repo>.git; git push -u origin main
```

**Notes & Tips**
- Always run the app from repo root because `grapher.py` uses a relative path to `backend2/database/resume.ttl`.
- If you edit SPARQL queries, test them quickly with a small RDFlib REPL snippet to ensure valid results.
