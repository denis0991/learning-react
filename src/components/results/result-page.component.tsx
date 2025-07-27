import { Search } from '../search/search.component';
import { Result } from './result.component';
import { Pagination } from './pagination.component';
import { ErrorBoundary } from '../../error-boundary/error-boundary';
import type { ResultPageProps } from './result.types';

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
      <ErrorBoundary resetTrigger={props.errorResetTrigger}>
        <Result
          result={props.result}
          lackOfResult={props.lackOfResult}
          searchError={props.searchError}
        />
      </ErrorBoundary>
      {props.totalPages > 1 && (
        <Pagination
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          onPageChange={props.onPageChange}
        />
      )}
    </>
  );
}
