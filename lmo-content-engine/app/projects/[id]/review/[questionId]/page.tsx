'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Edit3,
  Save
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { marked } from 'marked';

interface Question {
  id: string;
  question: string;
  searchIntent: string;
  targetKeywords: string[];
  status: string;
}

interface Draft {
  id: string;
  type: 'short' | 'long';
  content: string;
  wordCount: number;
  status: string;
}

export default function ReviewEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const projectId = params.id as string;
  const questionId = params.questionId as string;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start editing the content...',
      }),
    ],
    content: '',
    editable: true,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0 prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-strong:font-semibold prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-slate-700 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-img:rounded-lg prose-img:shadow-md',
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save could be added here
    },
  });

  useEffect(() => {
    if (projectId && questionId && user) {
      fetchData();
    }
  }, [projectId, questionId, user]);

  useEffect(() => {
    if (selectedDraft && editor) {
      // Convert markdown to HTML
      const htmlContent = marked.parse(selectedDraft.content) as string;
      editor.commands.setContent(htmlContent);
      // Keep editor always editable for proper rendering
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDraft?.id, editor]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'a' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleAccept();
      } else if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleReject();
      } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleEdit();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (isEditing) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditing, selectedDraft]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      // Fetch question
      const questionResponse = await fetch(`/api/projects/${projectId}/questions`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      const questionData = await questionResponse.json();
      if (!questionResponse.ok) {
        throw new Error(questionData.error || 'Failed to fetch question');
      }

      const foundQuestion = questionData.questions.find((q: any) => q.id === questionId);
      if (!foundQuestion) {
        throw new Error('Question not found');
      }

      setQuestion(foundQuestion);

      // Fetch drafts
      const draftsResponse = await fetch(`/api/questions/${questionId}/drafts`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      const draftsData = await draftsResponse.json();
      if (!draftsResponse.ok) {
        throw new Error(draftsData.error || 'Failed to fetch drafts');
      }

      setDrafts(draftsData.drafts || []);

      // Select long draft by default, or first draft
      const defaultDraft = draftsData.drafts.find((d: Draft) => d.type === 'long') || draftsData.drafts[0];
      if (defaultDraft) {
        setSelectedDraft(defaultDraft);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError(error.message || 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!editor || !selectedDraft) return;

    try {
      setSaving(true);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const content = editor.getHTML();

      const response = await fetch(`/api/drafts/${selectedDraft.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save changes');
      }

      // Update local state
      setSelectedDraft({
        ...selectedDraft,
        content,
        wordCount: data.wordCount,
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to save:', error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedDraft || accepting) return;

    try {
      setAccepting(true);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/drafts/${selectedDraft.id}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept draft');
      }

      // Navigate back to review dashboard
      router.push(`/projects/${projectId}/review`);
    } catch (error: any) {
      console.error('Failed to accept:', error);
      alert(`Failed to accept draft: ${error.message}`);
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDraft || rejecting) return;

    const reason = prompt('Why are you rejecting this draft? (optional)');

    try {
      setRejecting(true);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/drafts/${selectedDraft.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason || '' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject draft');
      }

      // Navigate back to review dashboard
      router.push(`/projects/${projectId}/review`);
    } catch (error: any) {
      console.error('Failed to reject:', error);
      alert(`Failed to reject draft: ${error.message}`);
    } finally {
      setRejecting(false);
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

  if (error || !question || !selectedDraft) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/projects/${projectId}/review`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Review Dashboard
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {error || 'Content not found'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Unable to load the content for review.
              </p>
              <Button onClick={() => router.push(`/projects/${projectId}/review`)}>
                Back to Review Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/projects/${projectId}/review`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{question.question}</h1>
              <div className="flex gap-2 mt-1">
                {question.targetKeywords.slice(0, 3).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Draft selector */}
          <div className="flex items-center gap-2">
            {drafts.map((draft) => (
              <Button
                key={draft.id}
                variant={selectedDraft?.id === draft.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDraft(draft)}
              >
                {draft.type === 'short' ? 'Short' : 'Long'} ({draft.wordCount}w)
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden bg-white">
        <div className="flex-1 flex flex-col">
          <div className="border-b p-3 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                {isEditing ? 'Editing' : 'Formatted View'}
              </span>
              <Badge variant="outline" className="text-xs">
                {selectedDraft.wordCount} words
              </Badge>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button size="sm" variant="outline" onClick={toggleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit (E)
                </Button>
              ) : (
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save (Ctrl+Enter)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 bg-slate-50">
            <div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8 transition-all ${
              isEditing ? 'border-teal-300 ring-2 ring-teal-100' : 'border-slate-200'
            }`}>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-sm text-slate-600">
            Keyboard shortcuts: <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">A</kbd> Accept •
            <kbd className="px-2 py-1 bg-slate-100 rounded text-xs ml-1">R</kbd> Reject •
            <kbd className="px-2 py-1 bg-slate-100 rounded text-xs ml-1">E</kbd> Edit
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={rejecting || accepting || isEditing}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              {rejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject (R)
                </>
              )}
            </Button>

            <Button
              onClick={handleAccept}
              disabled={accepting || rejecting || isEditing}
              className="bg-green-600 hover:bg-green-700"
            >
              {accepting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept (A)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
