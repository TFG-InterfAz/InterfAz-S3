'use client';
import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import '../../styles.css';
import Image from "next/image";

export default function CreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [html_code, setHtml_code] = useState('');
  const [ai, setAI] = useState('');
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("You must be logged in to view this page.");
      setShowForm(false);
      setTimeout(() => {
        router.push("/authentication/login");
      }, 5000);
    }
  }, []);

  // Generador de Gemini
  const handleGenerateWithGemini = async () => {
    if (!prompt) return toast.error("Prompt is mandatory");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/gemini_query/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Gemini");
      }

      const data = await response.json();
      setHtml_code(data.response || "");
      toast.success("Code generated successfully from Gemini");
    } catch (err) {
      console.error(err);
      toast.error("Error generating code from Gemini");
    }
  };

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
      await api.post("/api/v1/renderizer/", RenderizerData);
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
    <div className='main-form-container'>
      <ToastContainer />
      {/* Header */}
      <Image
        onClick={() => { router.push('/'); }}
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
              <button
                type="button"
                className="secondary-button"
                onClick={handleGenerateWithGemini}
              >
                Generate with Gemini
              </button>
            </div>

            <div className='form-group'>
              <label className='form-label'>HTML Code</label>
              <textarea
                value={html_code}
                placeholder='Write your HTML code or generate it'
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
                <option value="gemini">Gemini</option>
              </select>
            </div>

            <button type='submit' className='submit-button'>
              <span className='button-text'>Create Instance</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
