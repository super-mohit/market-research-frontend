import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ExternalLink, Upload, ChevronDown, ChevronUp, Tag, Globe } from 'lucide-react';
import { TextArea } from '../ui/TextArea';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { QueryFormData } from '../../types';

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
  const [formData, setFormData] = useState<QueryFormData>({
    query: initialData.query || '',
    searchTags: initialData.searchTags || [],
    trustedSources: initialData.trustedSources || [],
    uploadToRag: true,
  });

  const [newTag, setNewTag] = useState('');
  const [newSource, setNewSource] = useState('');
  const [showTags, setShowTags] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.query.trim()) return;
    onSubmit(formData);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="w-12 h-12 bg-lime-500 rounded-xl flex items-center justify-center mr-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-6 h-6 text-navy-900" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Supervity</h1>
              <p className="text-primary text-sm">Market Intelligence Platform</p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            What market intelligence do you need today?
          </motion.p>
        </div>

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

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add keyword..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag} 
                    variant="outline" 
                    size="md"
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
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

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add domain..."
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSource())}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addSource} 
                    variant="outline" 
                    size="md"
                    disabled={!newSource.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
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

            {/* Submit Button */}
            <div className="pt-4 border-t border-border">
              <Button
                type="submit"
                size="lg"
                disabled={!formData.query.trim()}
                isLoading={isLoading}
                className="w-full animate-pulse-lime"
              >
                Generate Intelligence Report
              </Button>
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
    </div>
  );
};