export const validation = {
  required(value, fieldName) {
    if (!value || !value.trim()) {
      return `${fieldName} is required.`
    }

    return ''
  },

  email(value) {
    if (!value || !value.trim()) {
      return 'Email is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address.'
    }

    return ''
  },

  password(value) {
    if (!value) {
      return 'Password is required.'
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters.'
    }

    return ''
  },

  name(value) {
    if (!value || !value.trim()) {
      return 'Name is required.'
    }

    const name = value.trim()

    if (name.length < 2) {
      return 'Name must be at least 2 characters.'
    }

    if (name.length > 100) {
      return 'Name must not exceed 100 characters.'
    }

    return ''
  },

  phone(value) {
    if (!value) {
      return ''
    }

    const phoneRegex = /^\+?[0-9\s()-]{7,20}$/

    if (!phoneRegex.test(value.trim())) {
      return 'Please enter a valid phone number.'
    }

    return ''
  },

  url(value) {
    if (!value) {
      return ''
    }

    try {
      new URL(value)
      return ''
    } catch {
      return 'Please enter a valid URL.'
    }
  },

  minLength(value, length, fieldName) {
    if (!value || !value.trim()) {
      return `${fieldName} is required.`
    }

    if (value.trim().length < length) {
      return `${fieldName} must be at least ${length} characters.`
    }

    return ''
  },

  maxLength(value, length, fieldName) {
    if (value && value.trim().length > length) {
      return `${fieldName} must not exceed ${length} characters.`
    }

    return ''
  },

  salaryRange(min, max) {
    if (
      min !== '' &&
      max !== '' &&
      Number(min) > Number(max)
    ) {
      return 'Minimum salary cannot be greater than maximum salary.'
    }

    return ''
  },

  file(file, options) {
    if (!file) {
      return `${options.fieldName} is required.`
    }

    if (file.size > options.maxSize) {
      return `${options.fieldName} must be ${options.maxSizeLabel} or smaller.`
    }

    if (!options.allowedTypes.includes(file.type)) {
      return `Invalid ${options.fieldName.toLowerCase()} file type.`
    }

    return ''
  },
}