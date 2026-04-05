
# 🪵 Flyingwood Furniture Store

An AI-powered **Furniture E-commerce Website** built to provide a seamless shopping experience with smart recommendations, real-time data management, and a modern user interface.

---

## 🚀 Features

- 🛋️ **Dynamic Product Catalog** – Displays all furniture items from Supabase database.  
- 🔍 **Search & Filter System** – Quickly find products by category, material, or color.  
- 💬 **AI Recommendation** – Suggests similar or trending products using smart logic.  
- 🧾 **Detailed Product View** – Shows description, material, and color details.  
- 🛒 **Cart Management** – Add, remove, and review selected items easily.  
- ⚙️ **Supabase Integration** – Connected for real-time database operations.  
- 📱 **Fully Responsive** – Works smoothly on desktop, tablet, and mobile.

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Backend (API)** | Supabase REST APIs |
| **Hosting** | Vercel |
| **Version Control** | Git + GitHub |

---

## 🗂️ Project Structure

```

flyingwood/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Main app pages
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Main React component
│   ├── index.tsx        # Entry point
│   └── supabaseClient.ts # Supabase connection setup
├── public/              # Static assets
├── package.json
└── README.md

````

---

## ⚙️ Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.  
2. In your **Table Editor**, run this SQL in the SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS furniture_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  subcategory text,
  material text NOT NULL,
  color text NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  created_at timestamp DEFAULT now()
);
````

3. Get your Supabase credentials:

   * **Project URL**
   * **anon public key**

4. Create a file in your project:

```ts
// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_KEY";
export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 🧠 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/flyingwood.git

# Navigate to folder
cd flyingwood

# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 Deployment

This project is ready for deployment on **Vercel**:

```bash
npm run build
vercel deploy
```

---

## 📊 Database Example (CSV Import)

You can import sample product data using a CSV file like this:

| name         | description                 | category | material  | color | price | image_url   |
| ------------ | --------------------------- | -------- | --------- | ----- | ----- | ----------- |
| Wooden Chair | Elegant handcrafted chair   | Chairs   | Teak Wood | Brown | 2499  | https://... |
| Glass Table  | Modern tempered glass table | Tables   | Glass     | Clear | 4999  | https://... |

---

## 💡 Future Enhancements

* 🧠 Integrate ChatGPT-style AI assistant for design suggestions
* 🪑 Add AR/3D model viewing
* 💳 Secure payment gateway integration
* 📦 Live order tracking dashboard

---



---



