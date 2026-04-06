import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Search, Bell, ChevronDown, Home, Users, Monitor, Wifi, 
  HeadphonesIcon, Mail, FileText, CreditCard, Box, Settings, LogOut, 
  Plus, CheckCircle, XCircle, Download, UserPlus, 
  BarChart2, Zap, Shield, UserCheck, Book, TrendingDown,
  IndianRupee, Activity, PieChart, Moon, Sun, MessageSquare, Printer, Database,
  Receipt, ShieldCheck, Filter, UserMinus, TrendingUp, Network, Eye, Edit, Trash2, Layers, MapPin, Upload
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCawCrvlLTfSa5Sh7gkQo_N5a9AfCS-WM0",
  authDomain: "prapticonnect-8270c.firebaseapp.com",
  projectId: "prapticonnect-8270c",
  storageBucket: "prapticonnect-8270c.firebasestorage.app",
  messagingSenderId: "1033438775304",
  appId: "1:1033438775304:web:ee48649b551e3c624829bd",
  measurementId: "G-Q8M7JMS947"
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('public_home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Firestore Data State
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [msos, setMsos] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payCategories, setPayCategories] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
        else await signInAnonymously(auth);
      } catch (error) { console.error("Auth error:", error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const collections = [
      ['customers', setCustomers], ['invoices', setInvoices], ['complaints', setComplaints],
      ['ledger', setLedger], ['inventory', setInventory], ['expenses', setExpenses],
      ['staff', setStaff], ['msos', setMsos], ['packages', setPackages],
      ['payments', setPayments], ['paymentCategories', setPayCategories]
    ];
    const unsubs = collections.map(([collName, setter]) => 
      onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', collName), (snap) => setter(snap.docs.map(d => ({ _id: d.id, ...d.data() }))), console.error)
    );
    return () => unsubs.forEach(u => u());
  }, [user]);

  const handleLogin = (e) => { e.preventDefault(); setIsAuthenticated(true); setCurrentView('admin_dashboard'); };
  const handleLogout = () => { setIsAuthenticated(false); setCurrentView('public_home'); };

  const seedDatabase = async () => {
    if (!user) return;
    alert("Seeding sample data. Please wait...");
    const MOCK_CUSTOMERS = [
      { id: '1096747112', name: 'SHIKHA PRAMANIK', phone: '8420389373', address: 'Talpukur', status: 'Active', plan: 'Cable TV', joined: '2020-09-17', stb: '02711897780', vcNumber: '02711897780', oldDues: -334, collector: 'Suraj' },
      { id: '1075515251', name: 'ROTIKANTA SARDAR', phone: '6291720818', address: 'D. Baruli', status: 'Inactive', plan: 'Cable TV', joined: '2020-09-05', stb: '02711889743', vcNumber: '02711889743', oldDues: -3050, collector: 'Suraj' },
      { id: '1073512961', name: 'KASHINATH BANERJEE', phone: '9874865043', address: 'Bargachhiya', status: 'Active', plan: 'Combo (Cable + Net)', joined: '2020-09-10', stb: '55142178', vcNumber: '55142178', oldDues: 1790, collector: 'Babai' }
    ];
    const MOCK_INVOICES = [
      { id: '25-26/Feb/0001', customer: 'SHIKHA PRAMANIK', phone: '8420389373', date: '24.01.2026', period: 'Feb 26 & Mar 26', description: 'CABLE SUBSCRIPTION FEES', amount: 500.00, status: 'Paid', gstEnabled: false },
      { id: '26-27/Apr/0004', customer: 'KASHINATH BANERJEE', phone: '9874865043', date: '01.04.2026', period: 'Apr 26', description: 'BROADBAND SUBSCRIPTION FEES', amount: 320, status: 'Paid', gstEnabled: false }
    ];
    const MOCK_PAYMENTS = [
      { receiptNo: '1414', date: '2025-04-08 11:44:39 AM', customerId: '1096747112', customerName: 'SHIKHA PRAMANIK', address: 'Talpukur', boxType: 'SD', amount: 230, mode: 'Cash', collectedBy: 'Paltu', category: 'Monthly Subscription', isDeleted: false },
      { receiptNo: '9928', date: '2026-04-02 10:15:00 AM', customerId: '1073512961', customerName: 'KASHINATH BANERJEE', address: 'Bargachhiya', boxType: 'HD', amount: 500, mode: 'UPI', collectedBy: 'Admin User', category: 'INSTALLATION', isDeleted: false }
    ];
    const MOCK_STAFF = [
      { name: 'Admin User', role: 'Master Admin', phone: '9999999999', status: 'Active' },
      { name: 'Ravi Kumar', role: 'Collector', phone: '8888888888', status: 'Active' }
    ];

    try {
      for (const c of MOCK_CUSTOMERS) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'customers'), c);
      for (const i of MOCK_INVOICES) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'invoices'), i);
      for (const p of MOCK_PAYMENTS) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), p);
      for (const st of MOCK_STAFF) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), st);
      alert("Sample data loaded successfully!");
    } catch(e) { console.error(e); alert("Error loading data."); }
  };

  return (
    <div className={`min-h-screen font-sans text-gray-800 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50/50'}`}>
      {!isAuthenticated ? (
        currentView === 'login' ? <LoginView onLogin={handleLogin} onBack={() => setCurrentView('public_home')} /> : <PublicWebsite onLoginClick={() => setCurrentView('login')} />
      ) : (
        <AdminLayout 
          currentView={currentView} setCurrentView={setCurrentView} 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
          onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          data={{customers, invoices, complaints, payments, payCategories, ledger, inventory, expenses, staff, msos, packages, user, db, appId}} seedDatabase={seedDatabase}
        />
      )}
    </div>
  );
}

// ==========================================
// PUBLIC WEBSITE & LOGIN
// ==========================================
function PublicWebsite({ onLoginClick }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2"><Monitor className="w-8 h-8 text-white" /><span className="text-2xl font-bold tracking-tight">Prapti Connect</span></div>
          <button onClick={onLoginClick} className="bg-white text-blue-600 px-5 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2"><Users className="w-4 h-4" /> Portal Login</button>
        </div>
      </header>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4 flex-1 flex items-center">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Lightning Fast Internet & Premium Cable TV</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">Experience uninterrupted entertainment and ultra-fast broadband connectivity.</p>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 py-6 px-4 mt-auto"><div className="container mx-auto text-center text-sm">© 2026 Prapti Media Services. All rights reserved.</div></footer>
    </div>
  );
}

