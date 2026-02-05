import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Business } from '../types';
import { Loader2, AlertCircle, CheckCircle, Store, Globe } from 'lucide-react';

interface CreateBusinessFormProps {
    onSuccess: (business: Business) => void;
    onCancel: () => void;
}

const CreateBusinessForm: React.FC<CreateBusinessFormProps> = ({ onSuccess, onCancel }) => {
    const { user, profile } = useAuth();
    const [formData, setFormData] = useState({
        business_name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSlug = async (name: string) => {
        let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let counter = 1;
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            attempts++;
            const { data, error } = await supabase
                .from('businesses')
                .select('slug')
                .eq('slug', slug)
                .maybeSingle();

            if (error) {
                console.error("Slug check error:", error);
                // Expose the actual error to the UI for debugging
                throw new Error(`DB Error: ${error.message} (${error.details || 'Check console'})`);
            }

            if (!data) {
                isUnique = true;
            } else {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }
        return slug;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit triggered. User:", user?.id, "Profile:", profile?.id);

        if (!user) {
            setError('Session invalid. Please refresh the page.');
            return;
        }

        setLoading(true);
        setError(null);

        if (!formData.business_name.trim()) {
            setError('Business name is required');
            setLoading(false);
            return;
        }

        try {
            const slug = await generateSlug(formData.business_name);
            console.log("Generated slug:", slug);

            const payload = {
                owner_id: user.id,
                franchise_id: user.app_metadata?.franchise_id ?? null,
                business_name: formData.business_name.trim(),
                description: formData.description.trim(),
                slug,
                email: user.email,
                phone: null,
                whatsapp_number: null,
                address: null,
                is_active: true,
                view_count: 0,
            };


            const { data, error: insertError } = await supabase
                .from('businesses')
                .insert([payload])
                .select()
                .single();

            if (insertError) {
                console.error("Supabase insert error:", insertError);
                throw insertError;
            }

            if (data) {
                console.log("Business created:", data);
                onSuccess(data as Business);
            } else {
                throw new Error("Created but no data returned. Refresh to check.");
            }
        } catch (err: any) {
            console.error('Error creating business:', err);
            setError(err.message || 'Failed to create business. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden max-w-2xl mx-auto animate-in zoom-in-95 duration-300 relative">
            <div className="bg-slate-900 px-8 py-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                            <Store className="text-white" size={20} />
                        </div>
                        Create New V-Card
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 ml-[52px]">Launch your professional digital identity in seconds.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Submission Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Business Name</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={formData.business_name}
                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-lg text-slate-900 placeholder:text-slate-400"
                                placeholder="e.g. Acme Innovations"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                <Store size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Short Bio / Tagline</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none h-32 font-medium text-slate-700 placeholder:text-slate-400"
                            placeholder="Briefly describe your business..."
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                        <Globe size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900">Automatic URL Generation</p>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            We'll automatically create a unique, SEO-friendly link for your business (e.g. <span className="font-mono bg-blue-100/50 px-1 rounded">vcard.com/your-business</span>) that you can share immediately.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Launch V-Card <CheckCircle size={18} /></>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBusinessForm;











