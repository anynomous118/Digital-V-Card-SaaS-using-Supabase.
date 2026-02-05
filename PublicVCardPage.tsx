import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import VCardDisplay from '@/components/VCardDisplay';
import { Business } from '@/types';

const PublicVCardPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchBusiness = async () => {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();

            if (!error) {
                setBusiness(data);
            }

            setLoading(false);
        };

        fetchBusiness();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!business) {
        return <div className="min-h-screen flex items-center justify-center">V-Card not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <VCardDisplay business={business} />
        </div>
    );
};

export default PublicVCardPage;
