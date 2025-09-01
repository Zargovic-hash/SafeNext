import React, { useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

const FormGroup = ({ label, children, required = false }) => (
  <div className="audit-form-group">
    <label className="audit-form-label">
      {label}
      {required && <span className="audit-required">*</span>}
    </label>
    {children}
  </div>
);

const SelectField = ({ value, onChange, options, placeholder = "Sélectionner...", required = false }) => (
  <select
    value={value}
    onChange={(e) => {
      e.stopPropagation();
      onChange(e.target.value);
    }}
    className={`audit-input ${required && !value ? 'audit-input-required' : ''}`}
    onClick={(e) => e.stopPropagation()}
    onFocus={(e) => e.stopPropagation()}
    required={required}
  >
    <option value="">{placeholder}</option>
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const InputField = ({ type = "text", value, onChange, placeholder, required = false, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => {
      e.stopPropagation();
      onChange(e.target.value);
    }}
    placeholder={placeholder}
    className={`audit-input ${required && !value ? 'audit-input-required' : ''}`}
    onClick={(e) => e.stopPropagation()}
    onFocus={(e) => e.stopPropagation()}
    required={required}
    {...props}
  />
);

const TextareaField = ({ value, onChange, placeholder, rows = 4, required = false }) => (
  <textarea
    value={value}
    onChange={(e) => {
      e.stopPropagation();
      onChange(e.target.value);
    }}
    placeholder={placeholder}
    rows={rows}
    className={`audit-input audit-textarea ${required && !value ? 'audit-input-required' : ''}`}
    onClick={(e) => e.stopPropagation()}
    onFocus={(e) => e.stopPropagation()}
    required={required}
  />
);

const AuditModal = ({ 
  isOpen, 
  auditForm, 
  onInputChange, 
  onSave, 
  onClose, 
  isSaving 
}) => {
  const modalRef = useRef(null);

  // Focus management and escape key handling
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && !isSaving) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSaving) {
      onClose();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave();
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSaving) {
      onClose();
    }
  };

  const conformityOptions = [
    { value: 'Conforme', label: 'Conforme' },
    { value: 'Non Conforme', label: 'Non Conforme' },
    { value: 'En Cours', label: 'En Cours' }
  ];

  const riskOptions = [
    { value: 'Faible', label: 'Faible' },
    { value: 'Moyen', label: 'Moyen' },
    { value: 'Élevé', label: 'Élevé' }
  ];

  const feasibilityOptions = [
    { value: 'Facile', label: 'Facile' },
    { value: 'Moyen', label: 'Moyenne' },
    { value: 'Difficile', label: 'Difficile' }
  ];

  const isFormValid = auditForm.conformite.trim() !== '';

  return (
    <div 
      className="audit-modal"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div 
        ref={modalRef}
        className="audit-modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="audit-modal-header">
          <h3 id="audit-modal-title" className="audit-modal-title">
            Audit de Conformité
          </h3>
          <button
            onClick={handleClose}
            className="audit-modal-close"
            disabled={isSaving}
            aria-label="Fermer la modal"
            type="button"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="audit-modal-body">
          <div className="audit-modal-row">
            <FormGroup label="Conformité" required>
              <SelectField
                value={auditForm.conformite}
                onChange={(value) => onInputChange('conformite', value)}
                options={conformityOptions}
                placeholder="Sélectionner le statut..."
                required
              />
            </FormGroup>
            
            <FormGroup label="Niveau de Risque">
              <SelectField
                value={auditForm.risque}
                onChange={(value) => onInputChange('risque', value)}
                options={riskOptions}
                placeholder="Évaluer le risque..."
              />
            </FormGroup>
          </div>
          
          <div className="audit-modal-row">
            <FormGroup label="Faisabilité">
              <SelectField
                value={auditForm.faisabilite}
                onChange={(value) => onInputChange('faisabilite', value)}
                options={feasibilityOptions}
                placeholder="Évaluer la faisabilité..."
              />
            </FormGroup>
            
            <FormGroup label="Échéance">
              <InputField
                type="date"
                value={auditForm.deadline}
                onChange={(value) => onInputChange('deadline', value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>
          </div>
          
          <FormGroup label="Responsable">
            <InputField
              type="text"
              value={auditForm.owner}
              onChange={(value) => onInputChange('owner', value)}
              placeholder="Nom du responsable"
              maxLength={100}
            />
          </FormGroup>
          
          <FormGroup label="Plan d'action">
            <TextareaField
              value={auditForm.plan_action}
              onChange={(value) => onInputChange('plan_action', value)}
              placeholder="Décrivez le plan d'action nécessaire pour assurer la conformité..."
              rows={4}
            />
          </FormGroup>
        </form>
        
        <div className="audit-modal-footer">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="audit-button secondary"
            type="button"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isFormValid}
            className="audit-button primary"
            type="button"
          >
            <Save size={16} />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
        
        {!isFormValid && (
          <div className="audit-form-validation">
            <p className="audit-validation-message">
              * La conformité est obligatoire
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditModal;