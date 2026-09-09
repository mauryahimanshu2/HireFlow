import { useEffect, useState } from 'react'
import { validation } from '../../utils/validation'

const initialFormData = {
  title: '',
  description: '',
  location: '',
  employmentType: '',
  experienceRequired: '',
  salaryMin: '',
  salaryMax: '',
  skills: '',
}

function JobForm({
  job,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] =
    useState(initialFormData)

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        employmentType:
          job.employmentType || '',
        experienceRequired:
          job.experienceRequired || '',
        salaryMin:
          job.salaryMin ?? '',
        salaryMax:
          job.salaryMax ?? '',
        skills: job.skills || '',
      })
    } else {
      setFormData(initialFormData)
    }

    setErrors({})
  }, [job])

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

    const titleError = validation.minLength(
      formData.title,
      2,
      'Job title',
    )

    if (titleError) {
      newErrors.title = titleError
    }

    const titleMaxError = validation.maxLength(
      formData.title,
      200,
      'Job title',
    )

    if (titleMaxError) {
      newErrors.title = titleMaxError
    }

    const descriptionError =
      validation.minLength(
        formData.description,
        10,
        'Description',
      )

    if (descriptionError) {
      newErrors.description =
        descriptionError
    }

    const descriptionMaxError =
      validation.maxLength(
        formData.description,
        5000,
        'Description',
      )

    if (descriptionMaxError) {
      newErrors.description =
        descriptionMaxError
    }

    const locationError =
      validation.maxLength(
        formData.location,
        100,
        'Location',
      )

    if (locationError) {
      newErrors.location = locationError
    }

    const employmentTypeError =
      validation.maxLength(
        formData.employmentType,
        50,
        'Employment type',
      )

    if (employmentTypeError) {
      newErrors.employmentType =
        employmentTypeError
    }

    const experienceError =
      validation.maxLength(
        formData.experienceRequired,
        100,
        'Experience required',
      )

    if (experienceError) {
      newErrors.experienceRequired =
        experienceError
    }

    const skillsError =
      validation.maxLength(
        formData.skills,
        1000,
        'Skills',
      )

    if (skillsError) {
      newErrors.skills = skillsError
    }

    const salaryError = validation.salaryRange(
      formData.salaryMin,
      formData.salaryMax,
    )

    if (salaryError) {
      newErrors.salaryMin = salaryError
      newErrors.salaryMax = salaryError
    }

    if (
      formData.salaryMin !== '' &&
      Number(formData.salaryMin) < 0
    ) {
      newErrors.salaryMin =
        'Minimum salary cannot be negative.'
    }

    if (
      formData.salaryMax !== '' &&
      Number(formData.salaryMax) < 0
    ) {
      newErrors.salaryMax =
        'Maximum salary cannot be negative.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location:
        formData.location.trim() || null,
      employmentType:
        formData.employmentType.trim() || null,
      experienceRequired:
        formData.experienceRequired.trim() || null,
      salaryMin:
        formData.salaryMin === ''
          ? null
          : Number(formData.salaryMin),
      salaryMax:
        formData.salaryMax === ''
          ? null
          : Number(formData.salaryMax),
      skills:
        formData.skills.trim() || null,
    }

    onSubmit(data)
  }

  const inputClass = (field) =>
    `mt-2 w-full rounded-lg border px-4 py-3 outline-none transition ${
      errors[field]
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Job Title */}

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Job Title *
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Full Stack Developer"
          className={inputClass('title')}
          disabled={loading}
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Job Description *
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          placeholder="Describe the job responsibilities and requirements..."
          className={inputClass('description')}
          disabled={loading}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Location */}

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Noida"
          className={inputClass('location')}
          disabled={loading}
        />

        {errors.location && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location}
          </p>
        )}
      </div>

      {/* Employment Type */}

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Employment Type
        </label>

        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className={inputClass(
            'employmentType',
          )}
          disabled={loading}
        >
          <option value="">
            Select employment type
          </option>
          <option value="FullTime">
            Full Time
          </option>
          <option value="PartTime">
            Part Time
          </option>
          <option value="Contract">
            Contract
          </option>
          <option value="Internship">
            Internship
          </option>
          <option value="Remote">
            Remote
          </option>
        </select>

        {errors.employmentType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.employmentType}
          </p>
        )}
      </div>

      {/* Experience */}

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Experience Required
        </label>

        <input
          type="text"
          name="experienceRequired"
          value={formData.experienceRequired}
          onChange={handleChange}
          placeholder="e.g. 1-3 years"
          className={inputClass(
            'experienceRequired',
          )}
          disabled={loading}
        />

        {errors.experienceRequired && (
          <p className="mt-1 text-sm text-red-600">
            {errors.experienceRequired}
          </p>
        )}
      </div>

      {/* Salary */}

      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Minimum Salary
          </label>

          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            placeholder="e.g. 300000"
            min="0"
            className={inputClass('salaryMin')}
            disabled={loading}
          />

          {errors.salaryMin && (
            <p className="mt-1 text-sm text-red-600">
              {errors.salaryMin}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Maximum Salary
          </label>

          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            placeholder="e.g. 600000"
            min="0"
            className={inputClass('salaryMax')}
            disabled={loading}
          />

          {errors.salaryMax && (
            <p className="mt-1 text-sm text-red-600">
              {errors.salaryMax}
            </p>
          )}
        </div>

      </div>

      {/* Skills */}

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Skills
        </label>

        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          rows="3"
          placeholder="e.g. C#, ASP.NET Core, React, SQL Server"
          className={inputClass('skills')}
          disabled={loading}
        />

        {errors.skills && (
          <p className="mt-1 text-sm text-red-600">
            {errors.skills}
          </p>
        )}
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? 'Saving...'
          : job
            ? 'Update Job'
            : 'Create Job'}
      </button>
    </form>
  )
}

export default JobForm