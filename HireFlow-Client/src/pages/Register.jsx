import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

function Register() {
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
            Create Your Account
          </h1>

          <p className="mt-2 text-gray-600">
            Join HireFlow as a job seeker or recruiter
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default Register