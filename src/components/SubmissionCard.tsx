import type { FormData } from '../types/form';
import './styles/SubmissionCard.css';

interface SubmissionCardProps {
  submission: FormData;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  return (
    <div
      className={`submission-card ${submission.isNewlySubmitted ? 'new' : ''}`}
    >
      <div className="card-header">
        <strong>
          {submission.formType === 'uncontrolled'
            ? 'Uncontrolled Form'
            : 'React Hook Form'}
        </strong>
        <span className="timestamp">
          {new Date(submission.submittedAt).toLocaleString()}
        </span>
      </div>

      <div className="card-body">
        <div>
          <strong>Name:</strong> {submission.name}
        </div>
        <div>
          <strong>Age:</strong> {submission.age}
        </div>
        <div>
          <strong>Email:</strong> {submission.email}
        </div>
        <div>
          <strong>Gender:</strong> {submission.gender || 'Not specified'}
        </div>
        <div>
          <strong>Country:</strong> {submission.country || 'Not specified'}
        </div>
        {submission.imageBase64 && (
          <div>
            <strong>Image:</strong>
            <img
              src={submission.imageBase64}
              alt="User upload"
              style={{ maxWidth: '100px', marginTop: '5px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
