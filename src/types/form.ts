export interface FormData {
  id: string;
  formType: 'uncontrolled' | 'react-hook-form';
  submittedAt: Date;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other' | '';
  termsAccepted: boolean;
  imageBase64?: string;
  password?: string;
  country?: string;
  isNewlySubmitted?: boolean;
}
