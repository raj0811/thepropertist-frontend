# The Propertist Frontend

Frontend application for The Propertist property listing platform.

Users can browse and filter properties, view property details, and submit enquiries. Agents can register, log in, manage property listings, upload property images, and view received enquiries.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify

## Features

- Public property listing
- Search properties by location
- Filter properties by BHK, price, status and listing type
- Property details page
- General and property-specific enquiries
- Agent login and registration
- Protected agent dashboard
- Agent profile
- Add, edit and delete properties
- Upload up to five property images
- View agent enquiries
- Pagination
- Responsive design

## Prerequisites

Make sure the following are installed:

- Node.js 20 or later
- npm
- The Propertist backend running locally

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

Clone the frontend repository:

```bash
git clone repo link
```

Open the project directory:

```bash
cd folder name
```

Install the dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the project root:

```text
propertist-frontend/
├── src/
├── package.json
├── vite.config.ts
├── .env
└── README.md
```

Add the local backend URL to `.env`:

```env
VITE_API_URL=http://localhost:4000
```

Make sure the backend is running on port `4000`.

Only variables beginning with `VITE_` can be accessed by the Vite frontend.

The API URL is accessed in the application using:

```ts
const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";
```

## Sample Environment File

Create an `.env.example` file:

```env
VITE_API_URL=http://localhost:4000
```

Do not put secrets such as AWS keys, database credentials or JWT secrets in frontend environment files.

## Start the Backend

Before running the frontend, start the backend project:

```bash
npm run start:dev
```

The backend should run at:

```text
http://localhost:4000
```

## Start the Frontend

Run the development server:

```bash
npm run dev
```

The terminal will show the frontend URL, normally:

```text
http://localhost:5173
```

Open this URL in your browser.

## Build the Project

Create a production build:

```bash
npm run build
```

The compiled frontend will be created inside:

```text
dist/
```

## Preview the Production Build

Preview the compiled application locally:

```bash
npm run preview
```

## Available Commands

```text
npm run dev       Start the development server
npm run build     Create the production build
npm run preview   Preview the production build
npm run lint      Run ESLint
```

## Backend CORS Setup

The backend must allow requests from the local frontend URL:

```ts
app.enableCors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
});
```


## Application Routes

```text
/home                   Property listing page
/about                  About page
/properties/:id         Property details page
/dashboard              Agent dashboard
/login                  Agent login page
```

The home page and property details are public. The dashboard requires agent authentication.

## Property Image Upload

Agents can upload property images when adding or editing a property.

Image upload process:

1. The agent selects an image.
2. The frontend converts it to Base64.
3. The Base64 image is sent to the backend.
4. The backend uploads the image to AWS S3.
5. The backend returns the uploaded image URL.
6. The frontend stores the URL in the property images array.
7. The images array is sent when creating or editing the property.

Supported formats:

```text
JPG
PNG
WebP
```

Maximum image size:

```text
2 MB
```

Maximum images per property:

```text
5
```

## Git Ignore

Make sure `.gitignore` contains:

```gitignore
node_modules/
dist/

.env
.env.*
!.env.example

*.local
*.log

.vscode/
.idea/

.DS_Store
Thumbs.db
```
