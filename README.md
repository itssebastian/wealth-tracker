# WealthOS — Personal Wealth & Loan Tracker

A production-ready full-stack personal finance portal built with React + Node.js + MySQL.

---

## 🏗 Architecture

```
wealth-tracker/
├── frontend/          # React + Vite + MUI (deploy to Vercel)
│   └── src/
│       ├── modules/
│       │   ├── auth/          LoginPage, RegisterPage
│       │   ├── dashboard/     Dashboard (summary, charts)
│       │   ├── wealth/        Savings, FD, Gold, Silver tabs
│       │   ├── loans/         Loan tracker + EMI + Prepayment
│       │   ├── goals/         Goal progress cards
│       │   ├── reports/       Charts & summary
│       │   └── settings/      Profile & preferences
│       ├── components/
│       │   ├── common/        StatCard, PageHeader, ConfirmDialog
│       │   └── layout/        AppLayout (sidebar nav)
│       ├── store/             authStore (Zustand)
│       ├── services/          api.js (Axios + interceptors)
│       └── utils/             theme.js, formatters.js
│
├── backend/           # Node.js + Express + Sequelize (deploy to Render/Railway)
│   └── src/
│       ├── config/    database.js
│       ├── models/    User, SavingsAccount, FixedDeposit, GoldInvestment,
│       │              SilverInvestment, Loan, LoanPayment, LoanPrepayment,
│       │              Goal, NetworthHistory
│       ├── controllers/  authController, dashboardController,
│       │                 wealthController, loanController, goalController
│       ├── routes/    index.js (all API routes)
│       ├── middleware/ auth.js (JWT)
│       └── seeders/   seed.js (demo data)
│
└── schema.sql         # Raw MySQL schema (alternative to Sequelize sync)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (local or PlanetScale / Railway MySQL / AWS RDS)

---

### 1. Clone & install

```bash
git clone <your-repo>
cd wealth-tracker

# Backend
cd backend
npm install
cp .env.example .env   # fill in DB credentials and JWT_SECRET

# Frontend
cd ../frontend
npm install
cp .env.example .env   # set VITE_API_URL
```

### 2. Database setup

**Option A — Let Sequelize create tables automatically (recommended for dev):**
```bash
# Just start the server — sequelize.sync({ alter: true }) runs on boot
cd backend && npm run dev
```

**Option B — Run raw SQL schema:**
```bash
mysql -u root -p < schema.sql
```

### 3. Seed demo data

```bash
cd backend
npm run seed
# Creates: demo@wealthtracker.in / Demo@1234
# With ₹1L savings, ₹1L FD, ₹50K gold, ₹25K silver, ₹16.75L home loan
```

### 4. Start both servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

---

## 🌐 Production Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Via Vercel CLI:
npx vercel --prod

# Or connect GitHub repo in Vercel dashboard
# Build command: npm run build
# Output directory: dist
# Root directory: frontend
```

**Environment variable in Vercel:**
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

### Backend → Render

1. Push `backend/` to GitHub
2. Create a new **Web Service** on render.com
3. Set **Root Directory** to `backend`
4. Build: `npm install` | Start: `npm start`
5. Add env vars from `.env.example`

### Database → PlanetScale (recommended free tier)

```bash
# 1. Create DB at planetscale.com
# 2. Get connection string
# 3. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Render env vars
# 4. PlanetScale uses port 3306 with SSL — add:
#    DB_SSL=true  (and update database.js dialectOptions accordingly)
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get profile |
| PUT | `/api/v1/auth/profile` | Update profile |
| GET | `/api/v1/dashboard/summary` | Full financial summary |
| GET | `/api/v1/dashboard/networth-trend` | Historical net worth |
| POST | `/api/v1/dashboard/record-networth` | Snapshot today's net worth |
| GET/POST | `/api/v1/wealth/savings` | Savings CRUD |
| GET/POST | `/api/v1/wealth/fds` | Fixed Deposits CRUD |
| GET/POST | `/api/v1/wealth/gold` | Gold CRUD |
| GET/POST | `/api/v1/wealth/silver` | Silver CRUD |
| GET/POST | `/api/v1/loans` | Loan CRUD |
| GET/POST | `/api/v1/loans/:id/payments` | EMI payments |
| GET/POST | `/api/v1/loans/:id/prepayments` | Prepayments |
| GET/POST | `/api/v1/goals` | Goals CRUD |

All protected routes require: `Authorization: Bearer <token>`

---

## 🧩 Adding New Modules (Future Scalability)

Each module is fully self-contained. To add e.g. **Mutual Funds**:

1. **Backend model:** `src/models/MutualFund.js` → add to `models/index.js`
2. **Backend controller:** `src/controllers/mutualFundController.js`
3. **Backend routes:** add to `src/routes/index.js`
4. **Frontend module:** `src/modules/mutualfunds/MutualFundsPage.jsx`
5. **Sidebar nav:** add entry to `navItems` in `AppLayout.jsx`
6. **Route:** add `<Route path="/mutual-funds" ...>` in `App.jsx`

Zero changes to existing modules required.

**Planned future modules:**
- Mutual Funds / Stocks / Crypto
- Insurance policies
- Real Estate
- EPF / PPF / NPS
- Income & Expenses tracker
- Tax Planning

---

## 🛡 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens (7-day expiry)
- Helmet.js security headers
- All routes user-scoped (userId check on every query)
- Soft deletes via `deletedAt` (paranoid mode)
- CORS restricted to frontend URL

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#6C63FF` | Buttons, active nav, accents |
| Secondary | `#00D9A3` | Success, growth indicators |
| Error | `#FF5C7C` | Loan amounts, negative P&L |
| Warning | `#FFB347` | FD maturity alerts |
| Dark BG | `#0D0F14` | App background |
| Card | `#1C1F2E` | Card surfaces |
| Font | Inter | All text |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + Vite |
| UI library | Material UI v5 |
| State management | Zustand |
| HTTP client | Axios |
| Charts | Recharts |
| Forms | React Hook Form |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| ORM | Sequelize v6 |
| Database | MySQL 8 |
| Auth | JWT + bcryptjs |
| Frontend deploy | Vercel |
| Backend deploy | Render / Railway |

---

*Built with ❤️ — WealthOS v1.0.0*
