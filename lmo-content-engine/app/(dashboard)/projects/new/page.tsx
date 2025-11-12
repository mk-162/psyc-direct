'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Globe, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { validateUrl, extractDomain, normalizeUrl } from '@/lib/utils/url';
import { useAuth } from '@/lib/hooks/use-auth';

export default function NewProjectPage() {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setValidationError(null);
    setIsValid(false);

    if (value.length > 8) {
      const normalized = normalizeUrl(value);
      const valid = validateUrl(normalized);

      if (!valid) {
        setValidationError('Please enter a valid URL (e.g., https://example.com)');
      } else {
        setIsValid(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationError || !url || !isValid) return;

    setIsCreating(true);

    try {
      const normalizedUrl = normalizeUrl(url);
      const domain = extractDomain(normalizedUrl);

      // TODO: Call API to create project
      console.log('Creating project for:', {
        url: normalizedUrl,
        domain,
        ownerId: user?.uid,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Navigate to project page
      router.push('/');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Project
          </h1>
          <p className="text-slate-600 mt-2">
            Enter your website URL to start generating AI-optimized content
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Information</CardTitle>
            <CardDescription>
              We'll analyze your website to discover content opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium text-slate-900">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={`pl-10 ${
                      validationError
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : isValid
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : ''
                    }`}
                    disabled={isCreating}
                  />
                  {isValid && !validationError && (
                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                  )}
                  {validationError && (
                    <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                  )}
                </div>
                {validationError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {validationError}
                  </div>
                )}
                {isValid && !validationError && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Valid URL - Ready to create project
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-slate-900 mb-3">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-medium flex-shrink-0">
                      1
                    </span>
                    <span>AI analyzes your website content and structure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-medium flex-shrink-0">
                      2
                    </span>
                    <span>Generates 5-10 relevant content categories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-medium flex-shrink-0">
                      3
                    </span>
                    <span>You explore and expand topics of interest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-medium flex-shrink-0">
                      4
                    </span>
                    <span>AI generates Q&A content for review</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isCreating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !isValid || !!validationError || !url}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    'Start Research'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Research Process</p>
              <p className="text-blue-700">
                The initial research typically takes 20-30 seconds. You'll be able to track progress
                and see categories as they're discovered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
