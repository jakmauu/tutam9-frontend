import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import CalendarHeader from '../components/calendar/CalendarHeader';
import AssignmentCard from '../components/calendar/AssignmentCard';
import AssignmentForm from '../components/calendar/AssignmentForm';
import Button from '../components/ui/Button';
import { getAssignmentsByDay, createAssignment, updateAssignment, deleteAssignment } from '../services/api';

const Calendar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [selectedDay, setSelectedDay] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousDay, setPreviousDay] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Set default day to today
  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    setSelectedDay(days[dayIndex]);
    setPreviousDay(days[dayIndex]);
  }, []);
  
  // Fetch assignments when selected day changes
  useEffect(() => {
    if (selectedDay) {
      fetchAssignments();
    }
  }, [selectedDay]);
  
  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await getAssignmentsByDay(selectedDay);
      setAssignments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDayChange = (day) => {
    setPreviousDay(selectedDay); // Store previous day for animation direction
    setSelectedDay(day);
  };
  
  const handleCreateAssignment = async (assignmentData) => {
    try {
      const newAssignment = await createAssignment(assignmentData);
      setAssignments([...assignments, newAssignment]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating assignment:', err);
      return Promise.reject(err);
    }
  };
  
  const handleToggleComplete = async (id, isCompleted) => {
    try {
      const updated = await updateAssignment(id, { isCompleted });
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === id ? { ...assignment, isCompleted } : assignment
        )
      );
    } catch (err) {
      console.error('Error updating assignment:', err);
    }
  };
  
  const handleDeleteAssignment = async (id) => {
    try {
      await deleteAssignment(id);
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
    } catch (err) {
      console.error('Error deleting assignment:', err);
    }
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };
  
  // Determine animation direction based on day order
  const getAnimationDirection = () => {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const prevIndex = days.indexOf(previousDay);
    const currIndex = days.indexOf(selectedDay);
    
    if (prevIndex < currIndex) return 1; // Moving forward
    if (prevIndex > currIndex) return -1; // Moving backward
    return 0; // Same day or default
  };
  
  // Animation variants for day content
  const dayContentVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction * 50, // Slide in from left or right
      scale: 0.95
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction * -50, // Slide out to opposite direction
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    })
  };
  
  // Group assignments by morning, afternoon, and evening
  const groupedAssignments = assignments.reduce(
    (groups, assignment) => {
      const hour = parseInt(assignment.startTime.split(':')[0], 10);
      if (hour < 12) {
        groups.morning.push(assignment);
      } else if (hour < 17) {
        groups.afternoon.push(assignment);
      } else {
        groups.evening.push(assignment);
      }
      return groups;
    },
    { morning: [], afternoon: [], evening: [] }
  );
  
  // Sort assignments within each group by start time
  Object.keys(groupedAssignments).forEach((key) => {
    groupedAssignments[key].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });
  
  // Staggered animation for time groups
  const timeGroupsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const timeGroupItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };
  
  // Function to render time groups with staggered animations
  const renderTimeGroup = (title, assignments, icon, index) => (
    <motion.div 
      className="mb-8"
      variants={timeGroupItemVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 mr-2">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <span className="ml-2 text-sm text-gray-500">({assignments.length} activities)</span>
      </div>
      
      {assignments.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-100 shadow-sm text-gray-500">
          No assignments scheduled
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment, i) => (
            <AssignmentCard
              key={assignment._id || i}
              assignment={assignment}
              onDelete={handleDeleteAssignment}
              onToggleComplete={handleToggleComplete}
              animationDelay={i * 0.05} // Staggered delay for each card
            />
          ))}
        </div>
      )}
    </motion.div>
  );
  
  // Get animation direction
  const direction = getAnimationDirection();
  
  // Improve sign out menu with attractive colors
  const userMenuVariants = {
    hidden: { opacity: 0, scale: 0.85, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.85, 
      y: -20,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      }
    }
  };

  // Smooth page transition animations when switching days
  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction * 100, // Slide in based on direction
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction * -100, // Exit in opposite direction
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    })
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar - Full Width with gradient */}
      <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">AT</span>
              <span className="ml-2 text-lg font-medium">Assignment Tracker</span>
            </div>
            
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span className="text-white/90">
                    Welcome, <span className="font-medium">{currentUser.username}</span>
                  </span>
                </div>
                
                <div className="relative">
                  <button 
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white font-medium border border-white/50 hover:bg-white/40 transition-all">
                      {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div 
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-white ring-opacity-5 z-10"
                        variants={userMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{currentUser.username}</p>
                          <p className="text-xs text-gray-500 mt-1">Logged in</p>
                        </div>
                        
                        {/* Tombol Sign Out dengan warna yang lebih menarik */}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 transition-all group"
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            <span className="font-medium">Sign Out</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content - Takes remaining height with full width */}
      <main className="flex-grow flex flex-col md:flex-row w-full">
        {/* Sidebar - left side on desktop */}
        <div className="md:w-64 lg:w-80 bg-white shadow-md border-r border-gray-200 md:block">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Assignment Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Total Assignments</span>
                <span className="font-medium text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                  {assignments.length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Completed</span>
                <span className="font-medium text-green-700 bg-white px-3 py-1 rounded-full shadow-sm">
                  {assignments.filter(a => a.isCompleted).length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Pending</span>
                <span className="font-medium text-yellow-700 bg-white px-3 py-1 rounded-full shadow-sm">
                  {assignments.filter(a => !a.isCompleted).length}
                </span>
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-800">
                    {assignments.length > 0 
                      ? Math.round((assignments.filter(a => a.isCompleted).length / assignments.length) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ 
                      width: `${assignments.length > 0 
                        ? (assignments.filter(a => a.isCompleted).length / assignments.length) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Expanded to fill available space */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <CalendarHeader selectedDay={selectedDay} onDayChange={handleDayChange} />
          
          <motion.div 
            key={`day-header-${selectedDay}`}
            className="flex justify-between items-center mb-6 mt-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="w-2 h-10 bg-indigo-600 rounded-sm mr-3"></span>
              {selectedDay}
            </h2>
            {/* Update tombol Add Assignment */}
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "light" : "primary"}
              size="sm"
              className={showForm ? "" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"}
            >
              {showForm ? 'Cancel' : '+ Add Assignment'}
            </Button>
          </motion.div>
          
          <AnimatePresence>
            {showForm && (
              <AssignmentForm
                day={selectedDay}
                onSubmit={handleCreateAssignment}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`day-content-${selectedDay}`}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {isLoading ? (
                <motion.div 
                  className="flex flex-col justify-center items-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                  <p className="mt-4 text-gray-500">Loading your assignments...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  className="bg-red-50 p-4 rounded-md border border-red-100 text-red-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
                    </svg>
                    <p>{error}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    variants={timeGroupsContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {renderTimeGroup(
                      'Morning',
                      groupedAssignments.morning,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>,
                      0
                    )}
                    
                    {renderTimeGroup(
                      'Afternoon',
                      groupedAssignments.afternoon,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>,
                      1
                    )}
                    
                    {renderTimeGroup(
                      'Evening',
                      groupedAssignments.evening,
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                      </svg>,
                      2
                    )}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-4">
        <div className="w-full px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().toLocaleTimeString()} Assignment Tracker • Built with React & TailwindCSS
        </div>
      </footer>
    </div>
  );
};

export default Calendar;