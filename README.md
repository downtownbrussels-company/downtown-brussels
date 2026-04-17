# DownTown Brussels Blog System

This project keeps the existing DownTown Brussels site as a plain HTML/CSS/JS website and adds a lightweight Express backend for:

- public blog pages
- protected admin blog management
- MongoDB storage
- Cloudinary image uploads
- environment-based admin auth
- Vercel-ready deployment

## What changed

- local image uploads were replaced with `Cloudinary`
- static assets were copied into `public/` so Vercel can serve them correctly
- a Vercel entrypoint was added at [api/index.js](C:/Users/Darbinyan/Desktop/Downtown/api/index.js)
- Vercel rewrites were added in [vercel.json](C:/Users/Darbinyan/Desktop/Downtown/vercel.json)
- the reservation flow still runs through the backend so browser code does not expose delivery secrets

## Stack

- Plain HTML, CSS, and JavaScript for the frontend
- Node.js + Express backend
- MongoDB Atlas for blog data
- Cloudinary for blog cover images
- JWT auth in an `HttpOnly` cookie for admin sessions
- `multer` memory uploads for Vercel-compatible image handling

## Routes

Public:

- `GET /`
- `GET /blog`
- `GET /blog/:slug`

Admin/auth:

- `GET /admin`
- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/dashboard`
- `GET /admin/blogs`
- `GET /admin/blogs/new`
- `POST /admin/blogs`
- `GET /admin/blogs/:id/edit`
- `POST /admin/blogs/:id`
- `POST /admin/blogs/:id/delete`
- `POST /admin/blogs/:id/publish-toggle`

Reservations:

- `POST /api/reservations`

## Project structure

```text
.
├── .env
├── .env.example
├── api/
│   └── index.js
├── public/
│   ├── admin/
│   │   ├── admin.css
│   │   └── admin.js
│   ├── blog/
│   │   └── blog.css
│   ├── images/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server/
│   ├── app.js
│   ├── config/
│   │   └── env.js
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── uploads.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── public.js
│   │   └── reservation.js
│   ├── services/
│   │   ├── blog-service.js
│   │   ├── media-service.js
│   │   └── reservation-service.js
│   ├── utils/
│   │   ├── auth.js
│   │   ├── content.js
│   │   ├── files.js
│   │   ├── format.js
│   │   └── slug.js
│   ├── views/
│   │   ├── admin.js
│   │   ├── blog.js
│   │   └── layout.js
│   └── index.js
├── vercel.json
└── package.json
```

## Environment variables

Required:

- `SITE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `PORT`
- `ADMIN_COOKIE_NAME`
- `ADMIN_TOKEN_TTL`
- `UPLOAD_MAX_FILE_SIZE_MB`
- `CLOUDINARY_FOLDER`
- `RESERVATION_WEB3FORMS_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESTAURANT_EMAIL`

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Fill in `.env`

3. Start locally:

   ```bash
   npm run dev
   ```

4. Or run without `nodemon`:

   ```bash
   npm start
   ```

Local URLs:

- Homepage: [http://localhost:3000](http://localhost:3000)
- Blog: [http://localhost:3000/blog](http://localhost:3000/blog)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Default admin login

The admin credentials come from environment variables, not frontend code.

Local default values:

- Username: `root`
- Password: `root1234`

## MongoDB Atlas setup

1. Create an Atlas project
2. Create an `M0` free cluster
3. Create a database user
4. Add your IP for local development
5. Copy the connection string into `MONGODB_URI`
6. Set `MONGODB_DB_NAME` to the database name you want, for example `downtown`

## Cloudinary setup

1. Create a Cloudinary account
2. Open the dashboard
3. Copy:
   - cloud name
   - API key
   - API secret
4. Put them into the matching environment variables
5. Optionally set `CLOUDINARY_FOLDER=downtown-blog`

## Vercel deployment

This project is prepared for Vercel by:

- serving static assets from `public/`
- routing dynamic blog/admin requests through `api/index.js`
- using Cloudinary instead of local uploaded files

In Vercel, add these environment variables:

- `SITE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_COOKIE_NAME`
- `ADMIN_TOKEN_TTL`
- `UPLOAD_MAX_FILE_SIZE_MB`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`
- `RESERVATION_WEB3FORMS_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESTAURANT_EMAIL`

Example production values:

```env
SITE_URL=https://your-domain.vercel.app
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_USERNAME=root
ADMIN_PASSWORD=root1234
ADMIN_COOKIE_NAME=downtown_admin
ADMIN_TOKEN_TTL=8h
UPLOAD_MAX_FILE_SIZE_MB=4
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=downtown
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=downtown-blog
RESERVATION_WEB3FORMS_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
RESTAURANT_EMAIL=downtownbrussels@gmail.com
```

## Important notes

- The homepage still does not link to the blog
- Blog discovery still starts only at `/blog`
- Blog detail pages are still at `/blog/:slug`
- Blog content is sanitized before rendering
- Uploaded images are stored in Cloudinary, not on the server
- MongoDB stores the blog posts, including status and SEO fields

## Assumptions made

- MongoDB Atlas free tier is acceptable for this project size
- Cloudinary-hosted cover images are acceptable for public blog pages
- The current static homepage remains the active public landing page
