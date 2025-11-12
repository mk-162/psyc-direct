'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back{user?.email && `, ${user.email.split('@')[0]}`}
        </h1>
        <p className="text-slate-600 mt-2">
          Here's an overview of your content projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Questions Generated</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Content Reviewed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription className="mt-2">
              Manage your content generation projects
            </CardDescription>
          </div>
          <Link href="/projects/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <FolderKanban className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No projects yet
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              Get started by creating your first project. Enter a website URL to begin generating AI-optimized content.
            </p>
            <Link href="/projects/new">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
