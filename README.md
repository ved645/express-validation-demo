# Server Side Validation using ExpressJS

A registration web app that validates every field on the server with `express-validator`.
Browser validation is disabled (`novalidate`) so you can see the server doing the work.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

## Validation rules

| Field | Rules |
|-------|-------|
| Name | required, 3-50 chars, letters/spaces only |
| Email | required, valid format, must be unique |
| Age | required, integer 18-100 |
| Phone | required, 10-digit Indian mobile (starts 6-9) |
| Password | min 8 chars, upper, lower, digit, special char |
| Confirm Password | must match password |

## Deploy on Render (free)

1. Push this folder to a GitHub repository.
2. Go to https://render.com -> New -> Web Service -> connect the repo.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Click Deploy. You get a public URL like `https://your-app.onrender.com`.

(Railway, Vercel or Cyclic work similarly. The app reads the `PORT` environment variable.)

## Test with curl (shows server validation without a browser)

```bash
curl -i -X POST http://localhost:3000/register -d "name=A&email=bad&age=10"
```
