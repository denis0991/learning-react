import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStore } from '../store/formStore';
import './styles/FormStyles.css';

interface ReactHookFormProps {
  onClose: () => void;
}

const formSchema = z.object({
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
});

type FormData = z.infer<typeof formSchema>;

const ReactHookForm = ({ onClose }: ReactHookFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: undefined,
      termsAccepted: false,
    },
  });

  const onSubmit = (data: FormData) => {
    addSubmission({
      formType: 'react-hook-form',
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      termsAccepted: data.termsAccepted,
    });
    onClose();
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
