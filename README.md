UdharKhata Plus - Web Dashboard Setup
🚀 Quick Start Guide
This is a complete website for UdharKhata Plus using GitHub Pages (frontend) + Supabase (backend/database).

📁 Files Included
index.html - Landing page with features, pricing, and login

dashboard.html - Ultra-modern dashboard for logged-in users

🔧 Setup Instructions
Step 1: Supabase Setup
Go to supabase.com and create a new project (or use existing)

Get your credentials from Project Settings → API:

Project URL (e.g., https://xxxxx.supabase.co)

Anon/Public Key

Step 2: Update Configuration
In both index.html and dashboard.html, replace:

javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
With your actual Supabase credentials.

Step 3: Create Database Tables (in Supabase SQL Editor)
sql
-- Customers table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    balance DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'credit' or 'debit'
    amount DECIMAL NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
Step 4: Deploy to GitHub Pages
Create a new GitHub repository (e.g., udharkhata-web)

Upload these files:

index.html

dashboard.html

Go to repository Settings → Pages

Under "Source", select main branch

Click Save

Your site will be live at: https://YOUR_USERNAME.github.io/udharkhata-web/

Step 5: Custom Domain (Optional)
Buy a domain (e.g., udharkhata.com from Namecheap, GoDaddy)

In GitHub Pages settings, add your custom domain

Update DNS records at your domain registrar:

text
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
🎨 Design Features
Landing Page
✅ Clean hero section with clear value proposition

✅ Features showcase (6 cards)

✅ Pricing tiers (₹799, ₹1299, ₹1799)

✅ Login/Signup modals

✅ Supabase authentication integration

✅ Fully responsive

Dashboard
✅ Modern sidebar navigation

✅ 4 KPI stat cards (customers, receive, pay, monthly)

✅ Recent transactions list

✅ Quick action buttons

✅ Chart placeholder (integrate Chart.js for graphs)

✅ Top customers table

✅ Responsive design

✅ Follows 2025 UI trends (hyper-minimalism, card-based)

🔐 Security Features
Row Level Security (RLS) enabled

Users can only access their own data

Secure authentication via Supabase Auth

Email verification on signup

🚀 Next Steps
Add Chart Visualization
Add Chart.js for transaction trends:

xml
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
Then replace the chart placeholder with actual Chart.js code.

Connect to Real Data
The dashboard currently shows dummy data. Connect it to your actual Supabase tables by:

Fetching transactions

Calculating real-time balances

Updating UI dynamically

Mobile App Integration
Since you're building the mobile app, you can:

Share the same Supabase backend

Add deep linking from website to app

Use website for marketing, app for daily use

💡 Features to Add
 Add actual Chart.js graphs

 Real-time data sync with Supabase

 Customer management CRUD

 Transaction filtering

 Export reports as PDF

 WhatsApp reminder integration

 Settings page

 Dark mode toggle

 Multi-language support

📊 Cost Analysis
Service	Cost	Details
GitHub Pages	FREE	100GB bandwidth/month
Supabase	FREE	500MB database, 50K monthly users
Custom Domain	₹500-1000/year	Optional
Total: ₹0 (without custom domain)

🎯 Marketing Strategy
Use this website to:

Showcase app features before download

Build email waitlist

Offer web dashboard as premium feature

SEO optimization for "udhar khata app"

Run Google Ads to landing page

📞 Support
For questions about:

Frontend: HTML/CSS/JavaScript

Backend: Supabase documentation

Hosting: GitHub Pages documentation

Built with ❤️ for UdharKhata Plus

