import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface PoliciesViewProps {
  type: 'terms' | 'privacy' | 'refund' | 'shipping';
  onBack: () => void;
}

export default function PoliciesView({ type, onBack }: PoliciesViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

  const policies = {
    terms: {
      title: 'Terms and Conditions',
      icon: FileText,
      content: (
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>Welcome to BISONIX. By accessing our website, you agree to these Terms and Conditions.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">1. Use of the Site</h3>
          <p>You must be at least 18 years old to make a purchase. All content is property of BISONIX.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">2. Products and Pricing</h3>
          <p>We reserve the right to modify prices and product specifications without prior notice. All prices are in INR inclusive of applicable taxes.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">3. User Accounts</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. BISONIX is not liable for unauthorized account access.</p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: (
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>At BISONIX, we take your privacy seriously. This policy describes how your personal information is collected and used.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">1. Information We Collect</h3>
          <p>We collect information such as your name, email, phone number, and shipping address when you place an order or sign up for an account.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">2. How We Use Your Information</h3>
          <p>Your data is used solely to process orders, deliver products, and improve our services. We do not sell your data to third parties.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">3. Data Security</h3>
          <p>We implement industry-standard security measures to protect your personal information during transmission and storage.</p>
        </div>
      )
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      icon: RotateCcw,
      content: (
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>We want you to be completely satisfied with your BISONIX purchase.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">1. Cancellations</h3>
          <p>Orders can be cancelled before they are dispatched. Once shipped, cancellations are no longer possible, but you may initiate a return.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">2. Returns</h3>
          <p>We accept returns within 7 days of delivery for defective or damaged items. Custom 3D prints and personalized projects are non-returnable.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">3. Refunds</h3>
          <p>Approved refunds will be processed back to the original payment method within 5-7 business days.</p>
        </div>
      )
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: Truck,
      content: (
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>BISONIX delivers high-performance tech across India.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">1. Processing Time</h3>
          <p>Standard orders are processed within 24-48 hours. Custom 3D prints may take an additional 3-5 days based on complexity.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">2. Delivery Timeframes</h3>
          <p>Standard shipping takes 3-5 business days. Remote locations may take up to 7-10 days.</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] pt-4">3. Shipping Charges</h3>
          <p>We offer free standard shipping on all orders across India. Expedited shipping is available at an additional cost during checkout.</p>
        </div>
      )
    }
  };

  const data = policies[type];
  const Icon = data.icon;

  useSEO({
    title: data.title,
    description: `Read the BISONIX ${data.title}.`
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors font-medium">Home</button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">{data.title}</span>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 md:p-12 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--border-subtle)]">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-display text-[var(--text-main)]">{data.title}</h1>
              <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mt-2">Last Updated: May 2026</p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {data.content}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
