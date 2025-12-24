// Initialize Supabase
const SUPABASE_URL = 'https://sugkhnmogoyunxbfzcnp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z2tobm1vZ295dW54YmZ6Y25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNjIyMzYsImV4cCI6MjA3NTgzODIzNn0.xJ5Xlj4kD43CROsXOdrokWwqHZ01XtbUxJRfzwP6Lwg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;

// Check authentication
async function checkAuth() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = session.user;
    initPage();
}

// Initialize page based on current page
function initPage() {
    const page = window.location.pathname.split('/').pop();
    
    if (page === 'customers.html') {
        loadAllCustomers();
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            loadAllCustomers(e.target.value);
        });
    } else if (page === 'transactions.html') {
        loadAllTransactions();
        document.getElementById('filterType')?.addEventListener('change', (e) => {
            loadAllTransactions(e.target.value);
        });
    } else if (page === 'summary.html') {
        loadSummaryPage();
    }
}

// Load all customers
async function loadAllCustomers(search = '') {
    try {
        let query = supabaseClient
            .from('customers')
            .select('customer_name, phone_number, total_balance, created_at')
            .eq('user_id', currentUser.id)
            .eq('is_active', true)
            .order('total_balance', { ascending: false });

        if (search) {
            query = query.ilike('customer_name', `%${search}%`);
        }

        const { data: customers, error } = await query;
        if (error) throw error;

        const container = document.getElementById('customersContainer');
        
        if (customers.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>No customers found</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="customers-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Phone</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Added On</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(c => {
                        const balance = parseFloat(c.total_balance) || 0;
                        const balanceColor = balance > 0 ? 'var(--secondary)' : balance < 0 ? 'var(--danger)' : 'var(--gray)';
                        const statusBadge = balance > 0 ? 'badge-success' : balance < 0 ? 'badge-danger' : 'badge-warning';
                        const statusText = balance > 0 ? 'To Receive' : balance < 0 ? 'To Pay' : 'Settled';
                        const date = new Date(c.created_at).toLocaleDateString('en-IN');
                        
                        return `
                            <tr>
                                <td><strong>${c.customer_name}</strong></td>
                                <td>${c.phone_number || 'N/A'}</td>
                                <td style="color: ${balanceColor}; font-weight: 600;">₹${Math.abs(balance).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                <td><span class="badge ${statusBadge}">${statusText}</span></td>
                                <td>${date}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('customersContainer').innerHTML = '<div class="empty-state"><p style="color: var(--danger);">Error loading customers</p></div>';
    }
}

// Load all transactions
async function loadAllTransactions(filterType = 'ALL') {
    try {
        let query = supabaseClient
            .from('transactions')
            .select('transaction_id, customer_id, type, amount, note, date, created_at')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (filterType !== 'ALL') {
            query = query.eq('type', filterType);
        }

        const { data: transactions, error } = await query;
        if (error) throw error;

        // Get customer names
        const customerIds = [...new Set(transactions.map(t => t.customer_id))];
        const { data: customers } = await supabaseClient
            .from('customers')
            .select('customer_id, customer_name')
            .eq('user_id', currentUser.id)
            .in('customer_id', customerIds);

        const customerMap = {};
        customers?.forEach(c => customerMap[c.customer_id] = c.customer_name);

        const container = document.getElementById('transactionsContainer');
        
        if (transactions.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💰</div><p>No transactions found</p></div>';
            return;
        }

        container.innerHTML = `
            <table class="customers-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map(t => {
                        const customerName = customerMap[t.customer_id] || 'Unknown';
                        const date = new Date(t.date || t.created_at).toLocaleDateString('en-IN');
                        const typeBadge = t.type === 'CREDIT' ? 'badge-success' : 'badge-danger';
                        const amountColor = t.type === 'CREDIT' ? 'var(--secondary)' : 'var(--danger)';
                        const amountPrefix = t.type === 'CREDIT' ? '+' : '-';
                        
                        return `
                            <tr>
                                <td>${date}</td>
                                <td><strong>${customerName}</strong></td>
                                <td><span class="badge ${typeBadge}">${t.type}</span></td>
                                <td style="color: ${amountColor}; font-weight: 600;">${amountPrefix}₹${parseFloat(t.amount).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                <td>${t.note || '-'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('transactionsContainer').innerHTML = '<div class="empty-state"><p style="color: var(--danger);">Error loading transactions</p></div>';
    }
}

// Load summary page
async function loadSummaryPage() {
    try {
        // Get all customers
        const { data: customers } = await supabaseClient
            .from('customers')
            .select('total_balance')
            .eq('user_id', currentUser.id)
            .eq('is_active', true);

        // Get all transactions
        const { data: transactions } = await supabaseClient
            .from('transactions')
            .select('type, amount')
            .eq('user_id', currentUser.id);

        let totalCredit = 0;
        let totalPayment = 0;
        transactions?.forEach(t => {
            const amount = parseFloat(t.amount) || 0;
            if (t.type === 'CREDIT') totalCredit += amount;
            else if (t.type === 'PAYMENT') totalPayment += amount;
        });

        const netOutstanding = totalCredit - totalPayment;
        
        let customersWithCredit = 0;
        let settledCustomers = 0;
        let totalOutstanding = 0;
        
        customers?.forEach(c => {
            const balance = parseFloat(c.total_balance) || 0;
            if (balance > 0) {
                customersWithCredit++;
                totalOutstanding += balance;
            } else if (balance === 0) {
                settledCustomers++;
            }
        });

        // Update stats
        document.getElementById('totalCustomers').textContent = customers?.length || 0;
        document.getElementById('totalCredit').textContent = `₹${totalCredit.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
        document.getElementById('totalPayment').textContent = `₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
        document.getElementById('netOutstanding').textContent = `₹${netOutstanding.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;

        // Summary table
        document.getElementById('summaryTable').innerHTML = `
            <table class="customers-table">
                <thead>
                    <tr><th>Metric</th><th>Value</th></tr>
                </thead>
                <tbody>
                    <tr><td>Total Customers</td><td><strong>${customers?.length || 0}</strong></td></tr>
                    <tr><td>Customers with Credit</td><td><strong>${customersWithCredit}</strong></td></tr>
                    <tr><td>Fully Settled Customers</td><td><strong>${settledCustomers}</strong></td></tr>
                    <tr><td>Total Credit Given</td><td style="color: var(--secondary); font-weight: 600;">₹${totalCredit.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td></tr>
                    <tr><td>Total Payments Received</td><td style="color: var(--danger); font-weight: 600;">₹${totalPayment.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td></tr>
                    <tr><td>Total Outstanding</td><td style="color: var(--warning); font-weight: 600;">₹${totalOutstanding.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td></tr>
                    <tr><td>Net Outstanding</td><td style="color: var(--primary); font-weight: 600;">₹${netOutstanding.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td></tr>
                </tbody>
            </table>
        `;

        // Top customers
        const { data: topCustomers } = await supabaseClient
            .from('customers')
            .select('customer_name, phone_number, total_balance')
            .eq('user_id', currentUser.id)
            .eq('is_active', true)
            .gt('total_balance', 0)
            .order('total_balance', { ascending: false })
            .limit(10);

        if (topCustomers?.length > 0) {
            document.getElementById('topCustomers').innerHTML = `
                <table class="customers-table">
                    <thead>
                        <tr><th>Customer</th><th>Phone</th><th>Outstanding Balance</th></tr>
                    </thead>
                    <tbody>
                        ${topCustomers.map(c => `
                            <tr>
                                <td><strong>${c.customer_name}</strong></td>
                                <td>${c.phone_number || 'N/A'}</td>
                                <td style="color: var(--secondary); font-weight: 600;">₹${parseFloat(c.total_balance).toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            document.getElementById('topCustomers').innerHTML = '<div class="empty-state"><p>No outstanding balances</p></div>';
        }
    } catch (error) {
        console.error('Error loading summary:', error);
    }
}

// Logout
async function logout() {
    if (confirm('Are you sure you want to logout from this browser?')) {
        await supabaseClient.auth.signOut({ scope: 'local' });
        window.location.href = 'index.html';
    }
}


// Toggle sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Initialize
checkAuth();
