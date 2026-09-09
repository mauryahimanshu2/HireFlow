import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { validation } from '../../utils/validation'

function LoginForm() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
      const response = await login({
  email: formData.email.trim(),
  password: formData.password,
})

if (response.role === 'JobSeeker') {
  navigate('/jobseeker/dashboard')
} else if (response.role === 'Recruiter') {
  navigate('/recruiter/dashboard')
} else if (response.role === 'Admin') {
  navigate('/admin/dashboard')
} else {
  navigate('/')
}
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to login. Please check your email and password.'

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
            autoComplete="current-password"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-800"
        >
          Register
        </Link>
      </p>
    </form>
  )
}

export default LoginForm