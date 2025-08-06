import { Search } from '../search/search.component';
import { Result } from './result.component';
import { Pagination } from './pagination.component';
import { ErrorBoundary } from '../../error-boundary/error-boundary';
import { Outlet } from 'react-router-dom';
import type { ResultPageProps } from './result.types';
import './result-page.css';

export function ResultPage(props: ResultPageProps) {
  return (
    <>
      <Search
        setStatus={props.setStatus}
        status={props.status}
        setError={props.setError}
        setSearchError={props.setSearchError}
        setSearchState={props.setSearchState}
        currentPage={props.currentPage}
        onPageChange={props.onPageChange}
      />
      <div className="result-page">
        <div className="card-list">
          <ErrorBoundary resetTrigger={props.errorResetTrigger}>
            <Result
              result={props.result}
              lackOfResult={props.lackOfResult}
              searchError={props.searchError}
              searchParams={props.searchParams}
            />
          </ErrorBoundary>
          {props.totalPages > 1 && (
            <Pagination
              currentPage={props.currentPage}
              totalPages={props.totalPages}
              onPageChange={props.onPageChange}
            />
          )}
        </div>
        <div className="card-details-container">
          <Outlet />
        </div>
      </div>
    </>
  );
}
