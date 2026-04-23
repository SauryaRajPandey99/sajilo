# Sajilo AI – Smart Finance Manager

Sajilo AI is an AI-powered financial management web application designed to simplify expense tracking for individuals and small businesses. The system converts unstructured financial data from receipts into structured transactions and actionable insights, enabling better financial visibility and decision-making.

Live Application: https://sajiloai.vercel.app/

---

## Features

* Secure authentication using Clerk
* AI-based receipt scanning and data extraction
* Multi-account financial management
* Automated transaction creation
* Interactive dashboard with financial insights
* Budget tracking with threshold alerts
* Recurring transaction support
* Searchable transaction history
* Monthly email reports

---

## System Workflow

1. User uploads a receipt (image or PDF)
2. AI processes the file and extracts key data such as amount, date, vendor, and category
3. User reviews and edits the extracted data if necessary
4. Transaction is created and linked to an account
5. Dashboard updates with real-time financial data
6. Monthly reports are generated and sent via email

---

## Technology Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Shadcn UI

### Backend

* Next.js API routes and server actions
* Prisma ORM

### Database and Storage

* Supabase (PostgreSQL database and storage)

### Authentication

* Clerk

### AI Services

* Google Vision API (OCR)
* Gemini AI (data parsing and categorization)

### Background Processing

* Inngest (event-driven workflows and scheduled jobs)

### Deployment

* Vercel

---

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/your-username/sajilo-ai.git
cd sajilo-ai
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the following environment variables:

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GOOGLE_AI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Project Structure

```
/app         Next.js application routes
/components  Reusable UI components
/actions     Server-side logic and workflows
/lib         Utility functions and configurations
/prisma      Database schema and migrations
```

---

## Security Considerations

* Authentication and session management handled by Clerk
* Row-Level Security (RLS) implemented in Supabase
* Secure API communication and validation
* Protected routes using middleware

---

## Future Work

* Advanced analytics and financial forecasting
* Mobile application support
* Multi-user collaboration for business accounts
* Improved AI accuracy for diverse receipt formats
* Export functionality for reports (PDF/CSV)

---

## Authors

Saurya Raj Pandey
Aakansha Gautam

---

## License

This project is developed for academic and educational purposes.
