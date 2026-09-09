import { useEffect, useState } from 'react'
import { validation } from '../../utils/validation'

const initialForm = {
  companyName: '',
  description: '',
  industry: '',
  location: '',
  website: '',
  companySize: '',
}

function CompanyForm({
  company,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        description: company.description || '',
        industry: company.industry || '',
        location: company.location || '',
        website: company.website || '',
        companySize: company.companySize || '',
      })
    }
  }, [company])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    const companyNameError = validation.minLength(
      formData.companyName,
      2,
      'Company Name',
    )

    if (companyNameError) {
      newErrors.companyName = companyNameError
    }

    const companyNameMaxError = validation.maxLength(
      formData.companyName,
      150,
      'Company Name',
    )

    if (companyNameMaxError) {
      newErrors.companyName = companyNameMaxError
    }

    const descriptionError = validation.maxLength(
      formData.description,
      2000,
      'Description',
    )

    if (descriptionError) {
      newErrors.description = descriptionError
    }

    const industryError = validation.maxLength(
      formData.industry,
      100,
      'Industry',
    )

    if (industryError) {
      newErrors.industry = industryError
    }

    const locationError = validation.maxLength(
      formData.location,
      100,
      'Location',
    )

    if (locationError) {
      newErrors.location = locationError
    }

    const websiteError = validation.url(
      formData.website,
    )

    if (websiteError) {
      newErrors.website = websiteError
    }

    const websiteMaxError = validation.maxLength(
      formData.website,
      500,
      'Website',
    )

    if (websiteMaxError) {
      newErrors.website = websiteMaxError
    }

    const companySizeError = validation.maxLength(
      formData.companySize,
      50,
      'Company Size',
    )

    if (companySizeError) {
      newErrors.companySize = companySizeError
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    await onSubmit({
      companyName: formData.companyName.trim(),
      description:
        formData.description.trim() || null,
      industry: formData.industry.trim() || null,
      location: formData.location.trim() || null,
      website: formData.website.trim() || null,
      companySize:
        formData.companySize.trim() || null,
    })
  }

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }`

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Company Name *
        </label>

        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
          className={inputClass('companyName')}
        />

        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.companyName}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe your company"
          className={inputClass('description')}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Industry
          </label>

          <input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Information Technology"
            className={inputClass('industry')}
          />

          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">
              {errors.industry}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Company Size
          </label>

          <input
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            placeholder="e.g. 51-200 employees"
            className={inputClass('companySize')}
          />

          {errors.companySize && (
            <p className="mt-1 text-sm text-red-600">
              {errors.companySize}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Location
        </label>

        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Bangalore, India"
          className={inputClass('location')}
        />

        {errors.location && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Website
        </label>

        <input
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          className={inputClass('website')}
        />

        {errors.website && (
          <p className="mt-1 text-sm text-red-600">
            {errors.website}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? 'Saving...'
          : company
            ? 'Update Company'
            : 'Create Company'}
      </button>
    </form>
  )
}

export default CompanyForm