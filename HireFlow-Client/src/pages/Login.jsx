import { Link, useLocation } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'

function Login() {
  const location = useLocation()

  const successMessage = location.state?.message

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-4xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-600">
            Login to continue to HireFlow
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {successMessage && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login