'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import '../../styles.css';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function VolunteerForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [html_code, setHtml_code] = useState('');
  const [ai, setAI] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) return toast.error('Title is mandatory');
    if (!prompt) return toast.error('Prompt is mandatory');
    if (!html_code) return toast.error('Code is mandatory');
    if (!ai) return toast.error('You must select a model');

    const RenderizerData = new FormData();
    RenderizerData.append('title', title);
    RenderizerData.append('prompt', prompt);
    RenderizerData.append('code', html_code);
    RenderizerData.append('model', ai);

    try {
      await axios.post(`${API_ENDPOINT}Renderizer/`, RenderizerData);
      toast.success('Instance created successfully');
      router.push('/renderizer');
    } catch (error: any) {
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          toast.error(`${value}`);
        });
      } else {
        toast.error('Error creating the instance');
      }
    }
  };

  return (
    <div className='app-container'>
      <ToastContainer />
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit} className='volunteer-form'>
          <div className='form-header'>
            <h2 className='form-title'>Instance Creation</h2>
            <p className='form-description'>Please fill this form in order to create a new instance</p>
          </div>

          <div className='form-group'>
            <label className='form-label'>Title</label>
            <input
              value={title}
              type='text'
              placeholder='Write a title'
              className='form-input'
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Prompt</label>
            <textarea
              value={prompt}
              placeholder='Write a prompt'
              className='form-textarea'
              rows={4}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>HTML Code</label>
            <textarea
              value={html_code}
              placeholder='Write your HTML code'
              className='form-textarea code-textarea'
              rows={6}
              onChange={(e) => setHtml_code(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>AI Model</label>
            <select
              value={ai}
              className='form-select'
              onChange={(e) => setAI(e.target.value)}
            >
              <option value="">Select an AI model</option>
              <option value="gpt-4">OPENAI</option>
              <option value="gpt-3.5-turbo">Ollama</option>
              <option value="claude">Claude</option>
              <option value="gemini">DeepSeek</option>
              <option value="gemini">Cursor</option>
            </select>
          </div>

          <button type='submit' className='submit-button'>
            <span className='button-text'>Create Instance</span>
          </button>
        </form>
      </div>
    </div>
  );
}