import { Button } from "react-bootstrap";

const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                ← Previous
            </Button>
            <span className="text-muted">
                Page {page} of {totalPages}
            </span>
            <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next →
            </Button>
        </div>
    );
};

export default Pagination;