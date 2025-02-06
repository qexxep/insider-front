import Link from 'next/link';
import { useMemo } from 'react';
import { useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@/shared/ui';

import { CategoryItem } from '../api/categories';
import { CategoryIcon } from './CategoryIcon';

interface MenuSectionProps {
  title: string;
  categoryList: CategoryItem[];
  className?: string;
}

export function MenuSection({ title, categoryList, className }: MenuSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayItems = categoryList.map(category => ({
    href: `/board/${category.categoryCode.toLowerCase()}`,
    icon: <CategoryIcon categoryName={category.categoryName} />,
    label: category.categoryName,
  }));

  const INITIAL_DISPLAY_COUNT = 5;

  const visibleItems = useMemo(
    () => (showAll ? displayItems : displayItems.slice(0, INITIAL_DISPLAY_COUNT)),
    [showAll, displayItems]
  );

  return (
    <Accordion type="single" collapsible defaultValue="item-1" className={className}>
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="rounded-lg px-1 py-2 hover:bg-accent/50 hover:no-underline">
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="space-y-1">
            {visibleItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-1 py-2 text-sm hover:bg-accent"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          {displayItems.length > INITIAL_DISPLAY_COUNT && (
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg border-none px-1 py-2 text-sm font-semibold text-[#FF4200] hover:text-[#FF4200]"
              onClick={() => setShowAll(!showAll)}
            >
              <span>{showAll ? '접기' : '더보기'}</span>
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
