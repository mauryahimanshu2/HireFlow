import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'
import { validation } from '../../utils/validation'

function RegisterForm() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.JOB_SEEKER,
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

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

    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}

    const nameError = validation.name(formData.name)

    if (nameError) {
      newErrors.name = nameError
    }

    const emailError = validation.email(formData.email)

    if (emailError) {
      newErrors.email = emailError
    }

    const passwordError = validation.password(
      formData.password,
    )

    if (passwordError) {
      newErrors.password = passwordError
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        'Please confirm your password.'
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        'Passwords do not match.'
    }

    if (
      formData.role !== ROLES.JOB_SEEKER &&
      formData.role !== ROLES.RECRUITER
    ) {
      newErrors.role = 'Please select a valid role.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setServerError('')

    if (!validateForm()) {
      return
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })

      navigate('/login', {
        state: {
          message:
            'Registration successful. Please login with your credentials.',
        },
      })
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.'

      setServerError(message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
          className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${
            errors.name
              ? 'border-red-400 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${
            errors.email
              ? 'border-red-400 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Register As
        </label>

        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value={ROLES.JOB_SEEKER}>
            Job Seeker
          </option>

          <option value={ROLES.RECRUITER}>
            Recruiter
          </option>
        </select>

        {errors.role && (
          <p className="mt-1 text-sm text-red-600">
            {errors.role}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="new-password"
            className={`w-full rounded-lg border px-4 py-3 pr-20 outline-none transition focus:ring-2 ${
              errors.password
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((previous) => !previous)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showConfirmPassword ? 'text' : 'password'
            }
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className={`w-full rounded-lg border px-4 py-3 pr-20 outline-none transition focus:ring-2 ${
              errors.confirmPassword
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (previous) => !previous,
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-800"
        >
          Login
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm