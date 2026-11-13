## To-Do List
A lightweight to-do list built with vanilla HTML, CSS, and JavaScript. Tasks are saved in your browser with `localStorage`, so they remain available after reloading the page.

### Features

- Add tasks (up to 120 characters) and submit with the button or Enter.
- Mark tasks as complete or active.
- Filter the list by all, active, or completed tasks.
- Delete individual tasks or clear all completed tasks.
- See how many tasks remain.
- Keep tasks between visits in the same browser.

### Run locally

No dependencies or build step are required. Open `index.html` in a browser, or serve the project directory locally. For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Project files

- `index.html` — page structure and controls.
- `style.css` — layout and visual styling.
- `app.js` — task behavior, rendering, and browser storage.

## Storage

Tasks are stored in the browser's local storage under the `tasks` key. They are not synced to other browsers or devices. Clearing the browser's site data will remove saved tasks.
