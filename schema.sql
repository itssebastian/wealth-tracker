-- ============================================================
-- WealthOS — MySQL Schema
-- Run this to initialize the database from scratch
-- ============================================================

CREATE DATABASE IF NOT EXISTS wealth_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wealth_tracker;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  currency    VARCHAR(10)  DEFAULT 'INR',
  theme       ENUM('light','dark') DEFAULT 'light',
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt   DATETIME
) ENGINE=InnoDB;

-- ── Savings Accounts ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS savings_accounts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  userId        INT NOT NULL,
  bankName      VARCHAR(100) NOT NULL,
  accountType   ENUM('Savings','Current','Salary','NRI') DEFAULT 'Savings',
  currentBalance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  accountNumber VARCHAR(50),
  notes         TEXT,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_savings_user (userId)
) ENGINE=InnoDB;

-- ── Fixed Deposits ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fixed_deposits (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  userId                INT NOT NULL,
  bankName              VARCHAR(100) NOT NULL,
  fdNumber              VARCHAR(50),
  principalAmount       DECIMAL(15,2) NOT NULL,
  interestRate          DECIMAL(5,2) NOT NULL,
  startDate             DATE NOT NULL,
  maturityDate          DATE NOT NULL,
  maturityAmount        DECIMAL(15,2),
  compoundingFrequency  ENUM('Monthly','Quarterly','Annually') DEFAULT 'Quarterly',
  notes                 TEXT,
  isMatured             TINYINT(1) DEFAULT 0,
  createdAt             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt             DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_fd_user (userId),
  INDEX idx_fd_maturity (maturityDate)
) ENGINE=InnoDB;

-- ── Gold Investments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gold_investments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  userId        INT NOT NULL,
  type          ENUM('Physical Gold','Gold ETF','Sovereign Gold Bond') NOT NULL,
  quantity      DECIMAL(10,4) NOT NULL COMMENT 'grams',
  purchasePrice DECIMAL(10,2) NOT NULL COMMENT 'per gram',
  currentPrice  DECIMAL(10,2) NOT NULL COMMENT 'per gram',
  purchaseDate  DATE NOT NULL,
  notes         TEXT,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_gold_user (userId)
) ENGINE=InnoDB;

-- ── Silver Investments ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS silver_investments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  userId        INT NOT NULL,
  type          ENUM('Physical Silver','Silver ETF','SilverBees') NOT NULL,
  quantity      DECIMAL(10,4) NOT NULL COMMENT 'grams',
  purchasePrice DECIMAL(10,2) NOT NULL COMMENT 'per gram',
  currentPrice  DECIMAL(10,2) NOT NULL COMMENT 'per gram',
  purchaseDate  DATE NOT NULL,
  notes         TEXT,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_silver_user (userId)
) ENGINE=InnoDB;

-- ── Loans ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loans (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  userId              INT NOT NULL,
  bankName            VARCHAR(100) NOT NULL,
  loanType            ENUM('Home Loan','Car Loan','Personal Loan','Education Loan','Other') DEFAULT 'Home Loan',
  loanAmount          DECIMAL(15,2) NOT NULL,
  interestRate        DECIMAL(5,2) NOT NULL,
  loanStartDate       DATE NOT NULL,
  loanTenureMonths    INT NOT NULL,
  currentOutstanding  DECIMAL(15,2) NOT NULL,
  emiAmount           DECIMAL(10,2) NOT NULL,
  accountNumber       VARCHAR(50),
  notes               TEXT,
  isActive            TINYINT(1) DEFAULT 1,
  createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt           DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_loan_user (userId)
) ENGINE=InnoDB;

-- ── Loan Payments (EMIs) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS loan_payments (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  loanId                  INT NOT NULL,
  userId                  INT NOT NULL,
  paymentDate             DATE NOT NULL,
  emiAmount               DECIMAL(10,2) NOT NULL,
  principalComponent      DECIMAL(10,2) NOT NULL,
  interestComponent       DECIMAL(10,2) NOT NULL,
  outstandingAfterPayment DECIMAL(15,2) NOT NULL,
  notes                   TEXT,
  createdAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt               DATETIME,
  FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_payment_loan (loanId),
  INDEX idx_payment_date (paymentDate)
) ENGINE=InnoDB;

-- ── Loan Prepayments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loan_prepayments (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  loanId                      INT NOT NULL,
  userId                      INT NOT NULL,
  prepaymentDate              DATE NOT NULL,
  amount                      DECIMAL(15,2) NOT NULL,
  outstandingAfterPrepayment  DECIMAL(15,2) NOT NULL,
  interestSaved               DECIMAL(15,2),
  monthsSaved                 INT,
  notes                       TEXT,
  createdAt                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt                   DATETIME,
  FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_prepay_loan (loanId)
) ENGINE=InnoDB;

-- ── Goals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  userId        INT NOT NULL,
  goalName      VARCHAR(100) NOT NULL,
  goalType      ENUM('Emergency Fund','House Renovation','Car Purchase','Retirement','Child Education','Other') DEFAULT 'Other',
  targetAmount  DECIMAL(15,2) NOT NULL,
  currentAmount DECIMAL(15,2) DEFAULT 0.00,
  targetDate    DATE NOT NULL,
  notes         TEXT,
  isCompleted   TINYINT(1) DEFAULT 0,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_goal_user (userId)
) ENGINE=InnoDB;

-- ── Net Worth History ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS networth_history (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  userId            INT NOT NULL,
  recordDate        DATE NOT NULL,
  totalSavings      DECIMAL(15,2) DEFAULT 0.00,
  totalFD           DECIMAL(15,2) DEFAULT 0.00,
  totalGold         DECIMAL(15,2) DEFAULT 0.00,
  totalSilver       DECIMAL(15,2) DEFAULT 0.00,
  totalLiabilities  DECIMAL(15,2) DEFAULT 0.00,
  netWorth          DECIMAL(15,2) DEFAULT 0.00,
  createdAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt         DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_nw_user_date (userId, recordDate)
) ENGINE=InnoDB;

-- ── Notifications (future-ready) ──────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  userId      INT NOT NULL,
  type        VARCHAR(50) NOT NULL,
  message     TEXT NOT NULL,
  isRead      TINYINT(1) DEFAULT 0,
  severity    ENUM('info','warning','error','success') DEFAULT 'info',
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt   DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (userId, isRead)
) ENGINE=InnoDB;

-- ============================================================
-- Demo seed data (optional — use `npm run seed` instead)
-- ============================================================
-- INSERT INTO users (name, email, password, currency, theme) VALUES
--   ('Demo User', 'demo@wealthtracker.in', '$2a$12$...hashed...', 'INR', 'dark');
