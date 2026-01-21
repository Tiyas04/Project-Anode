
# Sai PSB Laboratory - Chemical E-commerce

A modern, full-stack e-commerce platform aimed at providing premium laboratory chemicals and supplies. Built with Next.js, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure Sign Up & Login/Logout with JWT (Access & Refresh tokens).
- **Role-Based Access Control**:
  - **User**: Browse products, manage cart, place orders, view order history.
  - **Admin**: Dashboard for managing products (Add/Edit/Delete) and viewing all customer orders.
- **Product Management**:
  - Image uploads via Cloudinary.
  - Detailed product attributes (CAS Number, Pack Size, Price, etc.).
- **Shopping Experience**:
  - Add to cart functionality.
  - Checkout process.
  - Order tracking.
- **Responsive Design**: Styled with Tailwind CSS for mobile and desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📦 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Tiyas04/project-anode.git
    cd project-anode
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example above into a new `.env` file.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/pages`: Next.js Pages Router pages (Legacy/Hybrid usage).
- `src/models`: Mongoose schemas (User, Product, Order, etc.).
- `src/lib`: Utility functions (DB connect, Cloudinary, etc.).

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint.

## 👤 Author

- **Name**: Tiyas
- **GitHub**: [@Tiyas04](https://github.com/Tiyas04)
