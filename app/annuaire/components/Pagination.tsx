"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Link href={getPageUrl(currentPage - 1)}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Précédent
        </Button>
      </Link>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </span>

      <Link href={getPageUrl(currentPage + 1)}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
