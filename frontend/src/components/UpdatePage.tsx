'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import '../app/styles.css';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface Props {
  id: string;
}

export default function UpdatePage({ id }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    html_code: '',
    ai: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInstance = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_ENDPOINT}Renderizer/${id}/`);
        setFormData(response.data);
      } catch {
        toast.error('Failed to load instance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstance();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.prompt || !formData.html_code || !formData.ai) {
      toast.error('Please complete all fields');
      return;
    }
    try {
      setIsLoading(true);
      await axios.patch(`${API_ENDPOINT}Renderizer/${id}/`, formData);
      toast.success('Instance updated');
      router.push('/renderizer');
    } catch {
      toast.error('Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

   return (
    <div className='main-form-container'>
      <ToastContainer />
      <Image
        onClick={() => router.push('/')}
        className="logo-clickable"
        src="/logo-interfaz.svg"
        alt="interfaz.js logo"
        width={280}
        height={58}
        priority
      />

      <div className='form-wrapper'>
        <form onSubmit={handleSubmit} className='volunteer-form'>
          <div className='form-header-inner'>
            <h2 className='form-title'>Update Instance</h2>
            <p className='form-description'>Update your instance details</p>
          </div>

          <div className='form-group'>
            <label className='form-label'>Title</label>
            <input
              name="title"
              value={formData.title}
              type="text"
              placeholder="Write a title"
              className='form-input'
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Prompt</label>
            <textarea
              name="prompt"
              value={formData.prompt}
              placeholder="Write a prompt"
              className='form-textarea'
              rows={4}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>HTML Code</label>
            <textarea
              name="html_code"
              value={formData.html_code}
              placeholder="Write your HTML code"
              className='form-textarea code-textarea'
              rows={6}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>AI Model</label>
            <select
              name="ai"
              value={formData.ai}
              className='form-select'
              onChange={handleChange}
            >
              <option value="">Select an AI model</option>
              <option value="gpt-4">OPENAI</option>
              <option value="gpt-3.5-turbo">Ollama</option>
              <option value="claude">Claude</option>
              <option value="gemini">DeepSeek</option>
              <option value="cursor">Cursor</option>
            </select>
          </div>

          <button 
            type='submit' 
            className='submit-button'
            disabled={isLoading}
          >
            <span className='button-text'>
              {isLoading ? 'Updating...' : 'Update Instance'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
