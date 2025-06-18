'use client';

import Image from "next/image";
import axios from 'axios';
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';
import { useRouter } from 'next/navigation';
import UpdateForm from "./update/[id]/page";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface RenderInstance {
  id: number;
  title: string;
  prompt: string;
  html_code: string;
  ai: string;
  created_at?: string;
}

export default function Home() {
  const router = useRouter();
  const [instances, setInstances] = useState<RenderInstance[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<RenderInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const availableModels = ['OPENAI', 'Ollama', 'Claude', 'DeepSeek', 'Cursor'];

  const MODEL_TUPLES: [string, string][] = [
    ["OPENAI", "OP"],
    ["Ollama", "OL"],
    ["Claude", "CE"],
    ["DeepSeek", "DK"],
    ["Cursor", "CS"],
    ["StarCoder", "SC"],
    ["Unknown", "UN"]
  ];
  const getAbbreviation = (fullName: string): string => {
    const found = MODEL_TUPLES.find(([name]) => name === fullName);
    return found ? found[1] : fullName; // Si no se encuentra, devolver el original
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  useEffect(() => {
    filterInstances();
  }, [instances, searchText, selectedModel]);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINT}Renderizer/`);
      setInstances(response.data);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast.error('Error loading instances');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_instance: number) => {
    try {
      await axios.delete(`${API_ENDPOINT}Renderizer/${id_instance}/`);
      toast.success('Instance deleted');
      location.reload();
    } catch {
      toast.error('delete  failed');
    } 
  };

  const filterInstances = () => {
    let filtered = [...instances];

    if (searchText) {
      filtered = filtered.filter(instance =>
        instance.title.toLowerCase().includes(searchText.toLowerCase()) ||
        instance.prompt.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedModel) {
      const modelAbbreviation = getAbbreviation(selectedModel);
      filtered = filtered.filter(instance => instance.ai === modelAbbreviation);
    }

    setFilteredInstances(filtered);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedModel('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModelColor = (model: string) => {
    const colors: { [key: string]: string } = {
      'OPENAI': 'model-gpt4',
      'Claude': 'model-claude',
      'DeepSeek': 'model-gemini',
      'Cursor': 'model-default',
      'Ollama': 'model-default'
    };
    return colors[model] || 'model-default';
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  const previewCode = (htmlCode: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="home-container">
      <ToastContainer />

      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <Image
            onClick={() => { router.push('/'); }}
            className="logo"
            src="/logo-interfaz.svg"
            alt="interfaz.js logo"
            width={280}
            height={58}
            priority
          />
          <h1 className="page-title">InterfAz - Render Instances</h1>
          <p className="page-subtitle">Manage and filter your AI-generated HTML components</p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              placeholder="Search by title or prompt..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">AI Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="filter-select"
            >
              <option value="">All Models</option>
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
            <div className="results-count">
              {filteredInstances.length} of {instances.length} instances
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading instances...</p>
          </div>
        ) : filteredInstances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No instances found</h3>
            <p>Try adjusting your filters or create a new instance</p>
          </div>
        ) : (
          <ul className="instances-list">
            {filteredInstances.map((instance) => (
              <li key={instance.id} className="instance-item">
                <div className="instance-header">
                  <h3 className="instance-title">{instance.title}</h3>
                  <span className={`model-badge ${getModelColor(instance.ai)}`}>
                    {instance.ai}
                  </span>
                </div>

                <div className="instance-content">
                  <div className="instance-info">
                    <p className="instance-prompt">
                      <strong>Prompt:</strong> {truncateText(instance.prompt, 150)}
                    </p>
                    <div className="instance-meta">
                      <span className="instance-id">ID: {instance.id}</span>
                      {instance.created_at && (
                        <span className="instance-date">{formatDate(instance.created_at)}</span>
                      )}
                    </div>
                  </div>

                  <div className="instance-actions">
                    <button
                      onClick={() => previewCode(instance.html_code)}
                      className="preview-btn"
                      title="Preview HTML"
                    >
                      👁️ Preview
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(instance.html_code)}
                      className="copy-btn"
                      title="Copy HTML Code"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => router.push(`/renderizer/update/${instance.id}`)}
                      className="copy-btn"
                      title="Update Instance"
                    >
                      ✏️ Update
                    </button>

                    <button
                      onClick={() => handleDelete(instance.id)}
                      className="copy-btn"
                      title="Copy HTML Code"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <details className="code-details">
                  <summary className="code-summary">View HTML Code</summary>
                  <pre className="code-block">
                    <code>{instance.html_code}</code>
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/renderizer" className="footer-link">
              Create New Instance
            </a>
            <a href="https://github.com/TFG-InterfAz" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub
            </a>
          </div>
          <p className="footer-text">
            InterfAz - AI-powered HTML generation tool
          </p>
        </div>
      </footer>
    </div>
  );
}
