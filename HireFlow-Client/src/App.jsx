import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'

function Home() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.role}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Find Your Next Opportunity
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            HireFlow connects talented job seekers with
            companies looking for great people.
          </p>

          {!isAuthenticated && (
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
              <p className="font-semibold">
                You are logged in successfully.
              </p>

              <p className="mt-1 text-sm">
                Role: {user.role}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App