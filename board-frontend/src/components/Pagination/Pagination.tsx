import "./Pagination.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible);

        if (end - start < maxVisible) {
            start = Math.max(0, end - maxVisible);
        }

        for (let i = start; i < end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                이전
            </button>
            {getPageNumbers().map(page => (
                <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                다음
            </button>
        </div>
    );
}

export default Pagination;