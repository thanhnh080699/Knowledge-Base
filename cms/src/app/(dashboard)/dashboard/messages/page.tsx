'use client';

import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2">Messages</Typography>
          <Typography variant="muted">View contact requests and newsletter subscriptions.</Typography>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-[var(--app-surface-muted)] p-4">
            <MessageSquare className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <Typography variant="h4">Inbox is empty</Typography>
            <Typography variant="muted">There are no new contact requests at the moment.</Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
