'use client';

import { Typography } from '@/components/ui/typography';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Clock, 
  Plus, 
  ArrowUpRight,
  Briefcase,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    title: 'Total Views',
    value: '24,532',
    change: '+12.5%',
    icon: Eye,
    color: 'text-blue-600',
    bg: 'bg-[var(--app-accent-soft-bg)]'
  },
  {
    title: 'Total Posts',
    value: '142',
    change: '+3.2%',
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-[var(--app-accent-soft-bg)]'
  },
  {
    title: 'Contact Requests',
    value: '12',
    change: '+8.4%',
    icon: MessageSquare,
    color: 'text-green-600',
    bg: 'bg-[var(--app-success-soft-bg)]'
  },
  {
    title: 'Newsletter Subs',
    value: '843',
    change: '+5.1%',
    icon: Mail,
    color: 'text-orange-600',
    bg: 'bg-[var(--app-warning-soft-bg)]'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h2">Overview</Typography>
          <Typography variant="muted">Welcome back! Here is a quick overview of your website.</Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Clock className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Tag variant="success" className="border-none bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.change}
                  </Tag>
                </div>
                <div className="mt-4">
                  <Typography variant="muted" className="text-xs font-medium uppercase tracking-wider">
                    {stat.title}
                  </Typography>
                  <div className="flex items-baseline gap-2">
                    <Typography variant="h3" className="mt-1 font-bold">
                      {stat.value}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <Typography variant="muted" className="text-xs">List of the latest updated articles.</Typography>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Migration to AdonisJS v6</TableCell>
                  <TableCell><Tag variant="success">Published</Tag></TableCell>
                  <TableCell className="hidden text-[var(--app-muted)] sm:table-cell">2026-04-23</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Next.js 15 Features</TableCell>
                  <TableCell><Tag variant="warning">Draft</Tag></TableCell>
                  <TableCell className="hidden text-[var(--app-muted)] sm:table-cell">2026-04-22</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tailwind CSS v4 Guide</TableCell>
                  <TableCell><Tag variant="success">Published</Tag></TableCell>
                  <TableCell className="hidden text-[var(--app-muted)] sm:table-cell">2026-04-20</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button variant="outline" className="w-full justify-start text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Write New Post
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Briefcase className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-[var(--app-card-inverse-bg)] text-[var(--app-card-inverse-fg)]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-[var(--app-card-inverse-fg)]">Tips for you</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography className="text-sm leading-relaxed text-[var(--app-card-inverse-muted)]">
                Optimize SEO by adding meta descriptions and keywords to each post to increase organic traffic.
              </Typography>
              <Button variant="link" className="text-indigo-400 p-0 h-auto mt-4 text-xs font-bold hover:text-indigo-300">
                Learn more
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
