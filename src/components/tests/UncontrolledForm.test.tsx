import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UncontrolledForm from '../UncontrolledForm';
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
  submissions: [],
  countries: ['USA', 'Canada', 'Germany'],
  addSubmission,
  clearNewFlag: vi.fn(),
};

const fillValidForm = async () => {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/name/i), 'John');

  await user.type(screen.getByLabelText('Age *'), '30');

  await user.type(screen.getByLabelText(/email/i), 'john@test.com');

  await user.selectOptions(screen.getByLabelText(/gender/i), 'male');

  await user.type(screen.getByLabelText(/^password/i), 'Password1!');

  await user.type(screen.getByLabelText(/confirm password/i), 'Password1!');

  await user.type(screen.getByLabelText(/country/i), 'USA');

  await user.click(screen.getByLabelText(/terms and conditions/i));
};

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFormStore).mockImplementation((selector) =>
      selector(mockStore)
    );
  });

  test('renders form', () => {
    render(<UncontrolledForm onClose={onClose} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /submit/i,
      })
    ).toBeInTheDocument();
  });

  test('calls onClose when cancel clicked', async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm onClose={onClose} />);

    await user.click(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('shows country suggestions', async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm onClose={onClose} />);

    await user.type(screen.getByLabelText(/country/i), 'ca');

    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  test('selects country from suggestions', async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm onClose={onClose} />);

    const countryInput = screen.getByLabelText(/country/i);

    await user.type(countryInput, 'ca');

    await user.click(screen.getByText('Canada'));

    expect(countryInput).toHaveValue('Canada');
  });

  test('shows preview for valid image', async () => {
    const user = userEvent.setup();

    vi.mocked(helpers.validateImage).mockReturnValue({
      isValid: true,
    });

    vi.mocked(helpers.fileToBase64).mockResolvedValue(
      'data:image/png;base64,test'
    );

    render(<UncontrolledForm onClose={onClose} />);

    const file = new File(['image'], 'test.png', {
      type: 'image/png',
    });

    await user.upload(screen.getByLabelText(/profile image/i), file);

    expect(await screen.findByAltText('Preview')).toBeInTheDocument();
  });

  test('handles invalid image', async () => {
    const user = userEvent.setup();

    vi.mocked(helpers.validateImage).mockReturnValue({
      isValid: false,
      error: 'Invalid image',
    });

    render(<UncontrolledForm onClose={onClose} />);

    const file = new File(['image'], 'test.png', {
      type: 'image/png',
    });

    await user.upload(screen.getByLabelText(/profile image/i), file);

    expect(helpers.fileToBase64).not.toHaveBeenCalled();
  });

  test('submits valid form', async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm onClose={onClose} />);

    await fillValidForm();

    await user.click(
      screen.getByRole('button', {
        name: /submit/i,
      })
    );

    await waitFor(() => {
      expect(addSubmission).toHaveBeenCalled();
    });

    expect(onClose).toHaveBeenCalled();
  });

  test('shows password mismatch error', async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm onClose={onClose} />);

    await user.type(screen.getByLabelText('Name *'), 'John');

    await user.type(screen.getByLabelText('Age *'), '30');

    await user.type(screen.getByLabelText('Email *'), 'john@test.com');

    await user.selectOptions(screen.getByLabelText('Gender *'), 'male');

    await user.type(screen.getByLabelText('Password *'), 'Password1!');

    await user.type(screen.getByLabelText('Confirm Password *'), 'Password2!');

    await user.type(screen.getByLabelText('Country *'), 'USA');

    await user.click(screen.getByLabelText(/terms and conditions/i));

    await user.click(
      screen.getByRole('button', {
        name: /submit/i,
      })
    );

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });
});
