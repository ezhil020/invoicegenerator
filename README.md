
# InvoicePro Client

A modern React-based invoice management system with features for creating, previewing, and managing invoices.

## Features

- 📄 Create detailed invoices with multiple line items
- 💰 Automatic calculations for subtotal, tax, and discounts  
- 🔍 Preview invoices before generation
- 📥 Download invoices as PDF
- 📋 View invoice history with filtering capabilities
- 💫 Modern UI with responsive design
- ₹ Indian Rupee (₹) currency support

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- Axios for API calls
- jsPDF for PDF generation

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── InvoiceForm    # Invoice creation form
│   ├── InvoicePreview # Invoice preview and PDF generation
│   ├── InvoiceHistory # Invoice listing and management
│   └── Layout         # Main application layout
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── pages/            # Page components
└── App.tsx           # Main application component
```

## Key Components

1. **InvoiceForm**: 
   - Creates new invoices
   - Handles item management
   - Calculates totals automatically

2. **InvoicePreview**:
   - Displays invoice preview
   - Generates downloadable PDFs
   - Professional invoice layout

3. **InvoiceHistory**:
   - Lists all generated invoices
   - Search and filter capabilities
   - Status tracking (paid/pending/overdue)

## Development

1. Navigate to client directory
```bash
cd client
```

2. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## UI Features

- Responsive design for all screen sizes
- Dark/light theme support
- Loading states and transitions
- Toast notifications
- Form validation
- Mobile-friendly interface

## Component Usage

```jsx
// Creating a new invoice
<InvoiceForm onSubmit={handleInvoiceSubmit} />

// Displaying invoice preview
<InvoicePreview data={invoiceData} />

// Showing invoice history
<InvoiceHistory />
```

## PDF Generation

The application uses jsPDF with autotable for generating professional PDF invoices with:
- Company branding
- Itemized billing
- Tax calculations
- Payment terms
- Professional layout

## State Management

- React Query for server state
- Local state with React hooks
- Form state management
- Navigation state with Wouter

## Styling

- Tailwind CSS for utility-first styling
- Custom theme configuration
- Responsive design patterns
- Shadcn UI components integration
BACKEND

---

# 📦 Invoice pro – Backend

This is the backend of the **Invoice pro** application built with **Node.js**, **Express**, and **MongoDB**. It handles invoice creation, retrieval, and storage using a simple REST API.

## 📁 Folder Structure

```
/server
├── models/
│   ├── Invoice.js        # Mongoose model for invoice data
│   └── Counter.js        # Mongoose model to auto-increment invoice numbers
├── routes/
│   └── invoiceRoutes.js  # API routes for handling invoice operations
├── server.js             # Entry point of the backend application
```

## 🚀 Features

- Create and save invoices with dynamic pricing
- Automatically assign unique, incrementing invoice numbers
- Apply tax and discount calculations
- Retrieve all saved invoices (used for invoice history view)
- Connects to MongoDB for persistent storage

## 📦 Tech Stack

- **Node.js** + **Express** – Server and API
- **MongoDB** + **Mongoose** – Database and schema modeling
- **CORS** – For cross-origin communication with the frontend

## 🔌 API Endpoints

| Method | Endpoint         | Description                      |
|--------|------------------|----------------------------------|
| POST   | `/api/invoices`  | Create and save a new invoice    |
| GET    | `/api/invoices`  | Retrieve all saved invoices      |

## ⚙️ Setup Instructions

1. **Navigate to the server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file and add your MongoDB URI:**
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the server:**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

## 📝 Models

### `Invoice.js`

Defines the structure of each invoice document, including:
- `invoiceNumber`
- `clientName`
- `items` (array with description, quantity, and price)
- `tax`, `discount`, `totalAmount`
- `date`

### `Counter.js`

A helper model to track and auto-increment invoice numbers.

## 🛠️ Notes

- Be sure to start MongoDB locally or use a cloud DB (like MongoDB Atlas).

---
