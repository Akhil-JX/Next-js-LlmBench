'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ModelConfig {
  id: string;
  openAiModel: string;
  name: string;
  persona: string;
}

const OPENAI_MODELS = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
];

export default function CreateLLMBench() {
  const router = useRouter();
  const [benchName, setBenchName] = useState('');
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const addModel = () => {
    if (models.length < 5) {
      const newModel: ModelConfig = {
        id: Date.now().toString(),
        openAiModel: '',
        name: '',
        persona: '',
      };
      setModels([...models, newModel]);
    }
  };

  const removeModel = (id: string) => {
    setModels(models.filter(model => model.id !== id));
  };

  const updateModel = (id: string, field: keyof ModelConfig, value: string) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, [field]: value } : model
    ));
  };

  const handleCreateBench = async () => {
    if (!benchName.trim() || models.length === 0) {
      alert('Please provide a bench name and at least one model configuration.');
      return;
    }

    const incompleteModels = models.filter(model => 
      !model.openAiModel || !model.name.trim() || !model.persona.trim()
    );

    if (incompleteModels.length > 0) {
      alert('Please complete all model configurations (OpenAI Model, Name, and Persona are required).');
      return;
    }

    setIsCreating(true);

    try {
      const benchData = {
        id: Date.now().toString(),
        name: benchName,
        createdAt: new Date().toISOString(),
        models: models,
      };

      const response = await fetch('/api/benches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(benchData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to create bench');
      }
    } catch (error) {
      console.error('Error creating bench:', error);
      alert('Failed to create bench. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
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
              Create LLM Bench
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Bench Configuration</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bench Name *
              </label>
              <input
                type="text"
                value={benchName}
                onChange={(e) => setBenchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter bench name (e.g., 'Content Creation Bench')"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Model Configuration</h2>
              <button
                onClick={addModel}
                disabled={models.length >= 5}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  models.length >= 5
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Add Model ({models.length}/5)
              </button>
            </div>

            {models.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p>No models configured yet. Click "Add Model" to get started.</p>
              </div>
            )}

            <div className="space-y-6">
              {models.map((model, index) => (
                <div key={model.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Model {index + 1}
                    </h3>
                    <button
                      onClick={() => removeModel(model.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        OpenAI Model *
                      </label>
                      <select
                        value={model.openAiModel}
                        onChange={(e) => updateModel(model.id, 'openAiModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a model</option>
                        {OPENAI_MODELS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model Name *
                      </label>
                      <input
                        type="text"
                        value={model.name}
                        onChange={(e) => updateModel(model.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Creative Writer"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Persona *
                      </label>
                      <textarea
                        value={model.persona}
                        onChange={(e) => updateModel(model.id, 'persona', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="Describe the model's personality and behavior..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {models.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCreateBench}
                  disabled={isCreating || !benchName.trim()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isCreating || !benchName.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {isCreating ? 'Creating...' : 'Create Bench'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}