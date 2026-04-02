import { useState, useCallback } from 'react';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dropzone({ images, setImages, maxImages = 3 }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const processFiles = (files) => {
    setError('');
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setError('Please upload valid image files only.');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }

    // Convert to base64 for preview and simple upload
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [images.length, setImages, maxImages]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragActive 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary-500/30'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
          />
          <Upload className={`mb-3 transition-colors ${isDragActive ? 'text-primary-500' : 'text-zinc-500'}`} size={28} />
          <p className="text-sm font-medium text-zinc-300">
            {isDragActive ? 'Drop images here...' : 'Drag & drop images'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">or click to browse (Max {maxImages})</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {images.map((imgSrc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative rounded-xl overflow-hidden border border-white/10 group aspect-square bg-black"
              >
                <img src={imgSrc} alt={`preview ${index}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/90 backdrop-blur-md rounded-full text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
