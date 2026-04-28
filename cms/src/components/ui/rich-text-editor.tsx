'use client';

import { useThemeStore } from '@/stores/theme';
import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

declare global {
  interface Window {
    tinymce: any;
  }
}

export function RichTextEditor({ value, onChange, height = 500, placeholder }: RichTextEditorProps) {
  const theme = useThemeStore((state) => state.theme);
  const [isDark, setIsDark] = useState(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLTextAreaElement>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'dark') {
        setIsDark(true);
      } else if (theme === 'light') {
        setIsDark(false);
      } else {
        setIsDark(mediaQuery.matches);
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  useEffect(() => {
    const scriptId = 'tinymce-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initEditor = () => {
      if (!window.tinymce || !containerRef.current || isInitializing.current) return;
      
      // If editor already exists, remove it first to avoid duplicates or issues on re-init
      if (editorRef.current) {
        window.tinymce.remove(editorRef.current);
        editorRef.current = null;
      }

      isInitializing.current = true;

      window.tinymce.init({
        target: containerRef.current,
        base_url: '/libs/tinymce',
        suffix: '.min',
        height,
        placeholder,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media table link | code fullscreen',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            font-size: 16px; 
            line-height: 1.6;
            color: ${isDark ? '#e5e7eb' : '#374151'};
            background-color: ${isDark ? '#111827' : '#ffffff'};
          }
        `,
        skin: isDark ? 'oxide-dark' : 'oxide',
        content_css: isDark ? 'dark' : 'default',
        branding: false,
        promotion: false,
        license_key: 'gpl', // Assuming GPL for local version if no key
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on('change keyup', () => {
            onChange(editor.getContent());
          });
        },
        init_instance_callback: (editor: any) => {
          isInitializing.current = false;
          if (value) {
            editor.setContent(value);
          }
        }
      });
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = '/libs/tinymce/tinymce.min.js';
      script.onload = initEditor;
      document.head.appendChild(script);
    } else if (window.tinymce) {
      initEditor();
    }

    return () => {
      if (editorRef.current) {
        window.tinymce?.remove(editorRef.current);
        editorRef.current = null;
      }
    };
  }, [isDark, height, placeholder]);

  // Update content if changed from outside, but only if it's actually different
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value]);

  return (
    <div key={isDark ? 'dark' : 'light'} className="rich-text-editor rounded-md border border-[var(--app-border)] overflow-hidden">
      <textarea ref={containerRef} style={{ visibility: 'hidden', height: 0 }} />
    </div>
  );
}
