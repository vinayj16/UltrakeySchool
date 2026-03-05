import React from 'react';

// Define types locally to avoid import issues
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  return (
    <div className="data-table-container">
      {loading ? (
        <div className="table-loading">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} entries
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="page-number">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
            <select
              className="form-select form-select-sm"
              value={pagination.limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              style={{ width: 'auto', marginLeft: '10px' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
