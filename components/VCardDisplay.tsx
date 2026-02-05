
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Share2, Globe, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Business } from '../types';

interface VCardDisplayProps {
  business: Business;
}

const VCardDisplay: React.FC<VCardDisplayProps> = ({ business }) => {
  const shareToWhatsapp = () => {
    const message = `Hi ${business.business_name}, I found your V-Card at https://vcard-saas.com/${business.slug}`;
    window.open(`https://wa.me/${business.whatsapp_number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-[375px] mx-auto bg-white min-h-[750px] shadow-2xl rounded-[3rem] border-[10px] border-slate-900 overflow-hidden relative font-sans">
      {/* Cover Image / Header - Solid Vibrant Purple Block */}
      <div className="h-44 bg-gradient-to-b from-[#7c3aed] to-[#a855f7] relative">
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-10">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
            <img
              src={business.owner_photo_url || `https://picsum.photos/seed/${business.slug}/200`}
              alt={business.business_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-6 text-center pb-32">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{business.business_name}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Founder & CEO</p>

        <div className="mt-6 flex justify-center">
          {/* Small Logo or Placeholder if needed, but screenshot prioritized clean text */}
        </div>

        <p className="mt-6 text-slate-600 text-sm leading-relaxed italic px-4 font-medium">
          "{business.description}"
        </p>

        {/* Quick Actions - Squircle Icons */}
        <div className="flex justify-center gap-6 mt-10">
          <ActionButton icon={<Phone size={22} />} label="Call" color="bg-blue-50 text-blue-600" />
          <ActionButton icon={<MessageCircle size={22} />} label="WA" color="bg-green-50 text-green-600" onClick={shareToWhatsapp} />
          <ActionButton icon={<Mail size={22} />} label="Email" color="bg-red-50 text-red-600" />
          <ActionButton icon={<MapPin size={22} />} label="Map" color="bg-orange-50 text-orange-600" />
        </div>

        {/* Details List - Clean Cards */}
        <div className="mt-12 space-y-4 text-left">
          <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center gap-4">
            <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Mobile</p>
              <p className="text-base font-bold text-slate-900">{business.phone || "+91 98765 43210"}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center gap-4">
            <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Email</p>
              <p className="text-base font-bold text-slate-900 truncate max-w-[200px]">{business.email || "hello@example.com"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="absolute bottom-8 left-6 right-6 z-20">
        <button className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
          <Share2 size={20} />
          Save Contact
        </button>
      </div>

    </div>
  );
};

const ActionButton = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-slate-600">{label}</span>
  </button>
);

export default VCardDisplay;
