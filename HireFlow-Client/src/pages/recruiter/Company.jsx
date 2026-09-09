import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CompanyForm from '../../components/recruiter/CompanyForm'
import companyService from '../../services/companyService'
import recruiterService from '../../services/recruiterService'

function Company() {
  const navigate = useNavigate()

  const [company, setCompany] = useState(null)
  const [recruiterProfile, setRecruiterProfile] =
    useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoLoading, setLogoLoading] = useState(false)

  const [logoPreview, setLogoPreview] = useState(null)

  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  // ==========================================
  // Load Company
  // ==========================================

  const loadCompany = async () => {
    setLoading(true)
    setPageError('')

    try {
      // Get recruiter profile
      const profile =
        await recruiterService.getProfile()

      setRecruiterProfile(profile)

      // Recruiter doesn't have a company yet
      if (!profile?.companyId) {
        setCompany(null)
        setLogoPreview(null)
        return
      }

      // Backend returns a single company object
      const companyData =
        await companyService.getCompanies()

      if (companyData?.id) {
        setCompany(companyData)

        if (companyData.logoUrl) {
          setLogoPreview(companyData.logoUrl)
        } else {
          setLogoPreview(null)
        }
      } else {
        setCompany(null)
        setLogoPreview(null)
      }
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to load company information.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompany()
  }, [])

  // ==========================================
  // Create / Update Company
  // ==========================================

  const handleSubmit = async (formData) => {
    setSaving(true)
    setPageError('')
    setSuccessMessage('')

    try {
      if (company) {
        // Update existing company
        const response =
          await companyService.updateCompany(formData)

        // Keep updated company in state
        setCompany(response)

        if (response?.logoUrl) {
          setLogoPreview(response.logoUrl)
        }

        setSuccessMessage(
          'Company updated successfully.',
        )

        // Redirect to recruiter dashboard
        setTimeout(() => {
          navigate('/recruiter/dashboard')
        }, 700)
      } else {
        // Create company
        const response =
          await companyService.createCompany(formData)

        setCompany(response)

        if (response?.logoUrl) {
          setLogoPreview(response.logoUrl)
        }

        // Refresh recruiter profile because the backend
        // associates the company with the recruiter.
        const updatedProfile =
          await recruiterService.getProfile()

        setRecruiterProfile(updatedProfile)

        setSuccessMessage(
          'Company created successfully.',
        )
      }
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to save company information.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // Upload Company Logo
  // ==========================================

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // Save previous logo in case upload fails
    const previousLogo =
      company?.logoUrl || null

    // Create temporary local preview
    const localPreview = URL.createObjectURL(file)

    // Show image immediately
    setLogoPreview(localPreview)

    setLogoLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      const response =
        await companyService.uploadLogo(file)

      /*
       * Don't replace the complete company object.
       * The upload endpoint returns the updated logo,
       * not necessarily the complete company.
       */
      setCompany((previousCompany) => {
        if (!previousCompany) {
          return previousCompany
        }

        return {
          ...previousCompany,
          logoUrl: response.logoUrl,
        }
      })

      if (response?.logoUrl) {
        setLogoPreview(response.logoUrl)

        URL.revokeObjectURL(localPreview)
      }

      setSuccessMessage(
        'Company logo uploaded successfully.',
      )
    } catch (error) {
      // Restore previous logo if upload fails
      setLogoPreview(previousLogo)

      URL.revokeObjectURL(localPreview)

      setPageError(
        getErrorMessage(
          error,
          'Unable to upload company logo.',
        ),
      )
    } finally {
      setLogoLoading(false)

      // Allow selecting the same file again
      event.target.value = ''
    }
  }

  // ==========================================
  // Delete Company
  // ==========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this company?',
    )

    if (!confirmed) {
      return
    }

    setPageError('')
    setSuccessMessage('')
    setSaving(true)

    try {
      await companyService.deleteCompany()

      setCompany(null)
      setLogoPreview(null)

      // Refresh recruiter profile
      const updatedProfile =
        await recruiterService.getProfile()

      setRecruiterProfile(updatedProfile)

      setSuccessMessage(
        'Company deleted successfully.',
      )
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to delete company.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Loading company...
        </div>
      </div>
    )
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/recruiter/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <Link
            to="/recruiter/dashboard"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Company Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your company information and logo.
          </p>
        </div>

        {/* Error */}

        {pageError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {/* Success */}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* No company */}

        {!company && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            You don't have a company yet. Create your company
            profile below.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ====================================== */}
          {/* Company Logo */}
          {/* ====================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Company Logo
            </h2>

            <div className="mt-6 flex justify-center">

              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="h-40 w-40 rounded-2xl object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-100 text-5xl">
                  🏢
                </div>
              )}

            </div>

            {company && (
              <label className="mt-6 block cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700">

                {logoLoading
                  ? 'Uploading...'
                  : logoPreview
                    ? 'Change Logo'
                    : 'Upload Logo'}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoUpload}
                  disabled={logoLoading}
                  className="hidden"
                />

              </label>
            )}

          </div>

          {/* ====================================== */}
          {/* Company Form */}
          {/* ====================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Company Information
            </h2>

            <CompanyForm
              company={company}
              onSubmit={handleSubmit}
              loading={saving}
            />

            {/* Delete */}

            {company && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="mt-4 w-full rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'Processing...'
                  : 'Delete Company'}
              </button>
            )}

          </div>

        </div>
      </main>
    </div>
  )
}

export default Company