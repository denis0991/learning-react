import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Details } from '../details.component';

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

const fetchMock = globalThis.fetch as Mock;
fetchMock.mockImplementation(() => Promise.resolve({} as Response));

interface MockAnimalData {
  animal: {
    name: string;
    earthAnimal: boolean | null;
    earthInsect: boolean | null;
    avian: boolean | null;
    canine: boolean | null;
    feline: boolean | null;
  };
}

const mockAnimalData: MockAnimalData = {
  animal: {
    name: 'Tiger',
    earthAnimal: true,
    earthInsect: false,
    avian: false,
    canine: false,
    feline: true,
  },
};

describe('Details Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ uid: 'test-123' });
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('page=2'),
      vi.fn(),
    ]);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Details />
      </BrowserRouter>
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
    fetchMock.mockImplementation(() => new Promise(() => {}));

    renderComponent();
    expect(screen.getByText('Animal Details')).toBeInTheDocument();
  });

  it('displays animal data', async () => {
    fetchMock.mockResolvedValue({
      json: async () => mockAnimalData,
    } as Response);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Tiger')).toBeInTheDocument();
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
    fetchMock.mockRejectedValue(new Error('Network error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Tiger')).not.toBeInTheDocument();
    });
  });

  it('does not make a request if uid is missing', () => {
    mockUseParams.mockReturnValue({ uid: undefined });

    renderComponent();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null if uid is missing', () => {
    mockUseParams.mockReturnValue({ uid: undefined });
    const { container } = renderComponent();

    expect(container.querySelector('.details-title')).not.toBeInTheDocument();
  });

  it('formats boolean values correctly', async () => {
    const nullData: MockAnimalData = {
      animal: {
        name: 'Unknown',
        earthAnimal: null,
        earthInsect: null,
        avian: true,
        canine: false,
        feline: null,
      },
    };

    fetchMock.mockResolvedValue({
      json: async () => nullData,
    } as Response);

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
    fetchMock.mockResolvedValue({
      json: async () => mockAnimalData,
    } as Response);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Tiger')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕ Close');
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
  });

  it('uses page=1 if the page parameter is missing', async () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(''), vi.fn()]);

    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      json: async () => mockAnimalData,
    } as Response);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Tiger')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕ Close');
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/?page=1');
  });

  it('displays all animal properties correctly', async () => {
    const fullAnimalData: MockAnimalData = {
      animal: {
        name: 'Wolf',
        earthAnimal: true,
        earthInsect: false,
        avian: false,
        canine: true,
        feline: false,
      },
    };

    fetchMock.mockResolvedValue({
      json: async () => fullAnimalData,
    } as Response);

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
    const fullAnimalData: MockAnimalData = {
      animal: {
        name: 'Wolf',
        earthAnimal: true,
        earthInsect: false,
        avian: false,
        canine: true,
        feline: false,
      },
    };

    fetchMock.mockResolvedValue({
      json: async () => fullAnimalData,
    } as Response);

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
