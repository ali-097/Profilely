# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Profilely (GitHub → Portfolio)

This project is a small, deterministic tool to generate a static personal portfolio from a GitHub username. It fetches public repositories, allows selecting and featuring projects, provides manual sections (bio, skills, links), previews themes live and exports a downloadable static site ready for hosting (for example, on Vercel).

## Run locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Export

Use the Export button in the app to download a ZIP containing a ready-to-deploy static site (includes `index.html` and `README.md` with deployment steps).

## Deployment (Vercel)

1. Unzip the exported site or push the generated files to a Git repository.
2. On Vercel, create a new project and point it to the repository (no build step required for plain static HTML).
3. Alternatively, use the Vercel CLI from the folder: `vercel`.

Notes:

- The app is deterministic and rule-based — no AI-generated content is used.
- GitHub API rate limits apply for unauthenticated requests (60 requests/hour). If you have many repositories, README checks may hit rate limits; you can still use repo descriptions as fallback.
