'use client';

import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2">Posts</Typography>
          <Typography variant="muted">Manage all articles on the website.</Typography>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post List</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-[var(--app-surface-muted)] p-4">
            <Plus className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <Typography variant="h4">No posts found</Typography>
            <Typography variant="muted">Start by creating your first post.</Typography>
          </div>
          <Button variant="outline">View Documentation</Button>
        </CardContent>
      </Card>
    </div>
  );
}
