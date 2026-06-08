export const checkPasswordStrength = (
  password: string
): {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecial: boolean;
  strength: number;
} => {
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasNumber, hasUppercase, hasLowercase, hasSpecial].filter(
    Boolean
  ).length;

  return { hasNumber, hasUppercase, hasLowercase, hasSpecial, strength };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateImage = (
  file: File
): { isValid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PNG, JPEG, JPG images are allowed' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }

  return { isValid: true };
};
