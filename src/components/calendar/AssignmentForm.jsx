import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AssignmentForm = ({ day, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    startTime: '',
    endTime: '',
    isCompleted: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul tugas diperlukan';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Mata kuliah diperlukan';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Waktu mulai diperlukan';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'Waktu selesai diperlukan';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'Waktu selesai harus setelah waktu mulai';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({ ...formData, day });
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        subject: '',
        startTime: '',
        endTime: '',
        isCompleted: false
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tambah Assignment Baru</h3>
        <span className="badge px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
          {day}
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            id="title"
            name="title"
            label="Judul Tugas"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul tugas"
            error={errors.title}
          />
          
          <Input
            id="subject"
            name="subject"
            label="Mata Kuliah"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Masukkan mata kuliah"
            error={errors.subject}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi (Opsional)
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tambahkan deskripsi atau catatan..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            id="startTime"
            name="startTime"
            label="Waktu Mulai"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            error={errors.startTime}
          />
          
          <Input
            id="endTime"
            name="endTime"
            label="Waktu Selesai"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
            error={errors.endTime}
          />
        </div>
        
        <div className="flex items-center mb-4">
          <input
            id="isCompleted"
            name="isCompleted"
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            checked={formData.isCompleted}
            onChange={handleChange}
          />
          <label htmlFor="isCompleted" className="ml-2 text-sm text-gray-700">
            Sudah selesai
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="light"
            onClick={onCancel}
            className="hover:text-indigo-700" // Tetap konsisten dengan tema
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
          >
            Simpan Assignment
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssignmentForm;