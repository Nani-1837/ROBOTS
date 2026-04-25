import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import Stats from './components/Stats';
import NeuralArchitecture from './components/NeuralArchitecture';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CategoryView from './components/CategoryView';
import CollegeProjectsView from './components/CollegeProjectsView';
import ModelUploadView from './components/ModelUploadView';
import ContactView from './components/ContactView';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import TrackOrderView from './components/TrackOrderView';
import CompareView from './components/CompareView';
import TrustSection from './components/TrustSection';
import FAQ from './components/FAQ';
import Portfolio from './components/Portfolio';
import LiveActivity from './components/LiveActivity';
import Roadmap from './components/Roadmap';
import ReferralSection from './components/ReferralSection';
import SoundEffects from './components/SoundEffects';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'college-projects' | 'model-upload' | 'contact' | 'track-order' | 'compare'>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Spectra-X Pro Drone', price: 1299, qty: 1, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Titan Rover RC', price: 599, qty: 1, image: 'https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=200' }
  ]);

  // Handle Category Changes
  useEffect(() => {
    if (activeCategory) {
      setCurrentView('category');
    } else {
      setCurrentView('home');
    }
  }, [activeCategory]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] selection:bg-primary/30 selection:text-[var(--text-main)] transition-colors duration-400">
      <SoundEffects />
      <Navbar 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
        setActiveCategory={setActiveCategory} 
        setCurrentView={setCurrentView}
      />
      
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <main key="home">
            <Hero setCurrentView={setCurrentView} setActiveCategory={setActiveCategory} />
            <Features />
            <TrustSection />
            <Showcase />
            <Portfolio />
            <Roadmap />
            <NeuralArchitecture />
            <Stats />
            <ReferralSection />
            <ProductGrid setCartItems={setCartItems} setActiveCategory={setActiveCategory} />
            <Testimonials />
            <FAQ />
            <Newsletter />
          </main>
        )}

        {currentView === 'category' && activeCategory && (
          <CategoryView 
            key="category"
            category={activeCategory} 
            onBack={() => setActiveCategory(null)} 
            setCartItems={setCartItems}
          />
        )}

        {currentView === 'college-projects' && (
          <CollegeProjectsView 
            key="college-projects" 
            onBack={() => { setActiveCategory(null); setCurrentView('home'); }} 
            setCartItems={setCartItems}
          />
        )}

        {currentView === 'model-upload' && (
          <ModelUploadView key="model-upload" onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
        )}

        {currentView === 'contact' && (
          <ContactView key="contact" onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
        )}

        {currentView === 'track-order' && (
          <TrackOrderView key="track-order" onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
        )}

        {currentView === 'compare' && (
          <CompareView key="compare" onBack={() => { setActiveCategory(null); setCurrentView('home'); }} />
        )}
      </AnimatePresence>

      <Footer />
      <LiveActivity />
    </div>
  );
}

export default App;
