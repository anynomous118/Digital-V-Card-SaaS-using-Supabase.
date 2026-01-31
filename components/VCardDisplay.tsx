
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Share2, Globe, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Business } from '../types';

interface VCardDisplayProps {
  business: Business;
}

const VCardDisplay: React.FC<VCardDisplayProps> = ({ business }) => {
  const shareToWhatsapp = () => {
    const message = `Hi ${business.name}, I found your V-Card at https://vcard-saas.com/${business.slug}`;
    window.open(`https://wa.me/${business.whatsapp_number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-[390px] mx-auto bg-slate-50 min-h-[700px] shadow-2xl rounded-[3rem] border-[8px] border-slate-900 overflow-hidden relative">
      {/* Cover Image / Header */}
      <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-700 relative">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
            <img src={business.photo_url || `https://picsum.photos/seed/${business.slug}/200`} alt={business.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-6 text-center pb-24">
        <h2 className="text-2xl font-bold text-slate-900">{business.name}</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Founder & CEO</p>
        <div className="mt-4 flex justify-center">
            <img src={business.logo_url || 'https://picsum.photos/seed/logo/100'} className="h-10 opacity-70" alt="Logo" />
        </div>
        
        <p className="mt-6 text-slate-600 text-sm leading-relaxed italic">
          "{business.bio}"
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          <ActionButton icon={<Phone size={20} />} label="Call" color="bg-blue-100 text-blue-600" />
          <ActionButton icon={<MessageCircle size={20} />} label="WA" color="bg-green-100 text-green-600" onClick={shareToWhatsapp} />
          <ActionButton icon={<Mail size={20} />} label="Email" color="bg-red-100 text-red-600" />
          <ActionButton icon={<MapPin size={20} />} label="Map" color="bg-amber-100 text-amber-600" />
        </div>

        {/* Details List */}
        <div className="mt-10 space-y-4 text-left">
          <DetailItem icon={<Phone size={18} />} title="Mobile" value={business.phone} />
          <DetailItem icon={<Mail size={18} />} title="Email" value={business.email} />
          <DetailItem icon={<MapPin size={18} />} title="Address" value={business.address} />
        </div>

        {/* Social Links */}
        <div className="mt-10">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Connect With Me</h3>
          <div className="flex justify-center gap-4">
            <SocialIcon icon={<Instagram size={20} />} />
            <SocialIcon icon={<Facebook size={20} />} />
            <SocialIcon icon={<Linkedin size={20} />} />
            <SocialIcon icon={<Globe size={20} />} />
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-colors">
          <Share2 size={18} />
          Save to Contacts
        </button>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
  </button>
);

const DetailItem = ({ icon, title, value }: any) => (
  <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
    <div className="text-indigo-600">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{title}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);

const SocialIcon = ({ icon }: any) => (
  <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 hover:text-indigo-600 transition-colors">
    {icon}
  </button>
);

export default VCardDisplay;
