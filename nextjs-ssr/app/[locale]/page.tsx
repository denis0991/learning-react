'use client';

import { Header } from '@/components/header/header.component';
import { Search } from '@/components/search/search.component';
import { Result } from '@/components/results/result.component';
import { SelectionPanel } from '@/components/selectionComponents/selectionPanel.component';
import { SelectionActions } from '@/components/selectionComponents/selectionActions.component';
import { useAnimalStore } from '@/stores/useAnimalStore';

export default function HomePage() {
  const {
    inputValue,
    setInputValue,
    status,
    setStatus,
    setSearchState,
    setSearchError,
    setErrorMessage,
    errorMessage,
    resetPage,
    setLackOfResult,
    result,
    currentPage,
    totalPages,
  } = useAnimalStore();

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  return (
    <div>
      <Header />
      <main>
        <Search
          setSearchState={setSearchState}
          setStatus={setStatus}
          setInputValue={setInputValue}
          status={status}
          value={inputValue}
          setError={setLackOfResult}
          setSearchError={setSearchError}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          resetPage={resetPage}
          onSearch={handleSearch}
        />
        <Result
          result={result}
          status={status}
          lackOfResult={result.length === 0}
          searchError={false}
          errorMessage=""
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={() => {}}
          onRetry={() => {}}
        />
        <SelectionPanel />
        <SelectionActions />
      </main>
    </div>
  );
}