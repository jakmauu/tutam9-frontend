import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate form progress
  useEffect(() => {
    let filled = 0;
    if (formData.username) filled++;
    if (formData.email) filled++;
    if (formData.password) filled++;
    if (formData.confirmPassword) filled++;
    
    setFormProgress((filled / 4) * 100);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear errors when field is edited
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({
        ...prev,
        [e.target.name]: null
      }));
    }
  };

  const validate = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username diperlukan';
    }
    
    if (!formData.email) {
      errors.email = 'Email diperlukan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      errors.password = 'Password diperlukan';
    } else if (formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/calendar');
    } catch (err) {
      console.error('Registration error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Background elements
  const particles = Array(20).fill().map((_, i) => ({
    id: i,
    size: 4 + Math.random() * 8,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 20 + Math.random() * 40,
    delay: Math.random() * 5
  }));

  // Features list
  const features = [
    {
      icon: "🎯",
      title: "Manajemen Tugas",
      desc: "Atur tugas-tugas kuliah dengan mudah"
    },
    {
      icon: "📅",
      title: "Jadwal Visual",
      desc: "Lihat jadwal tugas per hari dengan jelas"
    },
    {
      icon: "📊",
      title: "Lacak Progress",
      desc: "Pantau perkembangan dan tingkat penyelesaian"
    }
  ];

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { width: '0%', color: 'bg-gray-300' };
    
    if (password.length < 6) {
      return { width: '33%', color: 'bg-red-500' };
    } else if (password.length < 10) {
      return { width: '66%', color: 'bg-yellow-500' };
    } else {
      return { width: '100%', color: 'bg-green-500' };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-200 opacity-20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Large gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Left Column - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 z-10">
        <motion.div
          className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -top-24 -right-24 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10">
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h2>
              <p className="text-indigo-100">
                Mulai perjalanan produktivitas akademik Anda
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-1 w-full bg-indigo-800/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-400 to-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${formProgress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-indigo-200">
                <span>Pendaftaran</span>
                <span>{Math.round(formProgress)}% selesai</span>
              </div>
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
                  className={`mb-4 transform transition-all duration-300 ${focusedField === 'username' ? 'scale-105' : ''}`}
                >
                  <Input
                    id="username"
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Pilih username yang unik"
                    error={formErrors.username}
                    inputClassName="bg-white/10 backdrop-blur-md border-indigo-300/30 text-white placeholder-indigo-200/50 focus:border-blue-300"
                    labelClassName="text-indigo-100"
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
                  className={`mb-4 transform transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan email aktif"
                    error={formErrors.email}
                    inputClassName="bg-white/10 backdrop-blur-md border-indigo-300/30 text-white placeholder-indigo-200/50 focus:border-blue-300"
                    labelClassName="text-indigo-100"
                    icon={(props) => (
                      <svg xmlns="http://www.w3.org/2000/svg" {...props} className="text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    )}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div 
                  className={`mb-4 transform transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}
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
                    placeholder="Minimal 6 karakter"
                    error={formErrors.password}
                    inputClassName="bg-white/10 backdrop-blur-md border-indigo-300/30 text-white placeholder-indigo-200/50 focus:border-blue-300"
                    labelClassName="text-indigo-100"
                    icon={(props) => (
                      <svg xmlns="http://www.w3.org/2000/svg" {...props} className="text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    required
                  />

                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-1 mb-2">
                      <div className="w-full h-1 bg-gray-200/30 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${passwordStrength.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: passwordStrength.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-indigo-200">
                          {passwordStrength.width === '100%' ? 'Password kuat' : 
                           passwordStrength.width === '66%' ? 'Password sedang' : 
                           'Password lemah'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div 
                  className={`mb-6 transform transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-105' : ''}`}
                >
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan password kembali"
                    error={formErrors.confirmPassword}
                    inputClassName="bg-white/10 backdrop-blur-md border-indigo-300/30 text-white placeholder-indigo-200/50 focus:border-blue-300"
                    labelClassName="text-indigo-100"
                    icon={(props) => (
                      <svg xmlns="http://www.w3.org/2000/svg" {...props} className="text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    required
                  />

                  {/* Password match indicator */}
                  {formData.password && formData.confirmPassword && (
                    <motion.div 
                      className="flex items-center mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {formData.password === formData.confirmPassword ? (
                        <span className="text-xs text-green-300 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Password cocok
                        </span>
                      ) : (
                        <span className="text-xs text-red-300 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                          Password tidak cocok
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>

             

              <motion.div variants={itemVariants} className="mt-6">
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-600/20 font-medium py-3 text-white"
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Daftar Sekarang
                </Button>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="text-center mt-6"
              >
                <p className="text-indigo-100">
                  Sudah punya akun?{' '}
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="text-white font-medium border-b border-indigo-300 hover:border-white transition-colors">
                      Login disini
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Features */}
      <motion.div 
        className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-8 md:p-12 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              className="flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white ml-3">Assignment Tracker</h2>
            </motion.div>

            <motion.h3 
              className="text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Satu Langkah Menuju{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">
                Produktivitas Akademik
              </span>
            </motion.h3>

            <motion.p 
              className="text-lg text-indigo-100 mb-10" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Assignment Tracker dirancang khusus untuk mahasiswa yang ingin meningkatkan performa akademik dengan pengelolaan tugas yang efisien.
            </motion.p>

            {/* Feature cards with staggered animation */}
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl"
                  whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transition: { duration: 0.2 } 
                  }}
                >
                  <div className="flex">
                    <span className="flex-shrink-0 text-3xl mr-4">{feature.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-indigo-100">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;