'use client';
import { ChevronDown } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';
import { Button } from '../ui/Button';

export default function FAQSection() {
  const { t } = useTranslation('faq');

  // Get questions array from translations with proper fallback
  const questionsData = t('questions', {}, { returnObjects: true });
  const questions = Array.isArray(questionsData) ? questionsData : [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
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
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 p-6 text-center">
        <h3 className="text-lg font-semibold">
          {t('stillHaveQuestions.title')}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {t('stillHaveQuestions.description')}
        </p>
        <Button className="mt-4" asChild>
          <a href="mailto:festwrap@gmail.com">
            {t('stillHaveQuestions.button')}
          </a>
        </Button>
      </div>
    </div>
  );
}
