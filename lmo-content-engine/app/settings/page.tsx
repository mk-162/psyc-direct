'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, CreditCard, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoGenerateContent, setAutoGenerateContent] = useState(true);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your personal account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Email Address
              </label>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <Input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                User ID
              </label>
              <Input 
                type="text" 
                value={user?.uid || ''} 
                disabled 
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-slate-900">Current Plan</p>
                <p className="text-sm text-slate-600">Free plan with basic features</p>
              </div>
              <Badge variant="secondary">Free</Badge>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-700">✓ Up to 3 projects</p>
              <p className="text-sm text-slate-700">✓ 100 questions per month</p>
              <p className="text-sm text-slate-700">✓ Basic AI features</p>
            </div>
            <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700" disabled>
              Upgrade Plan (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive updates about your projects</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Auto-generate Content</p>
                <p className="text-sm text-slate-600">Automatically generate questions for new projects</p>
              </div>
              <button
                onClick={() => setAutoGenerateContent(!autoGenerateContent)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoGenerateContent ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoGenerateContent ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">Password</p>
                  <p className="text-sm text-slate-600">••••••••</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure your AI provider API keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                OpenAI API Key
              </label>
              <Input 
                type="password" 
                placeholder="sk-..." 
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Used for content generation and analysis
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Perplexity API Key
              </label>
              <Input 
                type="password" 
                placeholder="pplx-..." 
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Used for research and fact-checking
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Save API Keys
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

