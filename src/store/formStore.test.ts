import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useFormStore } from './formStore';

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add submission with unique id', () => {
    const addSubmission = useFormStore.getState().addSubmission;

    addSubmission({
      formType: 'uncontrolled',
      name: 'John',
      age: 25,
      email: 'john@test.com',
      gender: 'male',
      termsAccepted: true,
    });

    const submissions = useFormStore.getState().submissions;
    expect(submissions.length).toBe(1);
    expect(submissions[0].name).toBe('John');
    expect(submissions[0].id).toBeDefined();
    expect(submissions[0].isNewlySubmitted).toBe(true);
  });

  it('should clear new flag after timeout', () => {
    const addSubmission = useFormStore.getState().addSubmission;

    addSubmission({
      formType: 'react-hook-form',
      name: 'Jane',
      age: 30,
      email: 'jane@test.com',
      gender: 'female',
      termsAccepted: true,
    });

    expect(useFormStore.getState().submissions[0].isNewlySubmitted).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(useFormStore.getState().submissions[0].isNewlySubmitted).toBe(false);
  });

  it('should clear new flag manually', () => {
    const addSubmission = useFormStore.getState().addSubmission;
    const clearNewFlag = useFormStore.getState().clearNewFlag;

    addSubmission({
      formType: 'uncontrolled',
      name: 'Test',
      age: 20,
      email: 'test@test.com',
      gender: 'male',
      termsAccepted: true,
    });

    const submissionId = useFormStore.getState().submissions[0].id;
    expect(useFormStore.getState().submissions[0].isNewlySubmitted).toBe(true);

    clearNewFlag(submissionId);

    expect(useFormStore.getState().submissions[0].isNewlySubmitted).toBe(false);
  });
});
