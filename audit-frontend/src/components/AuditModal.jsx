import React, { useEffect, useRef, useCallback } from 'react';
import { X, Save } from 'lucide-react';

// Composants optimisés avec React.memo et useCallback pour éviter la perte de focus
// lors de la saisie dans les champs de formulaire

// Options des selects définies en dehors du composant pour éviter la recréation
const conformityOptions = [
  { value: 'Conforme', label: 'Conforme' },
  { value: 'Non Conforme', label: 'Non Conforme' },
  { value: 'Non Applicable', label: 'Non Applicable' }
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

const FormGroup = React.memo(({ label, children, required = false }) => (
  <div className="flex flex-col space-y-3">
    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
      <span>{label}</span>
      {required && <span className="text-red-500 font-bold">*</span>}
    </label>
    {children}
  </div>
));
FormGroup.displayName = 'FormGroup';

const SelectField = React.memo(({ value, onChange, options, placeholder = "Sélectionner...", required = false }) => {
  const handleChange = useCallback((e) => {
    e.stopPropagation();
    onChange(e.target.value);
  }, [onChange]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleFocus = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        required && !value ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={handleClick}
      onFocus={handleFocus}
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
});
SelectField.displayName = 'SelectField';

const InputField = React.memo(({ type = "text", value, onChange, placeholder, required = false, ...props }) => {
  const handleChange = useCallback((e) => {
    e.stopPropagation();
    onChange(e.target.value);
  }, [onChange]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleFocus = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        required && !value ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={handleClick}
      onFocus={handleFocus}
      required={required}
      {...props}
    />
  );
});
InputField.displayName = 'InputField';

const TextareaField = React.memo(({ value, onChange, placeholder, rows = 4, required = false }) => {
  const handleChange = useCallback((e) => {
    e.stopPropagation();
    onChange(e.target.value);
  }, [onChange]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleFocus = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        required && !value ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={handleClick}
      onFocus={handleFocus}
      required={required}
    />
  );
});
TextareaField.displayName = 'TextareaField';

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


  const isFormValid = auditForm.conformite.trim() !== '';

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 id="audit-modal-title" className="text-xl font-semibold text-gray-900">
            Audit de Conformité
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
            aria-label="Fermer la modal"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {!isFormValid && (
            <p className="text-sm text-red-600 mt-2">
              * La conformité est obligatoire
            </p>
          )}
        </form>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            type="button"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isFormValid}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            type="button"
          >
            <Save size={16} />
            <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditModal;