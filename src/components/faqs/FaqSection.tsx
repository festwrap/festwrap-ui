'use client';
import { ChevronDown } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';

// Helper function to parse markdown links and render as JSX
const parseMarkdownLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {match[1]}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

export default function FAQSection() {
  const { t } = useTranslation('faq');

  // Get questions array from translations with proper fallback
  const questionsData = t('questions', {}, { returnObjects: true });
  const questions = Array.isArray(questionsData) ? questionsData : [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      <div className="space-y-4">
        {questions.map((faq: any, index: number) => (
          <Collapsible key={index} className="group">
            <div className="rounded-lg border bg-card">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/50">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="border-t px-6 pb-6 pt-4">
                  <div className="text-muted-foreground leading-relaxed">
                    {faq.answer
                      .split('\n')
                      .map((line: string, lineIndex: number) => (
                        <div key={lineIndex}>
                          {line.startsWith('- ') ? (
                            <div className="ml-4 flex items-start">
                              <span className="mr-3 mt-2 h-2 w-2 rounded-full bg-muted-foreground flex-shrink-0" />
                              <span className="flex-1">
                                - {parseMarkdownLinks(line.substring(2))}
                              </span>
                            </div>
                          ) : (
                            <div>{parseMarkdownLinks(line)}</div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
