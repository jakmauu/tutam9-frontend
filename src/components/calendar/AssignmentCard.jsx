import { useState } from 'react';
import { motion } from 'framer-motion';

const AssignmentCard = ({ assignment, onDelete, onToggleComplete }) => {
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  
  const handleDelete = () => {
    if (isConfirmDelete) {
      onDelete(assignment._id);
      setIsConfirmDelete(false);
    } else {
      setIsConfirmDelete(true);
    }
  };
  
  const getTimeFrame = () => {
    return `${assignment.startTime} - ${assignment.endTime}`;
  };
  
  const getStatusColor = () => {
    if (assignment.isCompleted) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };
  
  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md border-l-4 ${assignment.isCompleted ? 'border-l-green-500' : 'border-l-primary-500'} overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className={`font-medium text-lg ${assignment.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {assignment.title}
              </h3>
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
                {assignment.isCompleted ? 'Selesai' : 'Belum selesai'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{assignment.subject}</p>
            {assignment.description && <p className="text-gray-500 text-sm mb-3">{assignment.description}</p>}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{getTimeFrame()}</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onToggleComplete(assignment._id, !assignment.isCompleted)}
              className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${assignment.isCompleted ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              title={assignment.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={handleDelete}
              className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${isConfirmDelete ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Delete assignment"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentCard;