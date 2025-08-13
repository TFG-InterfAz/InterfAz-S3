'use client';
import { useEffect, useState } from 'react';
import api from '../app/lib/api';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import '../app/styles.css';

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
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("You must be logged in to view this page.");
      setShowForm(false);
      setTimeout(() => {
        router.push("/authentication/login");
      }, 5000);
      return; // stop here if not logged in
    }

    const fetchInstance = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/v1/renderizer/${id}/`);
        // Prevent null values from breaking controlled inputs
        setFormData({
          title: response.data.title ?? '',
          prompt: response.data.prompt ?? '',
          html_code: response.data.html_code ?? '',
          ai: response.data.ai ?? ''
        });
      } catch {
        toast.error('Failed to load instance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstance();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.prompt || !formData.html_code || !formData.ai) {
      toast.error('Please complete all fields');
      return;
    }
    try {
      setIsLoading(true);
      await api.patch(`/api/v1/renderizer/${id}/`, formData);
      toast.success('Instance updated');
      router.push('/renderizer');
    } catch {
      toast.error('Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      {showForm && (
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
                <option value="OP">OPENAI</option>
                <option value="OL">Ollama</option>
                <option value="CE">Claude</option>
                <option value="GE">Gemini</option>
                <option value="DK">DeepSeek</option>
                <option value="CS">Cursor</option>
                <option value="SC">StarCoder</option>
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
      )}
    </div>
  );
}
