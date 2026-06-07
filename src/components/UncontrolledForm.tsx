import { useRef, useState } from 'react';
import { useFormStore } from '../store/formStore';
import './styles/FormStyles.css';

interface UncontrolledFormProps {
  onClose: () => void;
}

const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

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
