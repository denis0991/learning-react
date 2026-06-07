import { useEffect, useState } from 'react';
import './App.css';
import { Modal } from './components/Modal';
import { useFormStore } from './store/formStore';
import SubmissionCard from './components/SubmissionCard';
import UncontrolledForm from './components/UncontrolledForm';
import ReactHookForm from './components/ReactHookForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'uncontrolled' | 'react-hook-form'>(
    'uncontrolled'
  );
  const submissions = useFormStore((state) => state.submissions);

  useEffect(() => {
    console.log('App: submissions changed:', submissions);
  }, [submissions]);

  const handleOpenModal = (type: 'uncontrolled' | 'react-hook-form') => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderForm = () => {
    if (formType === 'uncontrolled') {
      return <UncontrolledForm onClose={handleCloseModal} />;
    }
    return <ReactHookForm onClose={handleCloseModal} />;
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Form Submissions</h1>
        <div className="header-buttons">
          <button
            className="open-form-btn"
            onClick={() => handleOpenModal('uncontrolled')}
          >
            Uncontrolled Form
          </button>
          <button
            className="open-form-btn rhf-btn"
            onClick={() => handleOpenModal('react-hook-form')}
          >
            React Hook Form
          </button>
        </div>
      </header>

      <div className="submissions-container">
        <h2>Submissions History ({submissions.length})</h2>
        {submissions.length === 0 ? (
          <p className="no-data">
            No submissions yet. Click a button above to add one.
          </p>
        ) : (
          submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          formType === 'uncontrolled' ? 'Uncontrolled Form' : 'React Hook Form'
        }
      >
        {renderForm()}
      </Modal>
    </div>
  );
}

export default App;
