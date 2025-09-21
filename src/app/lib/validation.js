export const complianceRules = {
  financial: {
    allowedTypes: ['PDF', 'DOCX', 'TXT'],
    maxSize: 5,
    requiredDocs: ['Financial Statement', 'Tax Compliance Certificate']
  },
  legal: {
    allowedTypes: ['PDF', 'DOCX'],
    maxSize: 10,
    requiredDocs: ['Contract', 'License Agreement', 'Certificate']
  },
  safety: {
    allowedTypes: ['PDF', 'DOCX', 'TXT'],
    maxSize: 8,
    requiredDocs: ['Safety Manual', 'Inspection Report']
  },
  environmental: {
    allowedTypes: ['PDF', 'DOCX'],
    maxSize: 15,
    requiredDocs: ['Environmental Impact', 'Compliance Certificate']
  },
  tax: {
    allowedTypes: ['PDF', 'DOCX'],
    maxSize: 5,
    requiredDocs: ['Tax Return', 'Withholding Certificate']
  },
  hr: {
    allowedTypes: ['PDF', 'DOCX', 'TXT'],
    maxSize: 10,
    requiredDocs: ['Employee Handbook', 'Policy Document']
  }
};

export const validateCompliance = (complianceData, files) => {
  const errors = [];
  const warnings = [];

  if (!complianceData.companyName?.trim()) {
    errors.push('Company name is required');
  }

  if (!complianceData.complianceType) {
    errors.push('Compliance type is required');
  }

  if (!complianceData.effectiveDate) {
    errors.push('Effective date is required');
  }

  if (complianceData.effectiveDate) {
    const effectiveDate = new Date(complianceData.effectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (effectiveDate < today) {
      warnings.push('Effective date is in the past');
    }
  }

  if (files.length === 0) {
    errors.push('At least one document must be uploaded');
  } else {
    const rule = complianceRules[complianceData.complianceType];
    if (rule) {
      const invalidFiles = files.filter(file => {
        const ext = file.name.split('.').pop()?.toUpperCase();
        return !rule.allowedTypes.includes(ext);
      });
      
      if (invalidFiles.length > 0) {
        errors.push(`Invalid file types for ${complianceData.complianceType}. Allowed: ${rule.allowedTypes.join(', ')}`);
      }

      const oversizedFiles = files.filter(file => file.size > rule.maxSize * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        errors.push(`Files exceed maximum size of ${rule.maxSize}MB for ${complianceData.complianceType}`);
      }
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
};

export const getComplianceRequirements = (complianceType) => {
  return complianceRules[complianceType] || null;
};