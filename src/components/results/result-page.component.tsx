import { Search } from '../search/search.component';
import { Result } from './result.component';
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
      />
      <ErrorBoundary resetTrigger={props.errorResetTrigger}>
        <Result
          result={props.result}
          lackOfResult={props.lackOfResult}
          searchError={props.searchError}
        />
      </ErrorBoundary>
    </>
  );
}
