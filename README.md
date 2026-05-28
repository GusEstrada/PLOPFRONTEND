# PLOP - Frontend

Una mancha nueva cada día, dibújala a tu manera.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 + React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Dibujo | Canvas + Konva |
| Backend | [plop-backend](https://github.com/GusEstrada/PLOPBACKEND) |

---

## Funcionalidades

- **Login / Registro** — autenticación con JWT
- **Inicio** — mancha del día, contadores animados, cards
- **Dibujar** — canvas con plumones, capas, guardar/blot
- **Galería** — feed de dibujos paginado, modal, likes, comentarios
- **Perfil** — avatar personalizable, bio editable, galería de dibujos propios
- **Foro** — posts y comentarios

---

## Cómo correr local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

La app necesita el backend corriendo en `http://localhost:4000`. Ver [plop-backend](https://github.com/GusEstrada/PLOPBACKEND).

---

## Credenciales de prueba (seed)

| Email | Password | Rol |
|-------|----------|-----|
| admin@plop.app | plop123 | Admin |

---

## Deploy en Vercel

1. Subir repo a GitHub
2. Vercel → **Add New Project** → importar repo
3. **Environment Variables:**
   ```env
   API_URL=https://<backend>.railway.app
   ```
4. Deploy — Vercel detecta Next.js automáticamente

El frontend usa `apiFetch()` de `@/lib/api` que llama a `/api/...`. Next.js reescribe esas rutas al backend via `next.config.ts` usando la variable `API_URL`.

---

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `API_URL` | `http://localhost:4000` | URL del backend (proxy de Next.js) |

---

## Repos

- **Frontend:** https://github.com/GusEstrada/PLOPFRONTEND
- **Backend:** https://github.com/GusEstrada/PLOPBACKEND
