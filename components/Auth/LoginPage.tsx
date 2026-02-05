
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, ArrowRight, Loader2, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });
            if (error) throw error;
            setSubmitted(true);
        } catch (error: any) {
            setError(error.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });
            if (error) throw error;
        } catch (error: any) {
            setError(error.message || 'Invalid OTP');
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-gray-900 selection:text-white bg-white">
            {/* Left Side - Brand & Visuals */}
            <div className="hidden lg:flex w-5/12 bg-gray-50 relative overflow-hidden flex-col justify-between p-12 border-r border-gray-200">
                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <Smartphone size={20} className="text-gray-900" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">V-Card SaaS <span className="text-gray-400 font-medium">Architect</span></h1>
                </div>

                {/* Visual Content */}
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight text-gray-900">
                        Transform Your <br />
                        <span className="text-gray-500">Digital Identity</span>
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                        Create professional, sharable digital business cards in seconds. Analytics, themes, and more.
                    </p>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 mt-12 max-w-md">
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 text-gray-900 fill-current">★</div>)}
                        </div>
                        <p className="text-lg font-medium text-gray-900 italic mb-4 leading-relaxed">"The analytics are instant. It completely changed how I network at conferences."</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-900 border border-gray-200">AS</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Alex Stanton</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Enterprise User</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center gap-6 text-xs font-medium text-gray-400">
                    <span>© 2024 V-Card SaaS</span>
                    <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-6 border border-gray-200">
                            <ShieldCheck size={12} /> Secure Access
                        </span>
                        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-4">
                            The Professional’s Choice for Digital Identity
                        </h1>
                        <p className="text-gray-500 text-base font-medium">
                            Log in to manage your V-Cards and analytics.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 animate-slide-up">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                            {error}
                        </div>
                    )}

                    {!submitted ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">Work Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all font-medium text-base shadow-sm hover:border-gray-300"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95 duration-200"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Log In with OTP <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-8 animate-slide-up">
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-bold mb-1">Check your inbox</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        We've sent a 6-digit verification code to <strong className="text-gray-900">{email}</strong>. It may take a few seconds to arrive.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full py-5 rounded-xl border border-gray-200 bg-white text-center text-3xl font-bold tracking-[0.5em] text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all font-mono shadow-sm"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={verifyLoading}
                                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95 duration-200"
                            >
                                {verifyLoading ? <Loader2 className="animate-spin" /> : 'Verify & Access Dashboard'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="w-full text-gray-500 text-xs font-bold hover:text-gray-900 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 p-2"
                            >
                                <ArrowRight className="rotate-180" size={14} /> Use a different email
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
