
import React, { useState } from 'react';
import { Copy, Check, Terminal, Database, ShieldCheck, Zap, QrCode, Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import VCardDisplay from './components/VCardDisplay';
import { SQL_SCHEMA } from './constants/sql-schema';
import { Business, UserRole } from './types';

const MOCK_BUSINESS: Business = {
  id: '1',
  owner_id: 'owner-123',
  franchise_id: 'fran-456',
  name: 'Alex Rivera',
  slug: 'alex-rivera-tech',
  bio: 'Building the future of digital connectivity. Senior Fullstack Developer & Tech Consultant with 10+ years experience.',
  whatsapp_number: '919876543210',
  email: 'alex@riveratech.com',
  phone: '+91 98765 43210',
  address: 'Skyline Hub, Sector 5, Silicon City, 560001',
  created_at: new Date().toISOString()
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schema' | 'preview' | 'docs'>('dashboard');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-slate-500 mt-1">Manage your Digital V-Card SaaS infrastructure</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" />
              Super Admin Mode
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Businesses" value="1,284" change="+12% this month" />
                <StatCard label="Franchises" value="48" change="Across 12 States" />
                <StatCard label="Active V-Cards" value="98.2%" change="Uptime Guaranteed" />
                <StatCard label="Revenue (ARR)" value="$12.4k" change="+8.4% since last week" />
              </div>

              {/* Infrastructure Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Database size={20} className="text-blue-500" />
                    Storage Architecture
                  </h3>
                  <div className="space-y-6">
                    <StorageItem 
                      name="Logos & Brand Identity" 
                      path="storage.buckets/logos" 
                      policy="Public Read, Owner Write"
                      size="1.2 GB"
                    />
                    <StorageItem 
                      name="Profile Photos" 
                      path="storage.buckets/avatars" 
                      policy="Public Read, Owner Write"
                      size="4.5 GB"
                    />
                    <StorageItem 
                      name="QR Codes (Generated)" 
                      path="storage.buckets/qrcodes" 
                      policy="Public Read, System Write"
                      size="800 MB"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Zap size={20} className="text-amber-500" />
                    Edge Functions (Optimizations)
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-700">generate-qr-code</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Generates SVG QR codes for new businesses and uploads to Storage bucket.</p>
                      <button className="text-blue-600 text-xs font-bold hover:underline">View Source Code</button>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-700">vcard-to-contacts</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Converts business JSON data into vCard (.vcf) format for mobile downloads.</p>
                      <button className="text-blue-600 text-xs font-bold hover:underline">View Source Code</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-blue-400" />
                  <span className="text-slate-300 font-mono text-sm">vcard-saas-schema.sql</span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-slate-300 font-mono text-sm leading-relaxed">
                  {SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-500">
              <div className="lg:col-span-1">
                <VCardDisplay business={MOCK_BUSINESS} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <QrCode size={20} className="text-indigo-500" />
                    Public V-Card Endpoint
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <code className="text-sm font-mono text-indigo-600">https://vcard-saas.com/{MOCK_BUSINESS.slug}</code>
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="mt-8 flex gap-8 items-center">
                    <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vcard-saas.com/${MOCK_BUSINESS.slug}`} 
                          alt="QR Code" 
                          className="w-32 h-32"
                        />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        Every business gets a unique slug-based URL and a matching QR code generated automatically via Supabase Edge Functions.
                      </p>
                      <div className="flex gap-3">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20">Download QR (SVG)</button>
                        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold">Print Template</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">WhatsApp Dynamic Integration</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-xl">
                      <p className="text-xs text-indigo-400 font-bold uppercase mb-2 tracking-widest">Active Template</p>
                      <p className="text-slate-700 font-medium">
                        "Hi <span className="text-indigo-600 font-bold">{"{business_name}"}</span>, I just viewed your Digital V-Card at <span className="text-indigo-600 font-bold">{"{vcard_url}"}</span> and would like to connect!"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Search size={14} />
                      Variables supported: business_name, owner_name, vcard_url, franchise_name
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <DocSection 
                title="Fetch Public V-Card"
                description="Get all public business info and social links using the slug."
                code={`const { data, error } = await supabase
  .from('businesses')
  .select('*, social_links(*)')
  .eq('slug', 'alex-rivera-tech')
  .single();`}
              />
              <DocSection 
                title="Franchise Admin View"
                description="Fetch all businesses belonging to a specific franchise (Restricted by RLS)."
                code={`const { data, error } = await supabase
  .from('businesses')
  .select('*')
  .eq('franchise_id', 'assigned-franchise-uuid');`}
              />
              <DocSection 
                title="Update WhatsApp Template"
                description="Owners can customize their dynamic message."
                code={`await supabase
  .from('businesses')
  .update({ whatsapp_template: 'Hello! I need a quote.' })
  .eq('id', business_id);`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, change }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
    <p className="text-xs font-semibold text-green-500 mt-2">{change}</p>
  </div>
);

const StorageItem = ({ name, path, policy, size }: any) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
        <Database size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">{name}</p>
        <p className="text-[10px] font-mono text-slate-400">{path}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-bold text-slate-900">{size}</p>
      <p className="text-[9px] text-slate-400 uppercase font-bold">{policy}</p>
    </div>
  </div>
);

const DocSection = ({ title, description, code }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-6 border-b border-slate-50">
      <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
    <div className="p-6 bg-slate-900">
      <pre className="text-blue-400 font-mono text-sm">
        {code}
      </pre>
    </div>
  </div>
);

export default App;
