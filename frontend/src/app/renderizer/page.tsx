'use client';

import Image from "next/image";
import axios from 'axios';
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';
import { useRouter } from 'next/navigation';
import UpdateForm from "./update/[id]/page";
import BackButton from "@/components/BackButton";
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const availableModels = ['OPENAI', 'Ollama', 'Claude', 'DeepSeek', 'Gemini', 'Cursor'];

  const MODEL_TUPLES: [string, string][] = [
    ["OPENAI", "OP"],
    ["Ollama", "OL"],
    ["Claude", "CE"],
    ["DeepSeek", "DK"],
    ["Gemini", "GE"],
    ["Cursor", "CS"],
    ["StarCoder", "SC"],
    ["Unknown", "UN"]
  ];

  const getAbbreviation = (fullName: string): string => {
    const found = MODEL_TUPLES.find(([name]) => name === fullName);
    return found ? found[1] : fullName;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredInstances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredInstances.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  useEffect(() => {
    filterInstances();
  }, [instances, searchText, selectedModel]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchText, selectedModel]);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINT}api/v1/renderizer/`);
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
      await axios.delete(`${API_ENDPOINT}api/v1/renderizer/${id_instance}/`);
      toast.success('Instance deleted');
      location.reload();
    } catch {
      toast.error('delete failed');
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
    setCurrentPage(1);
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
              {filteredInstances.length > itemsPerPage && (
                <span className="pagination-info">
                  {' '}(Page {currentPage} of {totalPages})
                </span>
              )}
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
          <>
            <ul className="instances-list">
              {currentItems.map((instance) => (
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
                        title="Delete Instance"
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

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div style={{
                margin: '2rem 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                flexWrap: 'wrap'
              }}>
                {/* Showing info */}
                <div style={{
                  fontSize: '0.9rem',
                  color: 'black',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredInstances.length)} of {filteredInstances.length}
                </div>

                {/* Previous button */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    background: currentPage === 1 ? '#f9fafb' : 'white',
                    color: 'black',
                    borderRadius: '6px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: currentPage === 1 ? '0.5' : '1',
                    whiteSpace: 'nowrap'
                  }}
                  title="Previous page"
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flexWrap: 'wrap'
                }}>
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button
                        onClick={() => goToPage(1)}
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          color: 'black',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span style={{
                          padding: '0 0.5rem',
                          color: 'black',
                          fontWeight: '500'
                        }}>...</span>
                      )}
                    </>
                  )}

                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        border: currentPage === pageNumber ? '1px solid #3b82f6' : '1px solid #d1d5db',
                        background: currentPage === pageNumber ? '#3b82f6' : 'white',
                        color: currentPage === pageNumber ? 'white' : 'black',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNumber) {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.borderColor = '#9ca3af';
                        } else {
                          e.currentTarget.style.background = '#2563eb';
                          e.currentTarget.style.borderColor = '#2563eb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNumber) {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        } else {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span style={{
                          padding: '0 0.5rem',
                          color: 'black',
                          fontWeight: '500'
                        }}>...</span>
                      )}
                      <button
                        onClick={() => goToPage(totalPages)}
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          color: 'black',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    background: currentPage === totalPages ? '#f9fafb' : 'white',
                    color: 'black',
                    borderRadius: '6px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: currentPage === totalPages ? '0.5' : '1',
                    whiteSpace: 'nowrap'
                  }}
                  title="Next page"
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/renderizer" className="footer-link">
              Create New Instance
            </a>
            <a href="/gemini" className="footer-link">
              Ask Gemini
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
      {/* Para volver a la página anterior */}
      <BackButton />
    </div>
  );
}