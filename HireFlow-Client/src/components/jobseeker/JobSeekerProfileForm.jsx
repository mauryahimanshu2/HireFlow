import { useEffect, useState } from 'react'
import { validation } from '../../utils/validation'

const initialForm = {
  fullName: '',
  phone: '',
  location: '',
  skills: '',
  education: '',
  experience: '',
}

function JobSeekerProfileForm({
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
        location: profile.location || '',
        skills: profile.skills || '',
        education: profile.education || '',
        experience: profile.experience || '',
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

    const locationError = validation.maxLength(
      formData.location,
      100,
      'Location',
    )

    if (locationError) {
      newErrors.location = locationError
    }

    const skillsError = validation.maxLength(
      formData.skills,
      500,
      'Skills',
    )

    if (skillsError) {
      newErrors.skills = skillsError
    }

    const educationError = validation.maxLength(
      formData.education,
      500,
      'Education',
    )

    if (educationError) {
      newErrors.education = educationError
    }

    const experienceError = validation.maxLength(
      formData.experience,
      2000,
      'Experience',
    )

    if (experienceError) {
      newErrors.experience = experienceError
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
      location: formData.location.trim() || null,
      skills: formData.skills.trim() || null,
      education: formData.education.trim() || null,
      experience: formData.experience.trim() || null,
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
          className={inputClass('fullName')}
          placeholder="Enter your full name"
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
          className={inputClass('phone')}
          placeholder="Enter phone number"
        />

        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Location
        </label>

        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClass('location')}
          placeholder="e.g. Delhi, India"
        />

        {errors.location && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Skills
        </label>

        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          rows="3"
          className={inputClass('skills')}
          placeholder="e.g. C#, ASP.NET Core, React, SQL Server"
        />

        {errors.skills && (
          <p className="mt-1 text-sm text-red-600">
            {errors.skills}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Education
        </label>

        <textarea
          name="education"
          value={formData.education}
          onChange={handleChange}
          rows="3"
          className={inputClass('education')}
          placeholder="Describe your education"
        />

        {errors.education && (
          <p className="mt-1 text-sm text-red-600">
            {errors.education}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Experience
        </label>

        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          rows="5"
          className={inputClass('experience')}
          placeholder="Describe your experience"
        />

        {errors.experience && (
          <p className="mt-1 text-sm text-red-600">
            {errors.experience}
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

export default JobSeekerProfileForm