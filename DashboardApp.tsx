
import React, { useState } from 'react';
import { Copy, Check, Terminal, Database, ShieldCheck, Zap, QrCode, Search, LogOut, Smartphone, Users, CreditCard, BarChart3, HardDrive, Cloud, Globe, ArrowRight, Loader2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import VCardDisplay from './components/VCardDisplay';
import LoginPage from './components/Auth/LoginPage';
import { SQL_SCHEMA } from './constants/sql-schema';
import { Business, UserRole } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import CreateBusinessForm from '@/components/CreateBusinessForm';


const PUBLIC_BASE_URL = window.location.origin;

const getPublicVCardUrl = (slug: string) => {
    return `${PUBLIC_BASE_URL}/v/${slug}`;
};



const DashboardContent: React.FC = () => {
    const { user, role, signOut, isAdmin, isFranchiseAdmin, loading: authLoading } = useAuth();
    console.log('PROFILE ROLE:', role);


    const [activeTab, setActiveTab] = useState<'dashboard' | 'schema' | 'preview' | 'docs'>('dashboard');
    const [copied, setCopied] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const getWhatsAppShareUrl = (business: Business) => {
        const message = `Hi! Check out my digital business card:\n${getPublicVCardUrl(business.slug)}`;
        return `https://wa.me/?text=${encodeURIComponent(message)}`;
    };



    // React.useEffect(() => {
    //   if (!user) return;

    //   (async () => {
    //     const { data, error } = await supabase
    //       .from('businesses')
    //       .select('id, business_name, franchise_id');

    //     console.log('🔐 RLS TEST — businesses:', data, error);
    //   })();
    // }, [user]);




    // Real Data State
    const [business, setBusiness] = useState<Business | null>(null);

    React.useEffect(() => {
        console.log(
            'PUBLIC V-CARD URL:',
            business ? `${window.location.origin}/v/${business.slug}` : 'no business'
        );
    }, [business]);






    const [stats, setStats] = useState({ businesses: 0, franchises: 0, activeVCards: 0, revenue: 0 });
    const [loadingData, setLoadingData] = useState(false);

    console.log(
        'PUBLIC V-CARD URL:',
        business ? getPublicVCardUrl(business.slug) : 'no business'
    );



    // Fetch Data on Load
    React.useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                // 1. Fetch User's Business (if Owner)
                const { data: businessData } = await supabase
                    .from('businesses')
                    .select('*')
                    .eq('owner_id', user.id)
                    .maybeSingle();

                if (businessData) setBusiness(businessData);

                // 2. Fetch Stats (If Admin)
                if (isAdmin || isFranchiseAdmin) {
                    const { count: businessCount } = await supabase.from('businesses').select('*', { count: 'exact', head: true });
                    const { count: franchiseCount } = await supabase.from('franchises').select('*', { count: 'exact', head: true });

                    setStats({
                        businesses: businessCount || 0,
                        franchises: franchiseCount || 0,
                        activeVCards: 0, // Placeholder
                        revenue: 0 // Placeholder
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [user, isAdmin, isFranchiseAdmin]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(SQL_SCHEMA);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateSuccess = (newBusiness: Business) => {
        setBusiness(newBusiness);
        setShowCreateForm(false);
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-medium">Loading session...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-gray-900 selection:text-white">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative">
                <div className="max-w-7xl mx-auto pb-12">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-20 pt-2">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 capitalize tracking-tight">{activeTab}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Workspace for <span className="font-medium text-gray-900">{user?.email}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">



                            {/* <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${isAdmin ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  isFranchiseAdmin ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-white text-gray-600 border-gray-200'
                }`}>
                {profile?.role?.replace('_', ' ') || 'User'}
              </div>
               */}
                            <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${role === UserRole.SUPER_ADMIN
                                ? 'bg-purple-50 text-purple-700 border-purple-200' : role === UserRole.FRANCHISE_ADMIN
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : 'bg-white text-gray-600 border-gray-200'
                                }`}
                            >
                                {role === UserRole.SUPER_ADMIN
                                    ? 'Super Admin'
                                    : role === UserRole.FRANCHISE_ADMIN
                                        ? 'Franchise Admin'
                                        : 'Business Owner'}
                            </div>





                            <button
                                onClick={() => signOut()}
                                className="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-200"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="animate-in fade-in duration-300">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                {/* Stats */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <StatCard label="Total Businesses" value={stats.businesses} change="+12%" icon={Users} />
                                        <StatCard label="Franchises" value={stats.franchises} change="Active" icon={Globe} />
                                        <StatCard label="Active V-Cards" value={loadingData ? '...' : (stats.businesses > 0 ? 'Live' : '—')} change="Status" icon={Smartphone} />
                                        <StatCard label="Revenue" value="$0.00" change="Monetization" icon={CreditCard} />
                                    </div>
                                </div>

                                {/* Content Sections */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                <Database size={16} className="text-gray-600" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900">Storage Buckets</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <StorageItem name="Logos & Brand Assets" path="storage.buckets/logos" policy="Public Read" icon={Cloud} />
                                            <StorageItem name="User Avatars" path="storage.buckets/avatars" policy="Public Read" icon={Users} />
                                            <StorageItem name="Static QR Codes" path="storage.buckets/qrcodes" policy="System Write" icon={QrCode} />
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                <Zap size={16} className="text-gray-600" />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900">Edge Functions</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono text-xs font-medium text-gray-700">generate-qr-code</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-1">Generates SVG QRs on business creation.</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono text-xs font-medium text-gray-700">vcard-to-contacts</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                </div>
                                                <p className="text-xs text-gray-500">Converts JSON to .vcf for contact saving.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schema' && (
                            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
                                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-gray-900">
                                    <span className="text-gray-400 font-mono text-xs">vcard-saas-schema.sql</span>
                                    <button onClick={copyToClipboard} className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <pre className="text-gray-300 font-mono text-xs leading-relaxed p-4 overflow-x-auto">
                                    {SQL_SCHEMA}
                                </pre>
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="animate-in fade-in duration-300">
                                {business ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                        <div className="lg:col-span-1 sticky top-32">
                                            <div className='transform scale-90 origin-top'>
                                                <VCardDisplay business={business} />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Globe size={16} className="text-gray-400" /> Public Endpoint
                                                </h3>
                                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                                                    <code className="text-sm font-mono text-gray-600 truncate flex-1">{getPublicVCardUrl(business.slug)}</code>
                                                    <button
                                                        className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
                                                        onClick={() => navigator.clipboard.writeText(getPublicVCardUrl(business.slug))}>
                                                        <Copy size={14} />
                                                    </button>
                                                </div>

                                                <div className="flex gap-6">
                                                    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                        <img
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getPublicVCardUrl(business.slug))}`}

                                                            alt="QR Code"
                                                            className="w-24 h-24 mix-blend-multiply"
                                                        />
                                                    </div>
                                                    <div className="flex-1 py-1">
                                                        <h4 className="text-sm font-medium text-gray-900 mb-1">Use this QR code</h4>
                                                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">Print this on physical cards or stands. It permanently links to your digital V-Card.</p>
                                                        <div className="flex gap-3">
                                                            <button className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors shadow-sm">Download SVG</button>
                                                            <button
                                                                onClick={() => window.open(getWhatsAppShareUrl(business), '_blank')}
                                                                className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">
                                                                Share on WhatsApp
                                                            </button>
                                                            <button className="px-4 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Print PDF</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : showCreateForm ? (
                                    <div className="max-w-2xl mx-auto py-8">
                                        <CreateBusinessForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                            <Smartphone size={24} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No V-Card Found</h3>
                                        <p className="text-sm text-gray-500 mb-6">Create your first digital business card to get started.</p>
                                        <button
                                            onClick={() => setShowCreateForm(true)}
                                            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2 mx-auto"
                                        >
                                            Create V-Card
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'docs' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <DocSection
                                    title="Functions: Fetch V-Card"
                                    description="Use this Supabase query to retrieve public data."
                                    code={`const { data } = await supabase.from('businesses').select('*').eq('slug', slug).single();`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <AppWrapper />
//     </AuthProvider>
//   )
// };



const DashboardApp: React.FC = () => {
    return (
        <AuthProvider>
            <AppWrapper />
        </AuthProvider>
    );
};



const AppWrapper: React.FC = () => {
    const { session, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-gray-400" /></div>;
    if (!session) return <LoginPage />
    return <DashboardContent />
}

const StatCard = ({ label, value, change, icon: Icon }: any) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">
                <Icon size={18} />
            </div>
            {change && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                    {change}
                </span>
            )}
        </div>
        <h4 className="text-2xl font-semibold text-gray-900 mb-1">{value}</h4>
        <p className="text-xs text-gray-500">{label}</p>
    </div>
);

const StorageItem = ({ name, path, policy, icon: Icon }: any) => (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-transparent hover:border-gray-200 cursor-default">
        <div className="flex items-center gap-3">
            <Icon size={16} className="text-gray-400 group-hover:text-gray-600" />
            <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{name}</p>
                <p className="text-[10px] font-mono text-gray-400 text-xs">{path}</p>
            </div>
        </div>
        <span className="text-[10px] font-medium text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded bg-gray-50">{policy}</span>
    </div>
);

const DocSection = ({ title, description, code }: any) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm mb-1">{title}</h3>
            <p className="text-gray-500 text-xs">{description}</p>
        </div>
        <div className="bg-gray-50 p-6 overflow-x-auto">
            <pre className="text-gray-600 font-mono text-xs">{code}</pre>
        </div>
    </div>
);

//export default App;
export default DashboardApp;