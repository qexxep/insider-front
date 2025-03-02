import { PaginationEllipsis, PaginationItem, PaginationLink } from '@/shared/ui';

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: React.ReactNode[] = [];
  const maxVisiblePages = 10; // 항상 10개 유지

  if (totalPages <= maxVisiblePages) {
    // 전체 페이지 수가 10 이하이면 그냥 다 보여줌
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={() => onPageChange(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    pages.push(
      <PaginationItem key={2}>
        <PaginationLink onClick={() => onPageChange(2)} isActive={currentPage === 2}>
          2
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 5) {
      pages.push(<PaginationEllipsis key="ellipsis-left" />);
    }

    let startPage = Math.max(3, currentPage - 2);
    let endPage = Math.min(totalPages - 2, currentPage + 2);

    // 항상 가운데 5개 유지
    if (currentPage <= 5) {
      startPage = 3;
      endPage = 7;
    } else if (currentPage >= totalPages - 4) {
      startPage = totalPages - 6;
      endPage = totalPages - 2;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 4) {
      pages.push(<PaginationEllipsis key="ellipsis-right" />);
    }

    pages.push(
      <PaginationItem key={totalPages - 1}>
        <PaginationLink onClick={() => onPageChange(totalPages - 1)} isActive={currentPage === totalPages - 1}>
          {totalPages - 1}
        </PaginationLink>
      </PaginationItem>
    );

    pages.push(
      <PaginationItem key={totalPages}>
        <PaginationLink onClick={() => onPageChange(totalPages)} isActive={currentPage === totalPages}>
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return pages;
};
