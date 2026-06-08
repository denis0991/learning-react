import { checkPasswordStrength } from '../utils/helpers';
import './styles/PasswordStrength.css';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const { hasNumber, hasUppercase, hasLowercase, hasSpecial, strength } =
    checkPasswordStrength(password);

  if (!password) return null;

  const getStrengthText = () => {
    switch (strength) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 1:
        return 'weak';
      case 2:
        return 'fair';
      case 3:
        return 'good';
      case 4:
        return 'strong';
      default:
        return '';
    }
  };

  return (
    <div className="password-strength">
      <div className={`strength-bar ${getStrengthColor()}`}>
        <div
          className="strength-fill"
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <div className="strength-text">{getStrengthText()}</div>
      <div className="strength-requirements">
        <span className={hasNumber ? 'valid' : 'invalid'}>✓ 1 number</span>
        <span className={hasUppercase ? 'valid' : 'invalid'}>
          ✓ 1 uppercase
        </span>
        <span className={hasLowercase ? 'valid' : 'invalid'}>
          ✓ 1 lowercase
        </span>
        <span className={hasSpecial ? 'valid' : 'invalid'}>
          ✓ 1 special character
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;
