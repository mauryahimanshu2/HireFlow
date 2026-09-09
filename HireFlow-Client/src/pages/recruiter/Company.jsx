import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CompanyForm from '../../components/recruiter/CompanyForm'
import companyService from '../../services/companyService'
import recruiterService from '../../services/recruiterService'

function Company() {
  const navigate = useNavigate()

  const [company, setCompany] = useState(null)
  const [recruiterProfile, setRecruiterProfile] = useState(null)

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

    let profile = null

    try {
      // Get recruiter profile
      profile = await recruiterService.getProfile()
      setRecruiterProfile(profile)
    } catch (error) {
      if (error.response?.status === 404) {
        setRecruiterProfile(null)
        setLoading(false)
        return
      }
    }

    if (!profile) {
      setLoading(false)
      return
    }

    try {
      // Recruiter doesn't have a company yet
      if (!profile?.companyId) {
        setCompany(null)
        setLogoPreview(null)
        return
      }

      // Backend returns a single company object
      const companyData = await companyService.getCompanies()

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
    if (!recruiterProfile) {
      setPageError('You must create your Recruiter Profile before adding a company.')
      return
    }

    setSaving(true)
    setPageError('')
    setSuccessMessage('')

    try {
      if (company) {
        // Update existing company
        const response = await companyService.updateCompany(formData)

        setCompany(response)

        if (response?.logoUrl) {
          setLogoPreview(response.logoUrl)
        }

        setSuccessMessage('Company updated successfully.')

        setTimeout(() => {
          navigate('/recruiter/dashboard')
        }, 700)
      } else {
        // Create company
        const response = await companyService.createCompany(formData)

        setCompany(response)

        if (response?.logoUrl) {
          setLogoPreview(response.logoUrl)
        }

        // Refresh recruiter profile because backend associates company with recruiter
        const updatedProfile = await recruiterService.getProfile()
        setRecruiterProfile(updatedProfile)

        setSuccessMessage('Company created successfully.')
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

    const previousLogo = company?.logoUrl || null
    const localPreview = URL.createObjectURL(file)

    setLogoPreview(localPreview)
    setLogoLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      const response = await companyService.uploadLogo(file)

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

      setSuccessMessage('Company logo uploaded successfully.')
    } catch (error) {
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

      const updatedProfile = await recruiterService.getProfile()
      setRecruiterProfile(updatedProfile)

      setSuccessMessage('Company deleted successfully.')
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Loading company...
        </div>
      </div>
    )
  }

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

        {/* Missing Profile Warning */}
        {!recruiterProfile && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900">
                  Recruiter Profile Required
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  You must create your Recruiter Profile before you can add or manage a company.
                </p>
                <Link
                  to="/recruiter/profile"
                  className="mt-4 inline-block rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Create Recruiter Profile First
                </Link>
              </div>
            </div>
          </div>
        )}

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

        {/* No company notice */}
        {recruiterProfile && !company && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            You don't have a company yet. Create your company profile below.
          </div>
        )}

        {recruiterProfile && (
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Logo Section */}
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

            {/* Form Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Company Information
              </h2>

              <CompanyForm
                company={company}
                onSubmit={handleSubmit}
                loading={saving}
              />

              {company && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="mt-4 w-full rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Processing...' : 'Delete Company'}
                </button>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default Company