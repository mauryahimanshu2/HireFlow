import { useEffect, useState } from 'react'
import { validation } from '../../utils/validation'

const initialForm = {
  fullName: '',
  phone: '',
  designation: '',
}

function RecruiterProfileForm({
  profile,
  onSubmit,
  loading,
  error,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        designation: profile.designation || '',
      })
    }
  }, [profile])

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

    const fullNameError = validation.name(
      formData.fullName,
    )

    if (fullNameError) {
      newErrors.fullName = fullNameError
    }

    const phoneError = validation.phone(formData.phone)

    if (phoneError) {
      newErrors.phone = phoneError
    }

    const designationError = validation.maxLength(
      formData.designation,
      100,
      'Designation',
    )

    if (designationError) {
      newErrors.designation = designationError
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
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim() || null,
      designation:
        formData.designation.trim() || null,
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
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Full Name *
        </label>

        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={inputClass('fullName')}
        />

        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Phone
        </label>

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className={inputClass('phone')}
        />

        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Designation
        </label>

        <input
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="e.g. HR Manager"
          className={inputClass('designation')}
        />

        {errors.designation && (
          <p className="mt-1 text-sm text-red-600">
            {errors.designation}
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
          : profile
            ? 'Update Profile'
            : 'Create Profile'}
      </button>
    </form>
  )
}

export default RecruiterProfileForm