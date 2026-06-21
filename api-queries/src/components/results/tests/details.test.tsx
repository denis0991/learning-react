import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { Details } from '../details.component';
import { TestWrapper } from '../../../test-utils/test-wrapper';
import { useAnimalDetails } from '../../../hooks/useAnimalQueries';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useSearchParams: () => mockUseSearchParams(),
  };
});

vi.mock('../../../hooks/useAnimalQueries', () => ({
  useAnimalDetails: vi.fn(),
}));

describe('Details Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ uid: 'test-123' });
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('page=2'),
      vi.fn(),
    ]);
    (useAnimalDetails as Mock).mockReturnValue({
      data: {
        animal: {
          name: 'Lion',
          uid: 'test-123',
          avian: false,
          earthAnimal: true,
          feline: true,
          earthInsect: false,
          canine: false,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  const renderComponent = () => {
    return render(
      <TestWrapper>
        <Details />
      </TestWrapper>
    );
  };

  it('renderers the title Details', () => {
    renderComponent();
    expect(screen.getByText('Animal Details')).toBeInTheDocument();
  });

  it('renderers the title "Animal Details"', () => {
    renderComponent();
    expect(screen.getByText('Animal Details')).toBeInTheDocument();
  });

  it('renderers the close button', () => {
    renderComponent();
    expect(screen.getByText('✕ Close')).toBeInTheDocument();
  });

  it('renderers the loader during loading', () => {
    mockUseParams.mockReturnValue({ uid: 'test-123' });
    (useAnimalDetails as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();
    expect(screen.getByText('Loading animal details...')).toBeInTheDocument();
  });

  it('renderers the error message on error', () => {
    mockUseParams.mockReturnValue({ uid: 'test-123' });
    (useAnimalDetails as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: new Error('Network error'),
      refetch: vi.fn(),
    });
    renderComponent();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('displays animal data', async () => {
    (useAnimalDetails as Mock).mockReturnValue({
      data: {
        animal: {
          name: 'Lion',
          uid: 'test-123',
          avian: false,
          earthAnimal: true,
          feline: true,
          earthInsect: false,
          canine: false,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Lion')).toBeInTheDocument();
    });

    const yesElements = screen.getAllByText('yes');
    expect(yesElements[0]).toHaveTextContent('yes'); // Earth animal
    expect(yesElements[1]).toHaveTextContent('yes'); // Feline

    // Находим все элементы с текстом 'no'
    const noElements = screen.getAllByText('no');
    expect(noElements[0]).toHaveTextContent('no'); // Earth insect
    expect(noElements[1]).toHaveTextContent('no'); // Avian
    expect(noElements[2]).toHaveTextContent('no'); // Canine
  });

  it('handles error during loading', async () => {
    (useAnimalDetails as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: new Error('Network error'),
      refetch: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('returns null if uid is missing', () => {
    mockUseParams.mockReturnValue({ uid: undefined });
    (useAnimalDetails as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
    const { container } = renderComponent();

    expect(container.querySelector('.details-title')).not.toBeInTheDocument();
  });

  it('formats boolean values correctly', async () => {
    (useAnimalDetails as Mock).mockReturnValue({
      data: {
        animal: {
          name: 'Unknown',
          earthAnimal: null,
          earthInsect: null,
          avian: true,
          canine: false,
          feline: null,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    const values = document.querySelectorAll('.animal-properties');

    expect(values[0]).toHaveTextContent('unknown');
    expect(values[1]).toHaveTextContent('unknown');
    expect(values[2]).toHaveTextContent('yes');
    expect(values[3]).toHaveTextContent('no');
    expect(values[4]).toHaveTextContent('unknown');
  });

  it('navigates to the main page with the page parameter when Close is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Lion')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕ Close');
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
  });

  it('uses page=1 if the page parameter is missing', async () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(''), vi.fn()]);

    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Lion')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕ Close');
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/?page=1');
  });

  it('displays all animal properties correctly', async () => {
    (useAnimalDetails as Mock).mockReturnValue({
      data: {
        animal: {
          name: 'Wolf',
          earthAnimal: true,
          earthInsect: false,
          avian: false,
          canine: true,
          feline: false,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Wolf')).toBeInTheDocument();
    });

    const yesElements = screen.getAllByText('yes');
    expect(yesElements[0]).toHaveTextContent('yes'); // Earth animal
    expect(yesElements[1]).toHaveTextContent('yes'); // Canine

    const noElements = screen.getAllByText('no');
    expect(noElements[0]).toHaveTextContent('no'); // Earth insect
    expect(noElements[1]).toHaveTextContent('no'); // Avian
    expect(noElements[2]).toHaveTextContent('no'); // Feline
  });

  it('finds values through span class', async () => {
    (useAnimalDetails as Mock).mockReturnValue({
      data: {
        animal: {
          name: 'Wolf',
          earthAnimal: true,
          earthInsect: false,
          avian: false,
          canine: true,
          feline: false,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
    renderComponent();

    await waitFor(() => {
      const spans = document.querySelectorAll('.animal-properties');
      expect(spans[0]).toHaveTextContent('yes');
      expect(spans[1]).toHaveTextContent('no');
      expect(spans[2]).toHaveTextContent('no');
      expect(spans[3]).toHaveTextContent('yes');
      expect(spans[4]).toHaveTextContent('no');
    });
  });
});
