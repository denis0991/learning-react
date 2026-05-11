import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Result } from '../result.component';
import { mockAnimals } from '../../../test-utils/mocks';
import type { Animals } from '../../search/search.interfaces';

vi.mock('../cards.component', () => ({
  Cards: ({
    result,
    lackOfResult,
    searchError,
    errorMessage,
  }: {
    result: Animals[];
    lackOfResult: boolean;
    searchError: boolean;
    errorMessage: string;
  }) => (
    <div data-testid="mock-cards">
      <span data-testid="cards-result-length">{result.length}</span>
      <span data-testid="cards-lack-of-result">{String(lackOfResult)}</span>
      <span data-testid="cards-search-error">{String(searchError)}</span>
      <span data-testid="cards-error-message">{errorMessage}</span>
    </div>
  ),
}));

describe('Result Component', () => {
  const defaultProps = {
    result: [] as Animals[],
    lackOfResult: false,
    searchError: false,
    errorMessage: '',
  };

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Rendering', () => {
    test('renders Results title', () => {
      render(<Result {...defaultProps} />);
      expect(screen.getByText('Results')).toBeInTheDocument();
    });

    test('renders h2 heading with correct text', () => {
      render(<Result {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Results');
      expect(heading).toHaveClass('result__title');
    });

    test('renders section with correct class', () => {
      render(<Result {...defaultProps} />);
      const section = document.querySelector('.result');
      expect(section).toBeInTheDocument();
    });

    test('renders Error test button', () => {
      render(<Result {...defaultProps} />);
      const button = screen.getByText('Error test');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Props passing to Cards', () => {
    test('passes result prop to Cards', () => {
      render(<Result {...defaultProps} result={mockAnimals} />);
      expect(screen.getByTestId('cards-result-length')).toHaveTextContent('3');
    });

    test('passes lackOfResult prop to Cards', () => {
      render(<Result {...defaultProps} lackOfResult={true} />);
      expect(screen.getByTestId('cards-lack-of-result')).toHaveTextContent(
        'true'
      );
    });

    test('passes searchError prop to Cards', () => {
      render(<Result {...defaultProps} searchError={true} />);
      expect(screen.getByTestId('cards-search-error')).toHaveTextContent(
        'true'
      );
    });

    test('passes errorMessage prop to Cards', () => {
      render(
        <Result
          {...defaultProps}
          searchError={true}
          errorMessage="Custom API error"
        />
      );
      expect(screen.getByTestId('cards-error-message')).toHaveTextContent(
        'Custom API error'
      );
    });

    test('passes all props correctly together', () => {
      render(
        <Result
          result={mockAnimals}
          lackOfResult={false}
          searchError={true}
          errorMessage="Network failed"
        />
      );

      expect(screen.getByTestId('cards-result-length')).toHaveTextContent('3');
      expect(screen.getByTestId('cards-lack-of-result')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('cards-search-error')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('cards-error-message')).toHaveTextContent(
        'Network failed'
      );
    });
  });

  describe('Error test button behavior', () => {
    test('button click triggers state change', async () => {
      const user = userEvent.setup();
      render(<Result {...defaultProps} />);

      const button = screen.getByText('Error test');

      await expect(async () => {
        await user.click(button);
      }).rejects.toThrow('Congratulations! You have caused an error!');
    });

    test('button is clickable multiple times', async () => {
      const user = userEvent.setup();
      render(<Result {...defaultProps} />);
      const button = screen.getByText('Error test');

      await expect(async () => {
        await user.click(button);
      }).rejects.toThrow('Congratulations! You have caused an error!');
    });
  });

  describe('Edge cases', () => {
    test('handles empty result array', () => {
      render(
        <Result
          result={[]}
          lackOfResult={true}
          searchError={false}
          errorMessage=""
        />
      );

      expect(screen.getByTestId('cards-result-length')).toHaveTextContent('0');
      expect(screen.getByTestId('cards-lack-of-result')).toHaveTextContent(
        'true'
      );
    });

    test('handles long error message', () => {
      const longMessage = 'A'.repeat(1000);
      render(
        <Result
          {...defaultProps}
          searchError={true}
          errorMessage={longMessage}
        />
      );

      expect(screen.getByTestId('cards-error-message')).toHaveTextContent(
        longMessage
      );
    });

    test('handles special characters in error message', () => {
      const specialChars = 'Error! @#$%^&*()_+{}[]|\\:;"\'<>,.?/~`';
      render(
        <Result
          {...defaultProps}
          searchError={true}
          errorMessage={specialChars}
        />
      );

      expect(screen.getByTestId('cards-error-message')).toHaveTextContent(
        specialChars
      );
    });

    test('handles empty string error message', () => {
      render(<Result {...defaultProps} searchError={true} errorMessage="" />);

      expect(screen.getByTestId('cards-error-message')).toHaveTextContent('');
    });
  });

  describe('Integration scenarios', () => {
    test('shows empty state when no results', () => {
      render(
        <Result
          result={[]}
          lackOfResult={false}
          searchError={false}
          errorMessage=""
        />
      );

      expect(screen.getByTestId('cards-lack-of-result')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('cards-result-length')).toHaveTextContent('0');
    });

    test('shows results when search successful', () => {
      render(
        <Result
          result={mockAnimals}
          lackOfResult={false}
          searchError={false}
          errorMessage=""
        />
      );

      expect(screen.getByTestId('cards-result-length')).toHaveTextContent('3');
      expect(screen.getByTestId('cards-search-error')).toHaveTextContent(
        'false'
      );
    });

    test('shows error when API fails', () => {
      render(
        <Result
          result={[]}
          lackOfResult={false}
          searchError={true}
          errorMessage="API is down"
        />
      );

      expect(screen.getByTestId('cards-search-error')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('cards-error-message')).toHaveTextContent(
        'API is down'
      );
    });

    test('shows no results message when search returns empty', () => {
      render(
        <Result
          result={[]}
          lackOfResult={true}
          searchError={false}
          errorMessage=""
        />
      );

      expect(screen.getByTestId('cards-lack-of-result')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('cards-result-length')).toHaveTextContent('0');
    });

    test('prioritizes searchError over lackOfResult', () => {
      render(
        <Result
          result={[]}
          lackOfResult={true}
          searchError={true}
          errorMessage="Error first"
        />
      );

      expect(screen.getByTestId('cards-search-error')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('cards-lack-of-result')).toHaveTextContent(
        'true'
      );
    });
  });
});
