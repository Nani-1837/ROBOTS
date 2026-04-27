import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, Phone, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { insforge } from '../lib/insforge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const countryCodes = [
  { code: '+91', name: 'IN' },
  { code: '+1', name: 'US' },
  { code: '+44', name: 'UK' },
  { code: '+971', name: 'UAE' },
  { code: '+61', name: 'AU' },
];

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countryCode, setCountryCode] = useState('+91');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, handleSession } = useAuth();
  const { showToast } = useToast();

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerifying) {
      if (!isLogin && phone.length !== 10) {
        showToast('Phone number must be exactly 10 digits', 'error');
        return;
      }
      const passError = validatePassword(password);
      if (passError) {
        showToast(passError, 'error');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        showToast('Login successful', 'success');
        onClose();
      } else if (isVerifying) {
        const { data: verifyData, error: verifyError } = await (insforge.auth as any).verifyEmail({
          email: email.trim(),
          otp: otp.join('').trim()
        });
        if (verifyError) throw verifyError;
        
        if (verifyData?.accessToken) {
          // Try to get GPS location silently
          let gpsCoords: { lat: number; lng: number } | null = null;
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            gpsCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          } catch {
            // GPS denied or unavailable — continue without it
          }

          await handleSession(verifyData.accessToken, { 
            name, 
            phone: `${countryCode}${phone}`,
            coordinates: gpsCoords ?? undefined,
            referralCode: referralCode.trim()
          });
          showToast('Account verified successfully! Welcome to Bisonix 🎉', 'success');
          onClose();
        } else {
          showToast('Email verified successfully! You can now login.', 'success');
          setIsVerifying(false);
          setIsLogin(true);
        }
      } else {
        const { data: signUpData, error: signUpError } = await (insforge.auth as any).signUp({
          email,
          password,
          phone: `${countryCode}${phone}`,
          options: {
            data: {
              full_name: name,
              phone: `${countryCode}${phone}`,
              phone_number: `${countryCode}${phone}` // Alternative key for compatibility
            }
          }
        });
        
        if (signUpData) {
          console.log('Sign up successful, user data:', signUpData);
        }
        if (signUpError) {
          if (signUpError.status === 409) {
            showToast('User already exists. Please login instead.', 'error');
          } else {
            throw signUpError;
          }
        } else {
          setIsVerifying(true);
          showToast('Verification code sent to your email!', 'info');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-subtle)] p-8 rounded-3xl shadow-[var(--card-shadow)] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[150px] bg-primary/20 blur-[80px] pointer-events-none rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 p-2 rounded-full transition-all"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-bold text-[var(--text-main)] mb-2">
                {isVerifying ? 'Verify Email' : isLogin ? 'Welcome Back' : 'Join Bisonix'}
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                {isVerifying ? `Enter the 6-digit code sent to ${email}` : isLogin ? 'Enter your details to access your account' : 'Create an account to explore premium robotics'}
              </p>
            </div>

            {!isVerifying && (
              <div className="flex bg-[var(--bg-primary)]/50 rounded-full p-1.5 mb-8 border border-[var(--border-subtle)] relative z-10">
                <button
                  onClick={() => { setIsLogin(true); setIsVerifying(false); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                    isLogin ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsLogin(false); setIsVerifying(false); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                    !isLogin ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}


            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
              <AnimatePresence mode="popLayout" initial={false}>
                {isVerifying ? (
                  <motion.div
                    key="verify-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between gap-2 sm:gap-3">
                      {otp.map((digit, idx) => (
                        <input 
                          key={idx}
                          id={`otp-${idx}`}
                          type="text" 
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          onPaste={(e) => {
                            const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
                            if (pasteData.length === 6 && pasteData.every(d => !isNaN(Number(d)))) {
                              setOtp(pasteData);
                              // Focus last box
                              setTimeout(() => {
                                document.getElementById('otp-5')?.focus();
                              }, 0);
                            }
                          }}
                          className="w-full aspect-square bg-white border border-[var(--border-subtle)] rounded-xl text-center text-xl font-bold text-black focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          required
                        />
                      ))}
                    </div>
                    <p className="text-center text-xs text-[var(--text-muted)]">
                      Didn't receive the code? <button type="button" className="text-primary hover:underline" onClick={() => setIsVerifying(false)}>Change Email</button>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={isLogin ? "login-view" : "signup-view"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    className="space-y-4"
                  >
                    {!isLogin && (
                      <div className="space-y-4">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                          <input 
                            type="text" 
                            placeholder="Full Name *" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isLogin}
                            className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="relative min-w-[100px]">
                            <select 
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-3 pr-8 text-[var(--text-main)] text-sm appearance-none focus:outline-none focus:border-primary/50 transition-all"
                            >
                              {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-[var(--bg-secondary)]">{c.name} {c.code}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={14} />
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input 
                              type="tel" 
                              placeholder="Phone Number (10 digits) *" 
                              value={phone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 10) setPhone(val);
                              }}
                              required={!isLogin}
                              className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                          <input 
                            type="text" 
                            placeholder="Referral Code (Optional)" 
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all uppercase"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                      <input 
                        type="email" 
                        placeholder={isLogin ? "Email Address" : "Email Address *"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder={isLogin ? "Password" : "Password *"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-12 text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin && !isVerifying && (
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-xs font-medium text-[var(--text-muted)] hover:text-primary transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:shadow-[0_0_30px_rgba(255,106,0,0.4)] mt-4 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isVerifying ? 'Verify Code' : isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
