import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReactHookForm from '../ReactHookForm';
import { useFormStore } from '../../store/formStore';
import * as helpers from '../../utils/helpers';

vi.mock('../../store/formStore', () => ({
  useFormStore: vi.fn(),
}));

vi.mock('../../utils/helpers', () => ({
  fileToBase64: vi.fn(),
  validateImage: vi.fn(),
}));

vi.mock('../PasswordStrength', () => ({
  default: () => <div>PasswordStrength</div>,
}));

const addSubmission = vi.fn();
const onClose = vi.fn();

const mockStore = {
  addSubmission,
  countries: ['USA', 'Canada', 'Germany'],
  submissions: [],
  clearNewFlag: vi.fn(),
};

describe('ReactHookForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFormStore).mockImplementation((selector) =>
      selector(mockStore)
    );
  });

  test('renders form', () => {
    render(<ReactHookForm onClose={onClose} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('calls onClose on cancel', async () => {
    const user = userEvent.setup();

    render(<ReactHookForm onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('shows country suggestions', async () => {
    const user = userEvent.setup();

    render(<ReactHookForm onClose={onClose} />);

    await user.type(screen.getByLabelText(/country/i), 'ca');

    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  test('shows image validation error', async () => {
    const user = userEvent.setup();

    vi.mocked(helpers.validateImage).mockReturnValue({
      isValid: false,
      error: 'Invalid image',
    });

    render(<ReactHookForm onClose={onClose} />);

    const file = new File(['test'], 'test.png', {
      type: 'image/png',
    });

    await user.upload(screen.getByLabelText(/profile image/i), file);

    expect(await screen.findByText('Invalid image')).toBeInTheDocument();

    expect(helpers.fileToBase64).not.toHaveBeenCalled();
  });
});
