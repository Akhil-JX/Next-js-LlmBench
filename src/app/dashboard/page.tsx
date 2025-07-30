'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ModelConfig {
  id: string;
  openAiModel: string;
  name: string;
  persona: string;
}

interface Bench {
  id: string;
  name: string;
  createdAt: string;
  models: ModelConfig[];
}

const MODEL_INFO = {
  'gpt-4': { fullName: 'GPT-4', builtOn: 'Transformer Architecture', company: 'OpenAI' },
  'gpt-4-turbo': { fullName: 'GPT-4 Turbo', builtOn: 'Transformer Architecture', company: 'OpenAI' },
  'gpt-3.5-turbo': { fullName: 'GPT-3.5 Turbo', builtOn: 'Transformer Architecture', company: 'OpenAI' },
  'gpt-4o': { fullName: 'GPT-4o', builtOn: 'Transformer Architecture', company: 'OpenAI' },
  'gpt-4o-mini': { fullName: 'GPT-4o Mini', builtOn: 'Transformer Architecture', company: 'OpenAI' },
};

export default function Dashboard() {
  const [benches, setBenches] = useState<Bench[]>([]);
  const [selectedBench, setSelectedBench] = useState<Bench | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  useEffect(() => {
    fetchBenches();
  }, []);

  const fetchBenches = async () => {
    try {
      const response = await fetch('/api/benches');
      if (response.ok) {
        const data = await response.json();
        setBenches(data);
        if (data.length > 0) {
          setSelectedBench(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching benches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModelInfo = (openAiModel: string) => {
    return MODEL_INFO[openAiModel as keyof typeof MODEL_INFO] || {
      fullName: openAiModel,
      builtOn: 'Unknown',
      company: 'OpenAI'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading benches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          {benches.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">No Benches Found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You haven't created any LLM benches yet. Get started by creating your first bench.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Bench
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Bench
                </label>
                <select
                  value={selectedBench?.id || ''}
                  onChange={(e) => {
                    const bench = benches.find(b => b.id === e.target.value);
                    setSelectedBench(bench || null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-lg"
                >
                  {benches.map((bench) => (
                    <option key={bench.id} value={bench.id}>
                      {bench.name} ({bench.models.length} models)
                    </option>
                  ))}
                </select>
              </div>

              {selectedBench && (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                      {selectedBench.name}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Created On</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{formatDate(selectedBench.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Number of Models</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{selectedBench.models.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-800 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Model Configuration</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedBench.models.map((model, index) => {
                        const modelInfo = getModelInfo(model.openAiModel);
                        const isHovered = hoveredModel === model.id;
                        return (
                          <div
                            key={model.id}
                            className={`relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border border-indigo-200 dark:border-gray-500 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
                              isHovered 
                                ? 'transform scale-105 shadow-2xl border-indigo-400 dark:border-indigo-300 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-600 dark:to-gray-500' 
                                : 'hover:shadow-lg hover:scale-102'
                            }`}
                            onMouseEnter={() => setHoveredModel(model.id)}
                            onMouseLeave={() => setHoveredModel(null)}
                          >
                            {/* Gradient top border */}
                            <div className={`h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ${
                              isHovered ? 'h-2' : 'h-1'
                            }`}></div>
                            
                            <div className="p-6">
                              {/* Header Section */}
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                                  isHovered ? 'w-16 h-16' : 'w-12 h-12'
                                }`}>
                                  <svg className={`text-white transition-all duration-300 ${
                                    isHovered ? 'w-8 h-8' : 'w-6 h-6'
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-semibold text-gray-800 dark:text-white transition-all duration-300 ${
                                    isHovered ? 'text-lg' : 'text-base'
                                  }`}>{model.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <p className={`text-indigo-600 dark:text-indigo-400 transition-all duration-300 ${
                                      isHovered ? 'text-base font-medium' : 'text-sm'
                                    }`}>{modelInfo.fullName}</p>
                                    {isHovered && (
                                      <div className="flex items-center gap-1 animate-in fade-in-50 duration-300">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Model number badge */}
                                <div className={`bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                                  isHovered ? 'w-10 h-10' : 'w-8 h-8'
                                }`}>
                                  <span className={`text-white font-bold transition-all duration-300 ${
                                    isHovered ? 'text-sm' : 'text-xs'
                                  }`}>{index + 1}</span>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className={`transition-all duration-500 ease-in-out ${
                                isHovered ? 'h-auto opacity-100' : 'h-auto opacity-100'
                              }`}>
                                {!isHovered ? (
                                  // Default view - Persona
                                  <div className="space-y-3">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">
                                      {model.persona}
                                    </p>
                                    <div className="flex items-center justify-between pt-2">
                                      {/*<span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
                                        Hover for details
                                      </span>
                                      <svg className="w-4 h-4 text-indigo-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>*/}
                                    </div>
                                  </div>
                                ) : (
                                  // Hovered view - Technical details
                                  <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                                    <div className="grid grid-cols-1 gap-3">
                                      <div className="bg-white/60 dark:bg-gray-600/40 rounded-lg p-3 backdrop-blur-sm border border-indigo-100 dark:border-gray-500">
                                        <div className="flex items-center gap-2 mb-1">
                                          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                          </svg>
                                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">GPT Model</span>
                                        </div>
                                        <p className="font-bold text-indigo-600 dark:text-indigo-400">{modelInfo.fullName}</p>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        {/*<div className="bg-white/60 dark:bg-gray-600/40 rounded-lg p-3 backdrop-blur-sm border border-purple-100 dark:border-gray-500">
                                          <div className="flex items-center gap-1 mb-1">
                                            <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            <span className="text-2xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Architecture</span>
                                          </div>
                                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{modelInfo.builtOn}</p>
                                        </div>*/}

                                        <div className="bg-white/60 dark:bg-gray-600/40 rounded-lg p-3 backdrop-blur-sm border border-cyan-100 dark:border-gray-500">
                                          <div className="flex items-center gap-1 mb-1">
                                            <svg className="w-3 h-3 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="text-2xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Provider</span>
                                          </div>
                                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{modelInfo.company}</p>
                                        </div>
                                      </div>

                                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-600/50 dark:to-gray-500/50 rounded-lg p-3 border border-indigo-200 dark:border-gray-400">
                                        <div className="flex items-center gap-2 mb-2">
                                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                          </svg>
                                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Persona</span>
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-2">
                                          {model.persona}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}