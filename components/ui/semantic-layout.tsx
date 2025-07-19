import React from 'react';
import { cn } from '@/lib/utils';

interface SemanticLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function SemanticMain({ children, className }: SemanticLayoutProps) {
  return (
    <main className={cn('', className)} role="main">
      {children}
    </main>
  );
}

export function SemanticSection({ children, className }: SemanticLayoutProps) {
  return (
    <section className={cn('', className)}>
      {children}
    </section>
  );
}

export function SemanticHeader({ children, className }: SemanticLayoutProps) {
  return (
    <header className={cn('', className)}>
      {children}
    </header>
  );
}

export function SemanticArticle({ children, className }: SemanticLayoutProps) {
  return (
    <article className={cn('', className)}>
      {children}
    </article>
  );
}

export function SemanticAside({ children, className }: SemanticLayoutProps) {
  return (
    <aside className={cn('', className)}>
      {children}
    </aside>
  );
}

export function SemanticNav({ children, className }: SemanticLayoutProps) {
  return (
    <nav className={cn('', className)} role="navigation">
      {children}
    </nav>
  );
}