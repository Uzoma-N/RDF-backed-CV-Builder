USAGE GUIDE — CV Builder (RDF-backed Flask portfolio)

**Purpose**
This document helps someone who wants to run, modify, or extend the project. It complements `README.md` by focusing on practical steps, common edits, and debugging tips.

**Quick start (developer)**
1. From repository root, create a virtual environment and install dependencies:
```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install Flask rdflib
```
2. Start the app:
```powershell
python backend2/app.py
```
3. Open `http://127.0.0.1:5000/` in your browser.

**Project flow & where to change things**
- Data source: `backend2/database/resume.ttl` — edit this file to update content (photos, roles, education, etc.). Use Turtle syntax.
- Queries: `backend2/pyscript/rdfquery.py` — all SPARQL queries and prefixes live here. If you add new properties to the TTL, add/extend queries here.
- Data transformer: `backend2/pyscript/grapher.py` — runs queries, formats dates, processes URIs, aggregates results into JSON keys. Key helper methods:
  - `aggregate_by_keys(data, group_keys)` — groups list-of-dicts into consolidated entries.
  - `process_uri_fragment(value)` — strips custom URIs so front-end gets readable fragments.
  - `format_date_string(date_string, format_type)` — formats ISO date strings to readable forms.
- Backend: `backend2/app.py` — routes that serve the page and accept POST filters. The app embeds the JSON inside the HTML template at `#all-data-container` on initial render.
- Frontend: `backend2/static/script.js` — reads the injected JSON and renders the UI. It also sends POST requests to `/` to filter by profile.

**Adding a new person/profile**
1. Add triples in `backend2/database/resume.ttl` for the new person following existing patterns.
2. Ensure you provide the fields queried by `rdfquery.py` (or update the queries accordingly).
3. Restart the Flask server to load the new TTL.

**Editing SPARQL/Testing queries**
- To test SPARQL snippets quickly using `rdflib` in Python REPL:
```python
from rdflib import Graph
g = Graph()
g.parse('backend2/database/resume.ttl', format='turtle')
q = """<your SPARQL query with PREFIXes>"""
for row in g.query(q):
    print(row)
```
- Make sure to include the same prefixes used by the project (see `rdfquery.py::get_prefix()`).

**Common troubleshooting**
- "File not found" for TTL: Confirm you ran the server from the repo root so `backend2/database/resume.ttl` path resolves.
- JSON/JS parse errors in browser console: Open `View Source` on the served page and inspect content inside `<script id="all-data-container">` — malformed JSON indicates a serialization bug in `grapher.py`.
- Date formatting shows "Invalid Date Format": Check that stored date strings are ISO `YYYY-MM-DD` or include a `T` timestamp (function `format_date_string` expects `YYYY-MM-DD` portion).

**Extending**
- Add new query in `rdfquery.py` and call it from `grapher.py`. Update `script.js` to consume the new JSON key.
- If you want to move queries from code to external files, keep prefixes consistent and load them before executing.

**Tests (manual)**
- Verify that `NameList` contains expected names on initial load.
- Click or POST to filter profiles and confirm UI updates and server returns JSON.

**Contributor notes**
- Keep SPARQL queries in `rdfquery.py` to make maintenance simpler.
- Avoid changing JSON key names without updating both `grapher.py` and `script.js`.
