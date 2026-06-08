import { describe, it, expect } from 'vitest';
import { checkPasswordStrength, validateImage, fileToBase64 } from './helpers';

describe('checkPasswordStrength', () => {
  it('should return weak for simple password', () => {
    const result = checkPasswordStrength('a');
    expect(result.strength).toBe(1);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.hasSpecial).toBe(false);
  });

  it('should return strong for complex password', () => {
    const result = checkPasswordStrength('Abc123!@#');
    expect(result.strength).toBe(4);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecial).toBe(true);
  });

  it('should detect missing uppercase', () => {
    const result = checkPasswordStrength('abc123!@#');
    expect(result.hasUppercase).toBe(false);
    expect(result.strength).toBe(3);
  });

  it('should return empty for empty password', () => {
    const result = checkPasswordStrength('');
    expect(result.strength).toBe(0);
    expect(result.hasLowercase).toBe(false);
  });
});

describe('validateImage', () => {
  it('should reject wrong file type', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const result = validateImage(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Only PNG, JPEG, JPG');
  });

  it('should reject file too large', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'test.png', {
      type: 'image/png',
    });
    const result = validateImage(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('less than 5MB');
  });

  it('should accept PNG file', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = validateImage(file);
    expect(result.isValid).toBe(true);
  });

  it('should accept JPEG file', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateImage(file);
    expect(result.isValid).toBe(true);
  });
});

describe('fileToBase64', () => {
  it('should convert file to base64', async () => {
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    const result = await fileToBase64(file);
    expect(result).toContain('base64');
  });
});
