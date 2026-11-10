# Kyn-Web

Website for the [Kyn](https://github.com/Hardion-Labs/Kyn) language, by Hardion Labs:
<https://hardion-labs.github.io/Kyn-Web/>

Built with Vite, React, TypeScript and Tailwind CSS.

## Development

Requires Node.js 22.12 or higher (the deploy uses version 24).

```sh
npm ci           # installs the dependencies
npm run dev      # development server
npm run build    # generates the site in dist/
npm run preview  # serves the contents of dist/ locally
```

## Publishing to GitHub Pages

On every push to the `main` branch, the workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site and
publishes the `dist/` folder to GitHub Pages. You can also run it manually in
**Actions → Deploy to GitHub Pages → Run workflow**.

Required setup (one time only): in **Settings → Pages → Build and
deployment → Source**, select **GitHub Actions**.

> **Why not "Deploy from a branch"?** In that mode GitHub Pages publishes the
> source code without building it. The root `index.html` points to `/src/main.tsx`,
> which the browser cannot run, and the site shows up completely blank.

## Routes

The site uses hash routes:

| Page            | URL                    |
| --------------- | ---------------------- |
| Home            | `#/`                   |
| Download        | `#/download`           |
| Documentation   | `#/documentation`      |

The old Portuguese links (`#/documentacao`, `#/baixar`, `#/docs`) are still recognized and open the new pages.
