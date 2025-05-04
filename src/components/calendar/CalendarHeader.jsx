import { motion, AnimatePresence } from 'framer-motion';

const CalendarHeader = ({ selectedDay, onDayChange }) => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  
  const today = new Date().getDay();
  // Convert from JS day (0-6 starting from Sunday) to our format (0-6 starting from Monday)
  const todayIndex = today === 0 ? 6 : today - 1;
  const todayName = days[todayIndex];

  // Objek warna untuk setiap hari (gradien dan warna teks yang sesuai)
  const dayColors = {
    'Senin': {
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      text: 'text-white'
    },
    'Selasa': {
      gradient: 'from-indigo-500 to-indigo-600',
      hoverGradient: 'from-indigo-600 to-indigo-700',
      text: 'text-white'
    },
    'Rabu': {
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      text: 'text-white'
    },
    'Kamis': {
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-600 to-green-700',
      text: 'text-white'
    },
    'Jumat': {
      gradient: 'from-yellow-500 to-amber-600',
      hoverGradient: 'from-yellow-600 to-amber-700',
      text: 'text-white'
    },
    'Sabtu': {
      gradient: 'from-pink-500 to-rose-600',
      hoverGradient: 'from-pink-600 to-rose-700',
      text: 'text-white'
    },
    'Minggu': {
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-600 to-red-700',
      text: 'text-white'
    }
  };

  // Untuk hari yang tidak aktif, gunakan warna lebih lembut
  const inactiveGradient = 'from-gray-100 to-gray-200';
  const inactiveHoverGradient = 'from-gray-200 to-gray-300';
  const inactiveText = 'text-gray-700';

  // Animasi untuk container hari
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07,
        delayChildren: 0.1
      } 
    }
  };

  // Animasi untuk setiap tombol hari
  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Animasi untuk hari yang dipilih
  const selectedIndicatorVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 w-full overflow-hidden">
      <div className="p-4 sm:p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Assignment Planner
          </h2>
          <div className="text-sm">
            <span className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-800 font-medium px-3 py-1.5 rounded-full inline-flex items-center border border-indigo-100">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              Hari ini: {todayName}
            </span>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-7 gap-2 md:gap-3 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {days.map((day) => {
            // Tentukan warna berdasarkan status (selected, today, atau default)
            const isSelected = selectedDay === day;
            const isToday = day === todayName;
            
            // Pilih gradien yang sesuai
            let gradientClass = isSelected 
              ? `bg-gradient-to-r ${dayColors[day].gradient}` 
              : isToday 
                ? `bg-gradient-to-r ${dayColors[day].gradient} opacity-70` 
                : `bg-gradient-to-r ${inactiveGradient}`;
                
            // Pilih warna teks yang sesuai
            let textClass = isSelected || isToday 
              ? dayColors[day].text 
              : inactiveText;
            
            let hoverClass = isSelected 
              ? '' 
              : `hover:bg-gradient-to-r ${isToday ? dayColors[day].hoverGradient : inactiveHoverGradient}`;
            
            return (
              <motion.div
                key={day}
                className="relative"
                variants={buttonVariants}
              >
                <motion.button
                  className={`w-full py-2.5 px-1 rounded-lg text-center transition-all duration-300 font-medium ${gradientClass} ${textClass} ${hoverClass} shadow-sm`}
                  onClick={() => onDayChange(day)}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  layoutId={`day-button-${day}`}
                >
                  {day}
                </motion.button>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={selectedIndicatorVariants}
                      layoutId={`selected-indicator-${day}`}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarHeader;