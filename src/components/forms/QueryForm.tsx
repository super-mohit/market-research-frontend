import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ExternalLink, ChevronDown, ChevronUp, Tag, Globe, Trash2 } from 'lucide-react';
import { TextArea } from '../ui/TextArea';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { QueryFormData } from '../../types';

const FORM_DRAFT_KEY = 'researchFormDraft';

interface QueryFormProps {
  onSubmit: (data: QueryFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<QueryFormData>;
}

export const QueryForm: React.FC<QueryFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
}) => {
  // Load saved draft on component mount
  const getSavedDraft = (): Partial<QueryFormData> => {
    try {
      const saved = localStorage.getItem(FORM_DRAFT_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to load form draft from localStorage:', error);
      return {};
    }
  };

  const savedDraft = getSavedDraft();
  const [formData, setFormData] = useState<QueryFormData>({
    query: initialData.query || savedDraft.query || '',
    searchTags: initialData.searchTags || savedDraft.searchTags || [],
    trustedSources: initialData.trustedSources || savedDraft.trustedSources || [],
    uploadToRag: initialData.uploadToRag ?? savedDraft.uploadToRag ?? true,
  });

  const [newTag, setNewTag] = useState('');
  const [newSource, setNewSource] = useState('');
  const [showTags, setShowTags] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Check if there's a meaningful draft
  useEffect(() => {
    const isDraftMeaningful = 
      formData.query.trim().length > 0 || 
      formData.searchTags.length > 0 || 
      formData.trustedSources.length > 0;
    setHasDraft(isDraftMeaningful);
  }, [formData]);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(formData));
      } catch (error) {
        console.warn('Failed to save form draft to localStorage:', error);
      }
    }, 500); // Debounce saves

    return () => clearTimeout(saveTimeout);
  }, [formData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (formData.query.trim() && !isLoading) {
          handleSubmit(e as any);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData.query, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.query.trim()) return;
    
    // Clear the draft after successful submission
    try {
      localStorage.removeItem(FORM_DRAFT_KEY);
    } catch (error) {
      console.warn('Failed to clear form draft:', error);
    }
    
    onSubmit(formData);
  };

  const clearDraft = () => {
    const emptyData: QueryFormData = {
      query: '',
      searchTags: [],
      trustedSources: [],
      uploadToRag: true,
    };
    setFormData(emptyData);
    setNewTag('');
    setNewSource('');
    try {
      localStorage.removeItem(FORM_DRAFT_KEY);
    } catch (error) {
      console.warn('Failed to clear form draft:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.searchTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        searchTags: [...prev.searchTags, newTag.trim()]
      }));
      setNewTag('');
      setShowTags(true);
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      searchTags: prev.searchTags.filter(t => t !== tag)
    }));
  };

  const addSource = () => {
    if (newSource.trim() && !formData.trustedSources.includes(newSource.trim())) {
      setFormData(prev => ({
        ...prev,
        trustedSources: [...prev.trustedSources, newSource.trim()]
      }));
      setNewSource('');
      setShowSources(true);
    }
  };

  const removeSource = (source: string) => {
    setFormData(prev => ({
      ...prev,
      trustedSources: prev.trustedSources.filter(s => s !== source)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="card p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Query */}
          <div>
            <TextArea
              label="Research Objective"
              placeholder="Describe what you want to research... (e.g., 'Analyze the competitive landscape for sustainable coatings in the automotive industry')"
              value={formData.query}
              onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
              rows={4}
              charLimit={2000}
              hint="Be as specific as possible to get the most relevant insights"
            />
          </div>

          {/* Keywords and Sources Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keywords Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-lime-500" />
                <label className="text-sm font-medium text-muted-foreground">
                  Targeted Keywords
                </label>
                {formData.searchTags.length > 0 && (
                  <span className="text-xs bg-lime-500/10 text-lime-700 px-2 py-1 rounded-full">
                    {formData.searchTags.length}
                  </span>
                )}
              </div>

              <div className="relative">
                <Input
                  placeholder="Add keyword..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-lime-600 hover:bg-lime-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Added Keywords - Collapsible */}
              {formData.searchTags.length > 0 && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowTags(!showTags)}
                    className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showTags ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    <span>{showTags ? 'Hide' : 'Show'} added keywords ({formData.searchTags.length})</span>
                  </button>

                  <AnimatePresence>
                    {showTags && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin"
                      >
                        <div className="flex flex-wrap gap-2">
                          {formData.searchTags.map((tag) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="inline-flex items-center bg-lime-500/10 text-lime-700 px-3 py-1 rounded-full text-sm border border-lime-500/20 group"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 opacity-60 hover:opacity-100 hover:text-lime-600 transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Focus your research with specific terms
              </p>
            </div>

            {/* Trusted Sources Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-soft" />
                <label className="text-sm font-medium text-muted-foreground">
                  Trusted Sources
                </label>
                {formData.trustedSources.length > 0 && (
                  <span className="text-xs bg-blue-soft/10 text-blue-soft px-2 py-1 rounded-full">
                    {formData.trustedSources.length}
                  </span>
                )}
              </div>

              <div className="relative">
                <Input
                  placeholder="Add domain..."
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSource())}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={addSource}
                  disabled={!newSource.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Added Sources - Collapsible */}
              {formData.trustedSources.length > 0 && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowSources(!showSources)}
                    className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showSources ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    <span>{showSources ? 'Hide' : 'Show'} added sources ({formData.trustedSources.length})</span>
                  </button>

                  <AnimatePresence>
                    {showSources && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin"
                      >
                        <div className="space-y-2">
                          {formData.trustedSources.map((source) => (
                            <motion.div
                              key={source}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center justify-between bg-blue-soft/10 border border-blue-soft/20 rounded-lg px-3 py-2 group"
                            >
                              <div className="flex items-center space-x-2 text-sm text-blue-soft">
                                <ExternalLink className="w-3 h-3" />
                                <span>{source}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSource(source)}
                                className="opacity-60 hover:opacity-100 hover:text-coral transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Prioritize specific domains for reliability
              </p>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-4 border-t border-border space-y-4">
            {/* Draft Status & Clear Button */}
            {hasDraft && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-amber-700">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium">Draft saved automatically</span>
                </div>
                <button
                  type="button"
                  onClick={clearDraft}
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                size="lg"
                disabled={!formData.query.trim()}
                isLoading={isLoading}
                className="w-full animate-pulse-lime"
              >
                Generate Intelligence Report
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">Enter</kbd> to submit
              </p>
            </div>
          </div>
        </form>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8 text-muted-foreground text-sm"
      >
        Powered by Supervity AI research agents • Secure & confidential
      </motion.div>
    </motion.div>
  );
};