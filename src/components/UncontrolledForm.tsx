import { useRef, useState } from 'react';
import { useFormStore } from '../store/formStore';
import PasswordStrength from './PasswordStrength';
import { fileToBase64, validateImage } from '../utils/helpers';
import './styles/FormStyles.css';

interface UncontrolledFormProps {
  onClose: () => void;
}

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
    const newErrors: Record<string, string> = {};

    const name = nameRef.current?.value || '';
    if (!name) newErrors.name = 'Name is required';
    else if (name[0] !== name[0].toUpperCase())
      newErrors.name = 'First letter must be uppercase';

    const age = parseInt(ageRef.current?.value || '');
    if (isNaN(age)) newErrors.age = 'Age is required';
    else if (age < 0) newErrors.age = 'Age cannot be negative';

    const email = emailRef.current?.value || '';
    if (!email) newErrors.email = 'Email is required';
    else {
      const atIndex = email.indexOf('@');
      const dotIndex = email.lastIndexOf('.');
      if (atIndex === -1 || atIndex === 0)
        newErrors.email = 'Email must contain @';
      else if (dotIndex === -1 || dotIndex < atIndex + 2)
        newErrors.email = 'Invalid email format';
    }

    if (!genderRef.current?.value) newErrors.gender = 'Gender is required';

    if (!termsRef.current?.checked)
      newErrors.terms = 'You must accept Terms and Conditions';

    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const hasNumber = /\d/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasNumber)
        newErrors.password = 'Password must contain at least 1 number';
      else if (!hasUppercase)
        newErrors.password =
          'Password must contain at least 1 uppercase letter';
      else if (!hasLowercase)
        newErrors.password =
          'Password must contain at least 1 lowercase letter';
      else if (!hasSpecial)
        newErrors.password =
          'Password must contain at least 1 special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!selectedCountry) {
      newErrors.country = 'Country is required';
    } else if (!countries.includes(selectedCountry)) {
      newErrors.country = 'Country must exist in the list';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        {errors.terms && <span className="error">{errors.terms}</span>}
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
