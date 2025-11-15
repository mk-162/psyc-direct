'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
  Settings as SettingsIcon
} from 'lucide-react';

interface ProjectSettings {
  brandVoice: 'professional' | 'casual' | 'technical' | 'friendly';
  contentDepth: 'concise' | 'detailed' | 'comprehensive';
  factCheckThreshold: number;
  autoGenerateQuestions: boolean;
}

interface Project {
  id: string;
  name: string;
  settings: ProjectSettings;
}

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<ProjectSettings>({
    brandVoice: 'professional',
    contentDepth: 'detailed',
    factCheckThreshold: 0.8,
    autoGenerateQuestions: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId && user) {
      fetchProject();
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch project');
      }

      setProject(data.project);
      setSettings(data.project.settings);
    } catch (error: any) {
      console.error('Failed to fetch project:', error);
      setError(error.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      // Navigate back to project detail page
      router.push(`/projects/${projectId}`);
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      setError(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/projects/${projectId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {error || 'Project not found'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Unable to load project settings.
              </p>
              <Button onClick={() => router.push(`/projects/${projectId}`)}>
                Back to Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-slate-900">Project Settings</h1>
        </div>
        <p className="text-slate-600">
          Configure content generation settings for {project?.name}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Settings Form */}
      <div className="max-w-2xl space-y-6">
        {/* Brand Voice */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Voice</CardTitle>
            <CardDescription>
              Define the tone and style of generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {(['professional', 'casual', 'technical', 'friendly'] as const).map((voice) => (
                <button
                  key={voice}
                  onClick={() => setSettings({ ...settings, brandVoice: voice })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    settings.brandVoice === voice
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-slate-900 capitalize">{voice}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {voice === 'professional' && 'Formal and business-oriented'}
                    {voice === 'casual' && 'Relaxed and conversational'}
                    {voice === 'technical' && 'Detailed and precise'}
                    {voice === 'friendly' && 'Warm and approachable'}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Depth */}
        <Card>
          <CardHeader>
            <CardTitle>Content Depth</CardTitle>
            <CardDescription>
              Control the level of detail in generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(['concise', 'detailed', 'comprehensive'] as const).map((depth) => (
                <button
                  key={depth}
                  onClick={() => setSettings({ ...settings, contentDepth: depth })}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    settings.contentDepth === depth
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-slate-900 capitalize">{depth}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {depth === 'concise' && 'Brief answers'}
                    {depth === 'detailed' && 'Balanced depth'}
                    {depth === 'comprehensive' && 'In-depth coverage'}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fact Check Threshold */}
        <Card>
          <CardHeader>
            <CardTitle>Fact Check Threshold</CardTitle>
            <CardDescription>
              Minimum confidence level for AI-generated facts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="threshold" className="text-sm font-medium text-slate-700">
                  Confidence Level: {(settings.factCheckThreshold * 100).toFixed(0)}%
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, factCheckThreshold: 0.7 })}
                    className={`px-3 py-1 text-xs rounded ${
                      settings.factCheckThreshold === 0.7
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    70%
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, factCheckThreshold: 0.8 })}
                    className={`px-3 py-1 text-xs rounded ${
                      settings.factCheckThreshold === 0.8
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    80%
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, factCheckThreshold: 0.9 })}
                    className={`px-3 py-1 text-xs rounded ${
                      settings.factCheckThreshold === 0.9
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    90%
                  </button>
                </div>
              </div>
              <input
                id="threshold"
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={settings.factCheckThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, factCheckThreshold: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-xs text-slate-600">
                Higher thresholds require more reliable sources and stronger evidence
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Auto-generate Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-generate Questions</CardTitle>
            <CardDescription>
              Automatically generate questions for new categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 mb-1">
                  When enabled, questions will be generated automatically when you create new categories
                </p>
                <p className="text-xs text-slate-500">
                  You can still manually generate questions when disabled
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, autoGenerateQuestions: !settings.autoGenerateQuestions })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoGenerateQuestions ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoGenerateQuestions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 flex-1"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}`)}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
