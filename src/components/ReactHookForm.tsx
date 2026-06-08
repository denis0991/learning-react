import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStore } from '../store/formStore';
import PasswordStrength from './PasswordStrength';
import { fileToBase64, validateImage } from '../utils/helpers';
import './styles/FormStyles.css';
import { useState } from 'react';

interface ReactHookFormProps {
  onClose: () => void;
}

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((val) => val[0] === val[0].toUpperCase(), {
        message: 'First letter must be uppercase',
      }),
    age: z
      .number()
      .min(1, 'Age is required')
      .nonnegative('Age cannot be negative'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    gender: z
      .enum(['male', 'female', 'other'])
      .refine((val) => val !== undefined, {
        message: 'Gender is required',
      }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept Terms and Conditions',
    }),
    password: z
      .string()
      .min(1, 'Password is required')
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
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    country: z.string().min(1, 'Country is required'),
    image: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

const ReactHookForm = ({ onClose }: ReactHookFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countries = useFormStore((state) => state.countries);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: undefined,
      termsAccepted: false,
      password: '',
      confirmPassword: '',
      country: '',
    },
  });

  const watchPassword = watch('password', '');

  const onSubmit = (data: FormData) => {
    if (!countries.includes(data.country)) {
      setError('country', { message: 'Country must exist in the list' });
      return;
    }

    addSubmission({
      formType: 'react-hook-form',
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      termsAccepted: data.termsAccepted,
      imageBase64: imageBase64 || undefined,
      password: data.password,
      country: data.country,
    });
    reset();
    setImagePreview('');
    setImageBase64('');
    onClose();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      setError('image', { message: validation.error });
      return;
    }

    clearErrors('image');
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
    setImagePreview(base64);
  };

  const handleCountryInput = (value: string) => {
    setValue('country', value, { shouldValidate: true });

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
    setValue('country', country, { shouldValidate: true });
    setCountrySuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-field">
        <label htmlFor="rhf-name">Name *</label>
        <input id="rhf-name" type="text" {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="rhf-age">Age *</label>
        <input
          id="rhf-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="rhf-email">Email *</label>
        <input id="rhf-email" type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="rhf-gender">Gender *</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <span className="error">{errors.gender.message}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="rhf-image">Profile Image (PNG/JPEG, max 5MB)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImageChange}
        />
        {errors.image && (
          <span className="error">{String(errors.image.message)}</span>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100px', marginTop: '5px' }}
          />
        )}
      </div>

      <div className="form-field">
        <label htmlFor="rhf-password">Password *</label>
        <input id="rhf-password" type="password" {...register('password')} />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
        <PasswordStrength password={watchPassword} />
      </div>

      <div className="form-field">
        <label htmlFor="rhf-confirm-password">Confirm Password *</label>
        <input
          id="rhf-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="rhf-country">Country *</label>
        <div className="autocomplete-wrapper">
          <input
            id="rhf-country"
            type="text"
            {...register('country')}
            onChange={(e) => handleCountryInput(e.target.value)}
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
        {errors.country && (
          <span className="error">{errors.country.message}</span>
        )}
      </div>

      <div className="form-field checkbox">
        <label htmlFor="rhf-terms">
          <input
            id="rhf-terms"
            type="checkbox"
            {...register('termsAccepted')}
          />
          I accept the Terms and Conditions *
        </label>
        {errors.termsAccepted && (
          <span className="error">{errors.termsAccepted.message}</span>
        )}
      </div>

      <div className="form-buttons">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" disabled={!isValid || isSubmitting}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default ReactHookForm;
