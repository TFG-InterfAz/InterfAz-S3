'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

//const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const API_ENDPOINT = "http://localhost:8000/";
console.log("API_ENDPOINT:", API_ENDPOINT);

export default function GeminiPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('You must be logged in to use Gemini');
      setTimeout(() => {
        router.push('/authentication/login');
      }, 2000);
    }
  }, [router]);

  const handleAskGemini = async () => {
    if (!query.trim()) {
      toast.error('Please enter a question.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINT}api/gemini_query/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      if (!res.ok) throw new Error('Failed to fetch from Gemini API');
      const data = await res.json();
      setResponse(data.response || 'No response received.');
    } catch (err) {
      console.error(err);
      toast.error('Error contacting Gemini');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-form-container">
      <ToastContainer />
      <div className="form-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="form-title">Ask Gemini</h2>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask your question here..."
          className="form-textarea"
          rows={4}
          style={{ width: '80%' }}
        />

        <button
          className="submit-button"
          style={{ marginTop: '10px', width: '200px' }}
          onClick={handleAskGemini}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask Gemini'}
        </button>

        {response && (
          <div className="form-group" style={{ marginTop: '20px', width: '80%' }}>
            <label className="form-label">Gemini's Response</label>
            <textarea
              value={response}
              readOnly
              className="form-textarea code-textarea"
              rows={8}
            />
          </div>
        )}
      </div>
    </div>
  );
}