function LoginView({ onLogin, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"><ChevronDown className="w-5 h-5 rotate-90" /> Back to Home</button>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex border border-gray-100">
        <div className="w-1/2 bg-blue-600 text-white p-12 flex-col justify-center hidden md:flex"><Monitor className="w-16 h-16 mb-6" /><h2 className="text-4xl font-bold mb-4">Central ERP System</h2></div>
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-2">Welcome Back</h3>
          <p className="text-gray-500 mb-8">Please enter your credentials.</p>
          <form onSubmit={onLogin} className="space-y-5">
            <div><label className="block text-sm font-medium mb-1">Username</label><input type="text" defaultValue="admin" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-gray-50" required /></div>
            <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" defaultValue="password" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-gray-50" required /></div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md mt-4">Secure Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN LAYOUT
// ==========================================
function AdminLayout({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen, onLogout, isDarkMode, toggleDarkMode, data, seedDatabase }) {
  const menuItems = [
    { icon: Home, label: "Dashboard", id: "admin_dashboard" }, { divider: true },
    { icon: Network, label: "Manage MSO / ISP", id: "admin_mso" },
    { icon: Layers, label: "Packages / Plans", id: "admin_packages" },
    { icon: Users, label: "Customers", id: "admin_customers" }, { divider: true },
    { icon: FileText, label: "Billing & Invoices", id: "admin_billing" },
    { icon: IndianRupee, label: "Payments / Collection", id: "admin_payments" },
    { divider: true },
    { icon: HeadphonesIcon, label: "Complaints", id: "admin_complaints" },
    { icon: Box, label: "Inventory / Stock", id: "admin_inventory" },
    { icon: TrendingDown, label: "Daily Expenses", id: "admin_expenses" },
    { icon: BarChart2, label: "Reports", id: "admin_reports" }, { divider: true },
    { icon: UserCheck, label: "Users / Staff", id: "admin_users" },
    { icon: Settings, label: "Settings", id: "admin_settings" }
  ];

  return (
    <div className={`flex h-screen overflow-hidden print:h-auto print:overflow-visible ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`print:hidden fixed md:relative z-50 h-full transition-all duration-300 flex flex-col shrink-0 overflow-y-auto bg-[#1e293b] text-gray-300 border-r border-gray-800 shadow-xl ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-20'}`}>
        <div className="h-16 bg-[#0f172a] flex items-center justify-center px-4 shrink-0 shadow-md">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 text-white w-full"><div className="bg-blue-600 p-1.5 rounded-lg"><Monitor className="w-5 h-5" /></div><span className="font-bold text-lg truncate">Prapti ERP</span></div>
          ) : (<div className="bg-blue-600 p-1.5 rounded-lg"><Monitor className="w-5 h-5 text-white" /></div>)}
        </div>
        <div className="py-4 flex-1 space-y-1 px-3">
          {menuItems.map((item, idx) => item.divider ? (
             <div key={idx} className="my-2 border-t border-slate-700/50"></div>
          ) : (
             <button key={item.id} onClick={() => { setCurrentView(item.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center px-0'} py-2.5 rounded-lg transition-all group relative ${currentView === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`} title={!isSidebarOpen ? item.label : ''}>
               <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
               {isSidebarOpen && <span className="font-medium text-[13px] tracking-wide whitespace-nowrap">{item.label}</span>}
               {!isSidebarOpen && currentView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-md"></div>}
             </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative print:overflow-visible print:block print:h-auto">
        <header className={`print:hidden h-16 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-4 shrink-0 z-10 shadow-sm`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Menu className="w-5 h-5" /></button>
            <div className="relative hidden md:block w-96 max-w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search Database..." className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all dark:bg-gray-900 dark:border-gray-700`} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('admin_payments')} className="hidden lg:flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-200 transition-colors"><IndianRupee className="w-4 h-4"/> Collect Payment</button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}</button>
            <button onClick={onLogout} className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative print:overflow-visible print:p-0 print:h-auto">
          {currentView === 'admin_dashboard' && <DashboardView data={data} seedDatabase={seedDatabase} />}
          {currentView === 'admin_mso' && <MsoView data={data} />}
          {currentView === 'admin_packages' && <PackagesView data={data} />}
          {currentView === 'admin_customers' && <CustomersView data={data} />}
          {currentView === 'admin_billing' && <BillingView data={data} />}
          {currentView === 'admin_payments' && <PaymentView data={data} />}
          {currentView === 'admin_ledger' && <LedgerView data={data} />}
          {currentView === 'admin_inventory' && <InventoryView data={data} />}
          {currentView === 'admin_expenses' && <ExpensesView data={data} />}
          {currentView === 'admin_reports' && <ReportsView data={data} setCurrentView={setCurrentView} />}
          {currentView === 'admin_complaints' && <ComplaintsView data={data} />}
          {currentView === 'admin_users' && <UsersView data={data} />}
          {currentView === 'admin_settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: DASHBOARD 
// ==========================================
function DashboardView({ data, seedDatabase }) {
  const { customers, invoices, ledger, expenses, payments } = data;
  const dbEmpty = customers.length === 0;

  const totalActiveList = customers.filter(c => c.status === 'Active');
  
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const unpaidInvoices = invoices.filter(i => i.status !== 'Paid');
  
  const collectedAmount = payments.filter(p=>!p.isDeleted).reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const pendingAmount = unpaidInvoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const totalIncome = ledger.filter(l => l.credit > 0).reduce((sum, l) => sum + Number(l.credit || 0), 0) + collectedAmount; 
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-2">
        <div><h1 className="text-2xl font-bold dark:text-white">Business Overview</h1><p className="text-sm text-gray-500">Live analytics derived from Cloud</p></div>
        {dbEmpty && (
          <button onClick={seedDatabase} className="bg-orange-500 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 animate-bounce"><Database className="w-4 h-4"/> Load Sample Data</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm">
           <p className="text-sm font-semibold text-gray-500 mb-1">Total Active Customers</p>
           <h3 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">{totalActiveList.length}</h3>
        </div>
        <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl border border-green-100 dark:border-gray-700 shadow-sm">
           <p className="text-sm font-semibold text-gray-500 mb-1">Total Income Recorded</p>
           <h3 className="text-3xl font-extrabold text-green-700 dark:text-green-400">₹ {totalIncome.toFixed(2)}</h3>
        </div>
        <div className="bg-orange-50 dark:bg-gray-800 p-6 rounded-xl border border-orange-100 dark:border-gray-700 shadow-sm">
           <p className="text-sm font-semibold text-gray-500 mb-1">Pending Market Dues</p>
           <h3 className="text-3xl font-extrabold text-orange-700 dark:text-orange-400">₹ {pendingAmount.toFixed(2)}</h3>
        </div>
        <div className="bg-red-50 dark:bg-gray-800 p-6 rounded-xl border border-red-100 dark:border-gray-700 shadow-sm">
           <p className="text-sm font-semibold text-gray-500 mb-1">Total Expenses</p>
           <h3 className="text-3xl font-extrabold text-red-700 dark:text-red-400">₹ {totalExpenses.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: CUSTOMERS 
// ==========================================
function CustomersView({ data }) {
  const { customers, msos, packages, payments, invoices, db, appId, user } = data;
  const [activeTab, setActiveTab] = useState('Customer List');
  const [connTab, setConnTab] = useState('Cable'); 
  const [searchId, setSearchId] = useState('');
  const [searchAny, setSearchAny] = useState('');
  const [listFilter, setListFilter] = useState('All');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadStatus, setBulkUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', customerId: '', phone: '', address: '', oldDues: '',
    hasCable: true, boxType: 'SD', isFree: false, msoName: '', packageName: '', activationDate: new Date().toISOString().split('T')[0], stbNumber: '', vcNumber: '',
    hasInternet: false, netMsoName: '', netPackageName: '', netActivationDate: new Date().toISOString().split('T')[0], routerMac: '', ipAddress: ''
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.hasCable && !formData.hasInternet) return alert("Please enable at least one connection type.");

    let planStr = formData.hasCable && formData.hasInternet ? `Combo (Cable + Broadband)` : formData.hasCable ? `Cable TV (${formData.boxType})` : `Broadband`;
    let mainStb = formData.stbNumber || formData.vcNumber || formData.routerMac || '';

    try {
      const newCustId = formData.customerId || `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'customers'), {
        id: newCustId, name: formData.fullName, phone: formData.phone || 'N/A', address: formData.address || 'N/A', plan: planStr, status: 'Active', stb: mainStb, joined: formData.hasCable ? formData.activationDate : formData.netActivationDate, oldDues: Number(formData.oldDues) || 0, rawDetails: formData
      });
      if (Number(formData.oldDues) > 0) {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'ledger'), { date: new Date().toISOString().split('T')[0], desc: `Opening Balance - ${formData.fullName}`, debit: Number(formData.oldDues), credit: 0, balance: Number(formData.oldDues) });
      }
      setActiveTab('Customer List');
    } catch (e) { console.error(e); alert("Error saving customer"); }
  };

  const processBulkCustomerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true); setBulkUploadStatus("Reading file...");
    const reader = new FileReader();
    reader.onload = async (event) => {
       try {
          const text = event.target.result;
          const rows = text.split('\n').filter(r => r.trim() !== '');
          if(rows.length < 2) throw new Error("CSV must contain headers and at least one data row.");
          const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
          
          const nameIdx = headers.indexOf('fullname'); const phoneIdx = headers.indexOf('phone'); const duesIdx = headers.indexOf('olddues');
          if(nameIdx === -1 || phoneIdx === -1) throw new Error("CSV must contain 'FullName' and 'Phone' columns.");
          
          setBulkUploadStatus(`Processing ${rows.length - 1} records...`);
          let successCount = 0; let failCount = 0;
          
          for (let i = 1; i < rows.length; i++) {
             const cells = rows[i].split(',').map(c => c.trim().replace(/^"|"$/g, '')); 
             if (!cells[nameIdx]) { failCount++; continue; }

             const newCustId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
             await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'customers'), {
               id: newCustId, name: cells[nameIdx], phone: cells[phoneIdx], address: headers.indexOf('address') !== -1 ? cells[headers.indexOf('address')] : 'N/A',
               plan: 'Cable TV', status: 'Active', stb: '', joined: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
               oldDues: duesIdx !== -1 ? Number(cells[duesIdx]) || 0 : 0
             });
             successCount++;
          }
          setBulkUploadStatus(`Done! ${successCount} imported, ${failCount} skipped.`);
       } catch(err) { console.error(err); setBulkUploadStatus(`Error: ${err.message}`); } finally { setIsUploading(false); }
    };
    reader.readAsText(file); e.target.value = ''; 
  };

  const listFilteredCustomers = customers.filter(c => {
     if (listFilter === 'Active' && c.status !== 'Active') return false;
     if (searchId && !c.id.toLowerCase().includes(searchId.toLowerCase())) return false;
     if (searchAny && !(c.name.toLowerCase().includes(searchAny.toLowerCase()) || (c.phone && c.phone.includes(searchAny)) || (c.address && c.address.toLowerCase().includes(searchAny.toLowerCase())) || (c.stb && c.stb.includes(searchAny)) || (c.rawDetails?.vcNumber && c.rawDetails.vcNumber.includes(searchAny)))) return false;
     return true;
  });

  const handleSelectAllCustomers = (e) => e.target.checked ? setSelectedCustomers(listFilteredCustomers.map(c => c.id)) : setSelectedCustomers([]);
  const toggleCustomerSelect = (id) => setSelectedCustomers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkStatus = async (newStatus) => {
    if (!user || selectedCustomers.length === 0) return;
    if (!window.confirm(`Change status of ${selectedCustomers.length} customers to ${newStatus}?`)) return;
    try {
       for (const custId of selectedCustomers) {
          const custRef = customers.find(c => c.id === custId);
          if(custRef && custRef._id) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'customers', custRef._id), { status: newStatus }, { merge: true });
       }
       setSelectedCustomers([]); alert(`Updated to ${newStatus}.`);
    } catch (err) { console.error(err); alert("Error updating status."); }
  };

  const handleExportExcel = () => {
    const headers = ['Customer ID', 'VC No', 'STB No', 'Customer Name', 'Area', 'Mobile No', 'Activation Date', 'Opening Balance', 'Monthly Rent', 'Outstanding', 'Collector', 'Status'];
    const rows = listFilteredCustomers.map(c => {
       const activePayments = (payments || []).filter(p => !p.isDeleted && p.customerId === c.id);
       const totalPaid = activePayments.reduce((sum, p) => sum + Number(p.amount), 0);
       const totalBilled = (invoices || []).filter(i => i.customer === c.name).reduce((sum, i) => sum + Number(i.amount), 0);
       const out = Number(c.oldDues || 0) + totalBilled - totalPaid;
       const rentAmt = c.plan?.includes('Broadband') ? 500 : 225;
       const actDate = c.joined || c.rawDetails?.activationDate || c.rawDetails?.netActivationDate || '-';
       return [c.id, c.vcNumber || c.rawDetails?.vcNumber || '-', c.stb || c.stbNumber || c.rawDetails?.stbNumber || '-', c.name, c.address, c.phone, actDate, Number(c.oldDues || 0).toFixed(2), rentAmt.toFixed(2), out.toFixed(2), c.collector || 'Admin', c.status].map(v => `"${v}"`).join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', `Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-[1400px] mx-auto flex flex-col h-[calc(100vh-8rem)] relative print:block print:h-auto print:overflow-visible">
      {showBulkUploadModal && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in print:hidden">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
               <div className="flex justify-between mb-6"><h3 className="text-xl font-extrabold dark:text-white flex items-center gap-2"><Users className="text-sky-500 w-6 h-6"/> Bulk Customer Import</h3><button onClick={() => setShowBulkUploadModal(false)}><X/></button></div>
               <div className="space-y-6">
                  <p className="text-sm">Upload a `.csv` file to instantly create multiple customer profiles.</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-700/30">
                     <input type="file" accept=".csv" onChange={processBulkCustomerUpload} disabled={isUploading} className="hidden" id="csvCustomerUpload" />
                     <label htmlFor="csvCustomerUpload" className="cursor-pointer inline-flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-lg font-bold shadow-md"><Upload className="w-5 h-5"/>{isUploading ? "Uploading..." : "Select CSV File"}</label>
                  </div>
                  {bulkUploadStatus && <div className="p-3 rounded-lg text-sm font-bold text-center border bg-emerald-50 text-emerald-700">{bulkUploadStatus}</div>}
               </div>
            </div>
         </div>
      )}

      <div className="px-5 pt-5 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white print:hidden">Customer Database</h2>
        <div className="flex gap-6 overflow-x-auto mt-2 print:hidden">
           {['Customer List', 'Add Customer'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold border-b-2 ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>{tab}</button>
           ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 bg-gray-50/30 dark:bg-gray-900/20 relative print:block print:overflow-visible">
        {activeTab === 'Customer List' && (
          <div className="flex flex-col h-full bg-white dark:bg-gray-800 print:bg-white print:text-black">
             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 justify-between print:hidden">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveTab('Add Customer')} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm flex items-center gap-1"><Plus className="w-4 h-4"/> Customer</button>
                  <button onClick={() => setShowBulkUploadModal(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm flex items-center gap-1"><Download className="w-4 h-4"/> Upload</button>
                  <button onClick={() => handleBulkStatus('Inactive')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm flex items-center gap-1"><XCircle className="w-4 h-4"/> Deactivate</button>
                  <button onClick={() => handleBulkStatus('Active')} className="bg-[#8ec21f] hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Activate</button>
                </div>
             </div>

             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center print:hidden">
                <div className="flex gap-2 items-center">
                   <button onClick={() => setListFilter(prev => prev === 'Active' ? 'All' : 'Active')} className={`border px-3 py-1 rounded text-xs font-bold transition-colors ${listFilter === 'Active' ? 'bg-[#8ec21f] text-white border-[#8ec21f]' : 'border-[#8ec21f] text-[#8ec21f] hover:bg-green-50'}`}>
                      {listFilter === 'Active' ? 'Showing Active Only' : 'Show Active Only'}
                   </button>
                   <button onClick={handleExportExcel} className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Excel</button>
                   <button onClick={() => window.print()} className="bg-[#8ec21f] hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Print</button>
                </div>
                <div className="flex gap-2">
                   <input type="text" placeholder="Customer ID" value={searchId} onChange={e=>setSearchId(e.target.value)} className="border rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white" />
                   <input type="text" placeholder="Search Anything" value={searchAny} onChange={e=>setSearchAny(e.target.value)} className="border rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white" />
                </div>
             </div>

             <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left whitespace-nowrap print:text-black">
                   <thead className="text-[11px] text-white bg-blue-600 uppercase print:bg-gray-200 print:text-black">
                      <tr>
                         <th className="px-3 py-3 print:hidden"><input type="checkbox" onChange={handleSelectAllCustomers} checked={listFilteredCustomers.length > 0 && selectedCustomers.length === listFilteredCustomers.length}/></th>
                         <th className="px-3 py-3">CUSTOMER ID</th>
                         <th className="px-3 py-3">VC NO</th>
                         <th className="px-3 py-3">STB NO</th>
                         <th className="px-3 py-3">CUSTOMER NAME</th>
                         <th className="px-3 py-3">MOBILE NO</th>
                         <th className="px-3 py-3 text-center">ACTIVATION DATE</th>
                         <th className="px-3 py-3 text-right">OPENING BAL</th>
                         <th className="px-3 py-3 text-right">MONTHLY BILL</th>
                         <th className="px-3 py-3 text-right">COLLECTION</th>
                         <th className="px-3 py-3 text-right">OUTSTANDING</th>
                         <th className="px-3 py-3 text-center print:hidden">ACTION</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {listFilteredCustomers.map((cust) => {
                         const rentAmt = cust.plan?.includes('Broadband') ? 500 : 225;
                         const activePayments = (payments || []).filter(p => !p.isDeleted && p.customerId === cust.id);
                         const monthlyPaymentAmt = activePayments.filter(p => p.date.includes(new Date().toLocaleString('en-IN', { month: 'short' })) && p.date.includes(new Date().getFullYear().toString())).reduce((sum, p) => sum + Number(p.amount), 0);
                         const totalPaid = activePayments.reduce((sum, p) => sum + Number(p.amount), 0);
                         const totalBilled = (invoices || []).filter(i => i.customer === cust.name).reduce((sum, i) => sum + Number(i.amount), 0);
                         const outstandingAmt = Number(cust.oldDues || 0) + totalBilled - totalPaid;

                         return (
                         <tr key={cust.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 print:border-b print:border-gray-300">
                            <td className="px-3 py-3 print:hidden"><input type="checkbox" checked={selectedCustomers.includes(cust.id)} onChange={() => toggleCustomerSelect(cust.id)}/></td>
                            <td className="px-3 py-3 font-mono">
                               <div className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full print:hidden ${cust.status === 'Active' ? 'bg-[#8ec21f]' : 'bg-red-500'}`}></span>{cust.id}</div>
                            </td>
                            <td className="px-3 py-3 font-mono">{cust.vcNumber || cust.rawDetails?.vcNumber || '-'}</td>
                            <td className="px-3 py-3 font-mono">{cust.stb || cust.stbNumber || cust.rawDetails?.stbNumber || '-'}</td>
                            <td className="px-3 py-3 font-bold">{cust.name}</td>
                            <td className="px-3 py-3">{cust.phone}</td>
                            <td className="px-3 py-3 text-center">{cust.joined || cust.rawDetails?.activationDate || '-'}</td>
                            <td className="px-3 py-3 text-right">₹ {Number(cust.oldDues || 0).toFixed(2)}</td>
                            <td className="px-3 py-3 text-right font-bold text-blue-600">₹ {rentAmt.toFixed(2)}</td>
                            <td className="px-3 py-3 text-right font-bold text-green-600">₹ {monthlyPaymentAmt.toFixed(2)}</td>
                            <td className="px-3 py-3 text-right font-bold text-red-600">₹ {outstandingAmt.toFixed(2)}</td>
                            <td className="px-3 py-3 text-center print:hidden">
                               <button className="bg-amber-500 text-white px-2 py-1 rounded text-xs mr-1">Edit</button>
                               <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                            </td>
                         </tr>
                      )})}
                      {listFilteredCustomers.length === 0 && (<tr><td colSpan="12" className="text-center py-8 text-gray-500">No customers found.</td></tr>)}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* TAB 2: ADD CUSTOMER */}
        {activeTab === 'Add Customer' && (
          <div className="p-6">
            <div className="bg-blue-600 text-white px-6 py-3 shadow-md rounded-t-xl"><h2 className="font-bold text-lg">Add New Customer</h2></div>
            <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-6 rounded-b-xl shadow-sm border border-t-0 border-gray-200 dark:border-gray-700 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1">Full Name</label><input required type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  <div><label className="block text-sm font-bold mb-1">Mobile Number</label><input required type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  <div><label className="block text-sm font-bold mb-1">Full Address</label><input type="text" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  <div><label className="block text-sm font-bold mb-1">Old Dues (₹)</label><input type="number" value={formData.oldDues} onChange={e=>setFormData({...formData, oldDues: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
               </div>

               <div className="flex gap-4 border-b pb-4">
                  <button type="button" onClick={()=>setConnTab('Cable')} className={`px-4 py-2 font-bold rounded ${connTab==='Cable'?'bg-blue-100 text-blue-700':'bg-gray-100'}`}>Cable TV</button>
                  <button type="button" onClick={()=>setConnTab('Internet')} className={`px-4 py-2 font-bold rounded ${connTab==='Internet'?'bg-orange-100 text-orange-700':'bg-gray-100'}`}>Broadband</button>
               </div>

               {connTab === 'Cable' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <label className="col-span-2 flex items-center gap-2"><input type="checkbox" checked={formData.hasCable} onChange={e=>setFormData({...formData, hasCable:e.target.checked})}/> Enable Cable TV</label>
                     {formData.hasCable && (
                        <>
                           <div>
                              <label className="block text-sm font-bold mb-1">MSO Name <span className="text-red-500">*</span></label>
                              <select required value={formData.msoName} onChange={e=>setFormData({...formData, msoName: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                                 <option value="">Select MSO</option>{msos.map(m=><option key={m._id} value={m.name}>{m.name}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="block text-sm font-bold mb-1">Package <span className="text-red-500">*</span></label>
                              <select required value={formData.packageName} onChange={e=>setFormData({...formData, packageName: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                                 <option value="">Select Package</option>{packages.filter(p=>p.type==='Cable').map(p=><option key={p._id} value={p.name}>{p.name}</option>)}
                              </select>
                           </div>
                           <div><label className="block text-sm font-bold mb-1">VC Number <span className="text-red-500">*</span></label><input required type="text" value={formData.vcNumber} onChange={e=>setFormData({...formData, vcNumber: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                           <div><label className="block text-sm font-bold mb-1">STB Number <span className="text-red-500">*</span></label><input required type="text" value={formData.stbNumber} onChange={e=>setFormData({...formData, stbNumber: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                           <div><label className="block text-sm font-bold mb-1">Activation Date <span className="text-red-500">*</span></label><input required type="date" value={formData.activationDate} onChange={e=>setFormData({...formData, activationDate: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                        </>
                     )}
                  </div>
               )}

               {connTab === 'Internet' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <label className="col-span-2 flex items-center gap-2"><input type="checkbox" checked={formData.hasInternet} onChange={e=>setFormData({...formData, hasInternet:e.target.checked})}/> Enable Broadband</label>
                     {formData.hasInternet && (
                        <>
                           <div>
                              <label className="block text-sm font-bold mb-1">ISP Name <span className="text-red-500">*</span></label>
                              <select required value={formData.netMsoName} onChange={e=>setFormData({...formData, netMsoName: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                                 <option value="">Select ISP</option>{msos.map(m=><option key={m._id} value={m.name}>{m.name}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="block text-sm font-bold mb-1">Package <span className="text-red-500">*</span></label>
                              <select required value={formData.netPackageName} onChange={e=>setFormData({...formData, netPackageName: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                                 <option value="">Select Package</option>{packages.filter(p=>p.type==='Internet').map(p=><option key={p._id} value={p.name}>{p.name}</option>)}
                              </select>
                           </div>
                           <div><label className="block text-sm font-bold mb-1">Router MAC <span className="text-red-500">*</span></label><input required type="text" value={formData.routerMac} onChange={e=>setFormData({...formData, routerMac: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                           <div><label className="block text-sm font-bold mb-1">Activation Date <span className="text-red-500">*</span></label><input required type="date" value={formData.netActivationDate} onChange={e=>setFormData({...formData, netActivationDate: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                        </>
                     )}
                  </div>
               )}

               <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700">Save Customer</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// VIEW: BILLING & INVOICES
// ==========================================
function BillingView({ data }) {
  const { invoices, customers, db, appId, user } = data;
  const [activeTab, setActiveTab] = useState('Bill History');
  const [genData, setGenData] = useState({ customerId: '', period: 'May 26', description: 'SUBSCRIPTION FEES', amount: '' });

  const handleGenerateSingleBill = async (e) => {
    e.preventDefault();
    if (!user || !genData.customerId) return;
    const cust = customers.find(c => c.id === genData.customerId);
    if (!cust) return;

    if (genData.description.toUpperCase().includes('SUBSCRIPTION')) {
       const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
       const hasRecentSub = invoices.some(inv => {
         if (inv.customer !== cust.name || !inv.description.toUpperCase().includes('SUBSCRIPTION')) return false;
         const parts = String(inv.date).split('.');
         if (parts.length === 3) return new Date(`${parts[2].length===2?`20${parts[2]}`:parts[2]}-${parts[1]}-${parts[0]}`) >= thirtyDaysAgo;
         return false;
       });
       if (hasRecentSub) return alert("Warning: This customer already has a Subscription bill generated within the last 30 days.");
    }

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'invoices'), {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`, customer: cust.name, date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'), period: genData.period, description: genData.description, amount: Number(genData.amount), status: 'Unpaid'
      });
      alert("Invoice generated successfully!");
      setGenData({ customerId: '', period: 'May 26', description: 'SUBSCRIPTION FEES', amount: '' });
      setActiveTab('Bill History');
    } catch(err) { console.error(err); alert("Failed to generate bill."); }
  };

  const handleBulkGenerate = async () => {
    if (!user) return;
    if (!window.confirm("Generate subscription bills for all active customers?")) return;
    const activeCusts = customers.filter(c => c.status === 'Active');
    let count = 0; let skipped = 0;
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const cust of activeCusts) {
      const hasRecentSub = invoices.some(inv => {
        if (inv.customer !== cust.name || !inv.description.toUpperCase().includes('SUBSCRIPTION')) return false;
        const parts = String(inv.date).split('.');
        if (parts.length === 3) return new Date(`${parts[2].length===2?`20${parts[2]}`:parts[2]}-${parts[1]}-${parts[0]}`) >= thirtyDaysAgo;
        return false;
      });
      if (hasRecentSub) { skipped++; continue; }

      let amount = cust.plan?.includes('Combo') ? 750 : cust.plan?.includes('Broadband') ? 500 : 225;
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'invoices'), {
        id: `INV-B-${Math.floor(1000 + Math.random() * 9000)}`, customer: cust.name, date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'), period: 'Current Month', description: 'SUBSCRIPTION FEES', amount: amount, status: 'Unpaid'
      });
      count++;
    }
    alert(`Generated ${count} bulk bills.\nSkipped ${skipped} customers to prevent double-billing.`);
    setActiveTab('Bill History');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
         <h2 className="text-xl font-bold dark:text-white">Billing Management</h2>
         <div className="flex gap-4 mt-4">
            <button onClick={()=>setActiveTab('Bill History')} className={`font-bold pb-2 border-b-2 ${activeTab==='Bill History'?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>Bill History</button>
            <button onClick={()=>setActiveTab('Generate Bill')} className={`font-bold pb-2 border-b-2 ${activeTab==='Generate Bill'?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>Generate Bill</button>
         </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4">
         {activeTab === 'Bill History' && (
            <table className="w-full text-sm text-left whitespace-nowrap">
               <thead className="bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                  <tr><th className="px-4 py-3">Invoice No</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3 text-center">Status</th></tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {invoices.map((inv, idx) => (
                     <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 font-mono">{inv.id}</td><td className="px-4 py-3 font-bold">{inv.customer}</td><td className="px-4 py-3">{inv.period}</td><td className="px-4 py-3 font-extrabold text-blue-600">₹ {inv.amount}</td>
                        <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs font-bold rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{inv.status}</span></td>
                     </tr>
                  ))}
                  {invoices.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-500">No invoices found.</td></tr>}
               </tbody>
            </table>
         )}

         {activeTab === 'Generate Bill' && (
            <div className="max-w-2xl space-y-6">
               <form onSubmit={handleGenerateSingleBill} className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                  <h3 className="font-bold text-lg dark:text-white">Single Bill Generation</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300">Select Customer</label>
                        <select required value={genData.customerId} onChange={e=>{
                           const c = customers.find(x=>x.id===e.target.value); 
                           let amt = '225'; if (c?.plan?.includes('Combo')) amt = '750'; else if (c?.plan?.includes('Broadband')) amt = '500';
                           setGenData({...genData, customerId: e.target.value, amount: amt});
                        }} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                           <option value="">Select Customer...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
                        </select>
                     </div>
                     <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Period</label><input required type="text" value={genData.period} onChange={e=>setGenData({...genData, period: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" /></div>
                     <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Description</label><input required type="text" value={genData.description} onChange={e=>setGenData({...genData, description: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" placeholder="e.g. SUBSCRIPTION FEES or INSTALLATION" /></div>
                     <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Amount (₹)</label><input required type="number" value={genData.amount} onChange={e=>setGenData({...genData, amount: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" /></div>
                     <div className="col-span-2 mt-4"><button type="submit" className="bg-blue-600 text-white w-full py-2 rounded font-bold shadow-sm hover:bg-blue-700">Generate Invoice</button></div>
                  </div>
               </form>

               <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div>
                     <h3 className="font-bold text-blue-900 dark:text-blue-100">Bulk Bill Generation</h3>
                     <p className="text-sm text-blue-700 dark:text-blue-300">Auto-generate for all active customers.</p>
                  </div>
                  <button onClick={handleBulkGenerate} className="bg-blue-600 text-white px-6 py-2 rounded font-bold shadow-sm hover:bg-blue-700">Run Bulk Billing</button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}

// ==========================================
// VIEW: PAYMENTS 
// ==========================================
function PaymentView({ data }) {
  const { payments, customers, db, appId, user } = data;
  const [activeTab, setActiveTab] = useState('Add Payment');
  const [searchId, setSearchId] = useState('');
  const [selectedCust, setSelectedCust] = useState(null);
  const [payData, setPayData] = useState({ amount: '', mode: 'Cash' });

  const handleSearch = (e) => {
     e.preventDefault();
     const res = customers.find(c => c.id === searchId || c.phone === searchId || (c.stb && c.stb === searchId));
     if(res) { setSelectedCust(res); setPayData({...payData, amount: res.plan?.includes('Broadband')?'500':'225'}); }
     else alert("Customer not found.");
  };

  const handlePay = async (e) => {
     e.preventDefault();
     if(!user || !selectedCust || !payData.amount) return;
     try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), {
           receiptNo: `${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toLocaleString('en-IN'),
           customerId: selectedCust.id, customerName: selectedCust.name, boxType: 'SD', amount: Number(payData.amount), mode: payData.mode, collectedBy: 'Admin User', isDeleted: false
        });
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'ledger'), {
           date: new Date().toISOString().split('T')[0], desc: `Payment (${payData.mode}) - ${selectedCust.name}`, debit: 0, credit: Number(payData.amount), balance: 0
        });
        alert("Payment recorded!"); setSelectedCust(null); setPayData({amount:'', mode:'Cash'}); setSearchId('');
     } catch(err) { console.error(err); alert("Failed to record payment."); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
         <h2 className="text-xl font-bold dark:text-white">Payment Collections</h2>
         <div className="flex gap-4 mt-4">
            <button onClick={()=>setActiveTab('Add Payment')} className={`font-bold pb-2 border-b-2 ${activeTab==='Add Payment'?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>Add Payment</button>
            <button onClick={()=>setActiveTab('Payment History')} className={`font-bold pb-2 border-b-2 ${activeTab==='Payment History'?'border-blue-600 text-blue-600':'border-transparent text-gray-500'}`}>Payment History</button>
         </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4">
         {activeTab === 'Add Payment' && (
            <div className="max-w-2xl space-y-6">
               <form onSubmit={handleSearch} className="flex gap-2">
                  <input required type="text" value={searchId} onChange={e=>setSearchId(e.target.value)} placeholder="Search by ID, Phone, or STB..." className="flex-1 border rounded px-4 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500"/>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold shadow-sm hover:bg-blue-700">Search</button>
               </form>

               {selectedCust && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4 animate-in fade-in">
                     <div className="mb-4">
                        <h3 className="font-bold text-lg dark:text-white">{selectedCust.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {selectedCust.id} | Phone: {selectedCust.phone}</p>
                     </div>
                     <form onSubmit={handlePay} className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Amount (₹)</label><input required type="number" value={payData.amount} onChange={e=>setPayData({...payData, amount: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" /></div>
                        <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Mode</label>
                           <select value={payData.mode} onChange={e=>setPayData({...payData, mode:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                              <option>Cash</option><option>UPI</option><option>Bank</option>
                           </select>
                        </div>
                        <div className="col-span-2"><button type="submit" className="bg-green-600 text-white w-full py-2 rounded font-bold shadow-sm hover:bg-green-700">Confirm Payment</button></div>
                     </form>
                  </div>
               )}
            </div>
         )}

         {activeTab === 'Payment History' && (
            <table className="w-full text-sm text-left whitespace-nowrap">
               <thead className="bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                  <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Receipt No</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Collector</th></tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {payments.filter(p=>!p.isDeleted).map((pay, idx) => (
                     <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-gray-500">{String(pay.date).split(',')[0]}</td><td className="px-4 py-3 font-mono">{pay.receiptNo}</td>
                        <td className="px-4 py-3 font-bold">{pay.customerName}</td><td className="px-4 py-3 font-extrabold text-green-600">₹ {pay.amount}</td><td className="px-4 py-3">{pay.mode}</td><td className="px-4 py-3">{pay.collectedBy}</td>
                     </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No payments found.</td></tr>}
               </tbody>
            </table>
         )}
      </div>
    </div>
  );
}

// ==========================================
// VIEW: LEDGER
// ==========================================
function LedgerView({ data }) {
  const { ledger } = data;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="text-xl font-bold dark:text-white">Account Ledgers</h2></div>
      <div className="overflow-x-auto flex-1 p-4">
        <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="text-xs bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Description</th><th className="px-6 py-3 text-right text-red-600">Debit</th><th className="px-6 py-3 text-right text-green-600">Credit</th></tr></thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
             {ledger.map((l, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                   <td className="px-6 py-4">{l.date}</td><td className="px-6 py-4">{l.desc}</td>
                   <td className="px-6 py-4 text-right text-gray-800 dark:text-white">{l.debit > 0 ? `₹ ${l.debit.toFixed(2)}` : '-'}</td>
                   <td className="px-6 py-4 text-right text-gray-800 dark:text-white">{l.credit > 0 ? `₹ ${l.credit.toFixed(2)}` : '-'}</td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// VIEWS: COMPLAINTS & INVENTORY
// ==========================================
function ComplaintsView({ data }) {
  const { complaints, customers, db, appId, user } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ customer: '', issue: '', status: 'Open' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), { id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`, customer: formData.customer, issue: formData.issue, status: formData.status, date: new Date().toLocaleDateString('en-GB') });
      setIsAdding(false); setFormData({ customer: '', issue: '', status: 'Open' });
    } catch (err) { console.error(err); alert("Error saving complaint"); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
         <h2 className="text-xl font-bold dark:text-white">Complaints</h2>
         <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
            {isAdding ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4" />} {isAdding ? 'Cancel' : 'Add Complaint'}
         </button>
      </div>

      {isAdding && (
         <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
               <div>
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Customer</label>
                  <select required value={formData.customer} onChange={e=>setFormData({...formData, customer: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500">
                     <option value="">Select Customer</option>{(customers || []).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
               </div>
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Issue Description</label>
                  <input required type="text" value={formData.issue} onChange={e=>setFormData({...formData, issue: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" placeholder="e.g. No Signal, Wire Cut"/>
               </div>
               <div><button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded text-sm font-bold shadow-sm h-[38px]">Save Complaint</button></div>
            </form>
         </div>
      )}

      <div className="overflow-x-auto flex-1 p-4">
         <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
           <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs dark:text-gray-200">
              <tr><th className="px-4 py-3">Ticket ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Issue</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
           </thead>
           <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
             {complaints.map((c, i) => (
               <tr key={c._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 dark:text-gray-300">{c.id}</td><td className="px-4 py-3 font-bold dark:text-white">{c.customer}</td><td className="px-4 py-3 dark:text-gray-300">{c.issue}</td><td className="px-4 py-3 dark:text-gray-400">{c.date}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}

function InventoryView({ data }) {
  const { inventory, db, appId, user } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ item: '', total: '', used: '0', faulty: '0' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), { item: formData.item, total: Number(formData.total), used: Number(formData.used), faulty: Number(formData.faulty) });
      setIsAdding(false); setFormData({ item: '', total: '', used: '0', faulty: '0' });
    } catch (err) { console.error(err); alert("Error saving stock"); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
         <h2 className="text-xl font-bold dark:text-white">Inventory</h2>
         <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
            {isAdding ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4" />} {isAdding ? 'Cancel' : 'Add Stock'}
         </button>
      </div>

      {isAdding && (
         <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Item Name</label>
                  <input required type="text" value={formData.item} onChange={e=>setFormData({...formData, item: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" placeholder="e.g. Set Top Box (HD)"/>
               </div>
               <div>
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Total Stock</label>
                  <input required type="number" value={formData.total} onChange={e=>setFormData({...formData, total: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500"/>
               </div>
               <div>
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Used / Faulty</label>
                  <div className="flex gap-2">
                    <input type="number" value={formData.used} onChange={e=>setFormData({...formData, used: e.target.value})} className="w-1/2 border rounded px-2 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" placeholder="Used"/>
                    <input type="number" value={formData.faulty} onChange={e=>setFormData({...formData, faulty: e.target.value})} className="w-1/2 border rounded px-2 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" placeholder="Faulty"/>
                  </div>
               </div>
               <div><button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded text-sm font-bold shadow-sm h-[38px]">Save Stock</button></div>
            </form>
         </div>
      )}

      <div className="overflow-x-auto flex-1 p-4">
        <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs dark:text-gray-200"><tr><th className="px-6 py-3">Item Name</th><th className="px-6 py-3 text-center">Total Stock</th><th className="px-6 py-3 text-center">Used</th><th className="px-6 py-3 text-center text-red-500">Faulty</th></tr></thead>
           <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{inventory.map((inv, i) => (<tr key={inv._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-6 py-4 font-bold dark:text-white">{inv.item}</td><td className="px-6 py-4 text-center font-bold dark:text-gray-300">{inv.total}</td><td className="px-6 py-4 text-center font-bold text-green-600">{inv.used}</td><td className="px-6 py-4 text-center font-bold text-red-500">{inv.faulty}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: DAILY EXPENSES
// ==========================================
function ExpensesView({ data }) {
  const { expenses, db, appId, user } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ category: 'Fuel', desc: '', amount: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), { date: new Date().toISOString().split('T')[0], addedBy: 'Admin User', amount: Number(formData.amount), category: formData.category, desc: formData.desc });
      setIsAdding(false); setFormData({ category: 'Fuel', desc: '', amount: '' });
    } catch (e) { console.error(e); alert("Error saving expense"); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daily Expenses</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage operational costs.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
          {isAdding ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4" />} {isAdding ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div>
                <label className="block text-xs font-bold mb-1 dark:text-gray-300">Category</label>
                <select required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500">
                   <option>Fuel</option><option>Office</option><option>Maintenance</option><option>Salaries</option><option>Other</option>
                </select>
             </div>
             <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1 dark:text-gray-300">Description</label>
                <input required type="text" value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" placeholder="Expense details..."/>
             </div>
             <div>
                <label className="block text-xs font-bold mb-1 dark:text-gray-300">Amount (₹)</label>
                <div className="flex gap-2">
                   <input required type="number" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" placeholder="0.00"/>
                   <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-green-700 shrink-0">Save</button>
                </div>
             </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto flex-1 p-4">
        <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="text-xs bg-gray-100 dark:bg-gray-700 uppercase dark:text-gray-200">
            <tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Added By</th><th className="px-6 py-3 text-right">Amount (₹)</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
             {expenses.map((ex, i) => (
                <tr key={ex._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                   <td className="px-6 py-4 font-medium dark:text-gray-300">{ex.date}</td>
                   <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs font-bold dark:text-gray-200">{ex.category}</span></td>
                   <td className="px-6 py-4 dark:text-gray-300">{ex.desc}</td>
                   <td className="px-6 py-4 text-gray-500 text-xs font-medium">{ex.addedBy}</td>
                   <td className="px-6 py-4 text-right font-extrabold text-red-600">₹ {Number(ex.amount).toFixed(2)}</td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: REPORTS
// ==========================================
function ReportsView({ data, setCurrentView }) {
  const { invoices, payments, expenses } = data;
  const exportExcel = (filename, headers, rows) => {
    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })); link.setAttribute('download', `${filename}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const dlCollection = () => exportExcel('Collection_Report', ['Receipt No', 'Date', 'Customer Name', 'Amount', 'Mode', 'Collected By'], payments.filter(p=>!p.isDeleted).map(p => [p.receiptNo, p.date, p.customerName, p.amount, p.mode, p.collectedBy]));
  const dlBilling = () => exportExcel('Billing_Report', ['Invoice No', 'Date', 'Customer Name', 'Period', 'Amount', 'Status'], invoices.map(i => [i.id, i.date, i.customer, i.period, i.amount, i.status]));
  const dlExpenses = () => exportExcel('Expense_Report', ['Date', 'Category', 'Description', 'Amount', 'Added By'], expenses.map(e => [e.date, e.category, e.desc, e.amount, e.addedBy]));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold dark:text-white mb-6">Business Reports</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 text-center hover:shadow-md cursor-pointer">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><IndianRupee className="w-6 h-6"/></div>
             <h3 className="font-bold dark:text-white mb-2">Collection Report</h3>
             <button onClick={dlCollection} className="text-blue-600 text-sm font-bold hover:underline mx-auto">Export Excel</button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 text-center hover:shadow-md cursor-pointer">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-6 h-6"/></div>
             <h3 className="font-bold dark:text-white mb-2">Billing & GST Report</h3>
             <button onClick={dlBilling} className="text-green-600 text-sm font-bold hover:underline mx-auto">Export Excel</button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 text-center hover:shadow-md cursor-pointer">
             <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><TrendingDown className="w-6 h-6"/></div>
             <h3 className="font-bold dark:text-white mb-2">Expense Report</h3>
             <button onClick={dlExpenses} className="text-orange-600 text-sm font-bold hover:underline mx-auto">Export Excel</button>
          </div>
          <div onClick={() => setCurrentView('admin_ledger')} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 text-center hover:shadow-md cursor-pointer md:col-span-3">
             <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><Book className="w-6 h-6"/></div>
             <h3 className="font-bold dark:text-white mb-2">Subscriber Ledger</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">View full running balance and transaction history.</p>
             <button className="text-indigo-600 text-sm font-bold flex items-center justify-center gap-1 hover:underline mx-auto">Go To Ledger</button>
          </div>
       </div>
    </div>
  );
}

// ==========================================
// VIEW: USERS / STAFF 
// ==========================================
function UsersView({ data }) {
  const { staff, db, appId, user } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Collector', phone: '', status: 'Active' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'staff'), formData);
      setIsAdding(false); setFormData({ name: '', role: 'Collector', phone: '', status: 'Active' });
    } catch (err) { console.error(err); alert("Error saving user"); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[12px] shadow-sm border dark:border-gray-700 overflow-hidden max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Staff & User Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage admins, collectors, and technicians.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          {isAdding ? <X className="w-4 h-4"/> : <UserPlus className="w-4 h-4"/>} Add Staff
        </button>
      </div>

      {isAdding && (
         <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" placeholder="Staff Name"/>
               </div>
               <div>
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Role</label>
                  <select required value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500">
                     <option>Master Admin</option><option>Collector</option><option>Technician</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold mb-1 dark:text-gray-300">Phone</label>
                  <input required type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" placeholder="Phone No"/>
               </div>
               <div><button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded text-sm font-bold shadow-sm h-[38px]">Save User</button></div>
            </form>
         </div>
      )}

      <div className="overflow-x-auto flex-1 p-4">
        <table className="w-full text-sm text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Phone</th><th className="px-6 py-3">Status</th></tr></thead>
          <tbody>{staff.map((st, i) => (<tr key={st._id||i} className="border-b dark:border-gray-700"><td className="px-6 py-4 font-bold dark:text-white">{st.name}</td><td className="px-6 py-4 dark:text-gray-300">{st.role}</td><td className="px-6 py-4 dark:text-gray-300">{st.phone}</td><td className="px-6 py-4 dark:text-gray-300">{st.status}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: SETTINGS
// ==========================================
function SettingsView() {
  const [settings, setSettings] = useState({ companyName: 'Prapti Media Services', phone: '9876543210', email: 'contact@praptimedia.com', address: 'Kolkata, West Bengal', gstin: '22AAAAA0000A1Z5' });
  const handleSave = (e) => { e.preventDefault(); alert("Settings updated!"); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold dark:text-white mb-6">System Settings</h2>
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSave} className="p-6 space-y-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">Company Name</label><input type="text" value={settings.companyName} onChange={e=>setSettings({...settings, companyName: e.target.value})} className="w-full border rounded-md px-4 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div><label className="block text-sm font-bold mb-1 dark:text-gray-300">GSTIN Number</label><input type="text" value={settings.gstin} onChange={e=>setSettings({...settings, gstin: e.target.value})} className="w-full border rounded-md px-4 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-bold mb-1 dark:text-gray-300">Address</label><textarea rows="3" value={settings.address} onChange={e=>setSettings({...settings, address: e.target.value})} className="w-full border rounded-md px-4 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"></textarea></div>
             </div>
             <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold mt-4">Save Profile</button>
          </form>
       </div>
    </div>
  );
}

// ==========================================
// VIEWS: MSO & PACKAGES 
// ==========================================
function MsoView({ data }) {
  const { msos, db, appId, user } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', phone: '' });
  const handleAdd = async (e) => { e.preventDefault(); if(!user) return; await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'msos'), formData); setIsAdding(false); setFormData({name:'', contact:'', phone:''}); };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b dark:border-gray-700 flex justify-between"><h2 className="text-xl font-bold dark:text-white">MSO / ISP List</h2><button onClick={()=>setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm">{isAdding?'Cancel':'Add MSO'}</button></div>
      {isAdding && (
         <form onSubmit={handleAdd} className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b dark:border-gray-700 flex gap-4 items-end">
            <div className="flex-1"><label className="block text-xs font-bold mb-1 dark:text-gray-300">MSO Name</label><input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"/></div>
            <div className="flex-1"><label className="block text-xs font-bold mb-1 dark:text-gray-300">Contact Person</label><input type="text" value={formData.contact} onChange={e=>setFormData({...formData, contact:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"/></div>
            <div className="flex-1"><label className="block text-xs font-bold mb-1 dark:text-gray-300">Phone</label><input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"/></div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold h-[38px]">Save</button>
         </form>
      )}
      <div className="overflow-x-auto flex-1 p-4">
        <table className="w-full text-sm text-left"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="px-4 py-3 dark:text-gray-200">Name</th><th className="px-4 py-3 dark:text-gray-200">Contact</th><th className="px-4 py-3 dark:text-gray-200">Phone</th></tr></thead>
          <tbody>{msos.map((mso, idx) => (<tr key={idx} className="border-b dark:border-gray-700"><td className="px-4 py-4 font-bold dark:text-white">{mso.name}</td><td className="px-4 py-4 dark:text-gray-300">{mso.contact}</td><td className="px-4 py-4 dark:text-gray-300">{mso.phone}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function PackagesView({ data }) {
  const { packages, db, appId, user } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Cable', price: '' });
  const handleAdd = async (e) => { e.preventDefault(); if(!user) return; await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'packages'), { ...formData, price: Number(formData.price) }); setIsAdding(false); setFormData({name:'', type:'Cable', price:''}); };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-5 border-b dark:border-gray-700 flex justify-between"><h2 className="text-xl font-bold dark:text-white">Packages & Plans</h2><button onClick={()=>setIsAdding(!isAdding)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm">{isAdding?'Cancel':'Add Package'}</button></div>
      {isAdding && (
         <form onSubmit={handleAdd} className="p-4 bg-gray-50 dark:bg-gray-700/30 border-b dark:border-gray-700 flex gap-4 items-end">
            <div className="flex-1"><label className="block text-xs font-bold mb-1 dark:text-gray-300">Package Name</label><input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"/></div>
            <div className="w-48"><label className="block text-xs font-bold mb-1 dark:text-gray-300">Type</label><select value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"><option>Cable</option><option>Internet</option></select></div>
            <div className="w-48"><label className="block text-xs font-bold mb-1 dark:text-gray-300">Price (₹)</label><input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"/></div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold h-[38px]">Save</button>
         </form>
      )}
      <div className="overflow-x-auto flex-1 p-4">
        <table className="w-full text-sm text-left border dark:border-gray-700"><thead className="bg-gray-100 dark:bg-gray-700 uppercase"><tr><th className="px-6 py-3 dark:text-gray-200">Package Name</th><th className="px-6 py-3 dark:text-gray-200">Type</th><th className="px-6 py-3 dark:text-gray-200">Price</th></tr></thead>
          <tbody>{packages.map((pkg, idx) => (<tr key={idx} className="border-b dark:border-gray-700"><td className="px-6 py-4 font-bold dark:text-white">{pkg.name}</td><td className="px-6 py-4 dark:text-gray-300">{pkg.type}</td><td className="px-6 py-4 font-extrabold text-blue-600">₹ {pkg.price}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}