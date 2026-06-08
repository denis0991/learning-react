import { useRef, useState } from 'react';
import { useFormStore } from '../store/formStore';
import PasswordStrength from './PasswordStrength';
import { fileToBase64, validateImage } from '../utils/helpers';
import { z } from 'zod';
import './styles/FormStyles.css';

interface UncontrolledFormProps {
  onClose: () => void;
}

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine(
        (val) => val && val.length > 0 && val[0] === val[0].toUpperCase(),
        'First letter must be uppercase'
      ),
    age: z
      .number()
      .min(1, 'Age is required')
      .nonnegative('Age cannot be negative'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    gender: z.enum(['male', 'female', 'other'], {
      message: 'Gender is required',
    }),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'You must accept Terms and Conditions'),
    password: z
      .string()
      .min(1, 'Password is required')
      .refine(
        (val) => val && val.length >= 8,
        'Password must be at least 8 characters long'
      )
      .refine((val) => /\d/.test(val), 'Must contain at least 1 number')
      .refine(
        (val) => /[A-Z]/.test(val),
        'Must contain at least 1 uppercase letter'
      )
      .refine(
        (val) => /[a-z]/.test(val),
        'Must contain at least 1 lowercase letter'
      )
      .refine(
        (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        'Must contain at least 1 special character'
      ),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Country is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countries = useFormStore((state) => state.countries);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (genderRef.current) genderRef.current.value = '';
    if (termsRef.current) termsRef.current.checked = false;
    if (passwordRef.current) passwordRef.current.value = '';
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
    if (countryRef.current) countryRef.current.value = '';
    if (imageRef.current) imageRef.current.value = '';

    setImagePreview('');
    setImageBase64('');
    setSelectedCountry('');
    setPasswordStrength('');
    setErrors({});
    setCountrySuggestions([]);
    setShowSuggestions(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
    setImagePreview(base64);
  };

  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);

    if (value) {
      const filtered = countries.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setCountrySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setCountrySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectCountry = (country: string) => {
    setSelectedCountry(country);
    setCountrySuggestions([]);
    setShowSuggestions(false);
    if (countryRef.current) {
      countryRef.current.value = country;
    }
  };

  const validate = () => {
    const formData = {
      name: nameRef.current?.value || '',
      age: parseInt(ageRef.current?.value || '0'),
      email: emailRef.current?.value || '',
      gender: genderRef.current?.value as 'male' | 'female' | 'other',
      termsAccepted: termsRef.current?.checked || false,
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      country: selectedCountry,
    };

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    addSubmission({
      formType: 'uncontrolled',
      name: nameRef.current?.value || '',
      age: parseInt(ageRef.current?.value || '0'),
      email: emailRef.current?.value || '',
      gender: (genderRef.current?.value as 'male' | 'female' | 'other') || '',
      termsAccepted: termsRef.current?.checked || false,
      imageBase64: imageBase64 || undefined,
      password: passwordRef.current?.value || undefined,
      country: selectedCountry || undefined,
    });
    resetForm();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-field">
        <label htmlFor="uncontrolled-name">Name *</label>
        <input
          id="uncontrolled-name"
          type="text"
          ref={nameRef}
          defaultValue=""
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-age">Age *</label>
        <input
          id="uncontrolled-age"
          type="number"
          ref={ageRef}
          defaultValue=""
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-email">Email *</label>
        <input
          id="uncontrolled-email"
          type="email"
          ref={emailRef}
          defaultValue=""
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-gender">Gender *</label>
        <select id="uncontrolled-gender" ref={genderRef} defaultValue="">
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-image">
          Profile Image (PNG/JPEG, max 5MB)
        </label>
        <input
          id="uncontrolled-image"
          type="file"
          ref={imageRef}
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImageChange}
        />
        {errors.image && <span className="error">{errors.image}</span>}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100px', marginTop: '5px' }}
          />
        )}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-password">Password *</label>
        <input
          id="uncontrolled-password"
          type="password"
          ref={passwordRef}
          onChange={(e) => setPasswordStrength(e.target.value)}
        />
        {errors.password && <span className="error">{errors.password}</span>}
        <PasswordStrength password={passwordStrength} />
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-confirm-password">
          Confirm Password *
        </label>
        <input
          id="uncontrolled-confirm-password"
          type="password"
          ref={confirmPasswordRef}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-country">Country *</label>
        <div className="autocomplete-wrapper">
          <input
            id="uncontrolled-country"
            type="text"
            ref={countryRef}
            onChange={handleCountryInput}
            autoComplete="off"
          />
          {showSuggestions && countrySuggestions.length > 0 && (
            <ul className="suggestions">
              {countrySuggestions.map((country) => (
                <li key={country} onClick={() => selectCountry(country)}>
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.country && <span className="error">{errors.country}</span>}
      </div>

      <div className="form-field checkbox">
        <label htmlFor="uncontrolled-terms">
          <input id="uncontrolled-terms" type="checkbox" ref={termsRef} />I
          accept the Terms and Conditions *
        </label>
        {errors.termsAccepted && (
          <span className="error">{errors.termsAccepted}</span>
        )}
      </div>

      <div className="form-buttons">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default UncontrolledForm;
