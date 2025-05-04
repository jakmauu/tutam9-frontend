import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [animateBg, setAnimateBg] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggle background animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateBg(prev => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData);
      navigate('/calendar');
    } catch (err) {
      console.error('Login error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Variants for staggered form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
  };

  // Background bubble elements
  const bubbles = Array(12).fill().map((_, i) => ({
    id: i,
    size: 20 + Math.random() * 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 30,
    delay: Math.random() * 10,
  }));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-gradient-to-br from-indigo-400/10 to-blue-400/10 backdrop-blur-sm"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Light Streaks Effect */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_50%,transparent_0%,rgba(79,70,229,0.05)_100%)]"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          rotateZ: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Left Column - Welcome Message & Illustrations */}
      <motion.div 
        className="relative md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="flex items-center justify-center md:justify-start mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h1 className="ml-3 text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-blue-200">
                Assignment Tracker
              </h1>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Kelola Tugas dengan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">
                Efektif & Efisien
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-indigo-100 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Platform yang membantu Anda mengelola tugas akademik dengan mudah, terorganisir, dan tepat waktu.
            </motion.p>
            
            {/* Feature highlights */}
            <motion.div 
              className="mt-8 grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 }}
            >
              {[
                { icon: "📅", text: "Organisasi Visual" },
                { icon: "⏰", text: "Pengingat Tepat Waktu" },
                { icon: "✅", text: "Lacak Semua Tugas Anda" },
                { icon: "📊", text: "Progress Tercatat" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: "rgba(255,255,255,0.15)" 
                  }}
                >
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <span className="text-white text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Decorative UI Elements */}
          <motion.div 
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-full filter blur-3xl opacity-70"
            animate={{
              scale: animateBg ? 1.2 : 1,
              x: animateBg ? 20 : 0,
              y: animateBg ? -20 : 0,
            }}
            transition={{ duration: 8, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl opacity-70"
            animate={{
              scale: animateBg ? 1 : 1.2,
              x: animateBg ? 0 : 20,
              y: animateBg ? 0 : 20,
            }}
            transition={{ duration: 8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Right Column - Login Form with Glass Effect */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="absolute -top-24 -right-24 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang!</h2>
              <p className="text-indigo-100">Masuk untuk melanjutkan ke dashboard Anda</p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-white rounded-lg"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form 
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <div 
                  className={`mb-5 transform transition-all duration-300 ${focusedField === 'username' ? 'scale-105' : ''}`}
                >
                  <Input
                    id="username"
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan username Anda"
                    inputClassName="bg-white/10 backdrop-blur-md border-indigo-300/30 text-white placeholder-indigo-200/50 focus:border-blue-300"
                    labelClassName="text-white font-medium"
                    icon={(props) => (
                      <svg xmlns="http://www.w3.org/2000/svg" {...props} className="text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div 
                  className={`mb-6 transform transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}
                >
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan password Anda"
                    inputClassName="bg-white/10 backdrop-blur-md border-indigo-300/30 text-white placeholder-indigo-200/50 focus:border-blue-300"
                    labelClassName="text-white font-medium"
                    icon={(props) => (
                      <svg xmlns="http://www.w3.org/2000/svg" {...props} className="text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-600/20 font-medium py-3 text-white"
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Masuk ke Dashboard
                </Button>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="text-center mt-4"
              >
                <p className="text-indigo-100">
                  Belum punya akun?{' '}
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/register" className="text-white font-medium border-b border-indigo-300 hover:border-white transition-colors">
                      Daftar sekarang
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;