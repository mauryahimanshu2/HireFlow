import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RecruiterProfileForm from '../../components/recruiter/RecruiterProfileForm'
import recruiterService from '../../services/recruiterService'

function RecruiterProfile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  const loadProfile = async () => {
    setLoading(true)
    setPageError('')

    try {
      const data = await recruiterService.getProfile()

      setProfile(data)

      if (data?.profileImageUrl) {
        setImagePreview(data.profileImageUrl)
      } else {
        setImagePreview(null)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null)
        setImagePreview(null)
      } else {
        setPageError(
          getErrorMessage(
            error,
            'Unable to load recruiter profile.',
          ),
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  // Create / Update recruiter profile
  const handleSubmit = async (formData) => {
    setSaving(true)
    setPageError('')
    setSuccessMessage('')

    try {
      if (profile) {
        // Update existing profile
        const response =
          await recruiterService.updateProfile(formData)

        // Keep local state updated
        setProfile(response)

        if (response?.profileImageUrl) {
          setImagePreview(response.profileImageUrl)
        }

        setSuccessMessage(
          'Profile updated successfully.',
        )

        // Redirect to dashboard after update
        setTimeout(() => {
          navigate('/recruiter/dashboard')
        }, 700)
      } else {
        // Create new profile
        const response =
          await recruiterService.createProfile(formData)

        setProfile(response)

        if (response?.profileImageUrl) {
          setImagePreview(response.profileImageUrl)
        }

        setSuccessMessage(
          'Profile created successfully.',
        )
      }
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to save recruiter profile.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  // Upload recruiter profile image
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // Save previous image in case upload fails
    const previousImage =
      profile?.profileImageUrl || null

    // Create temporary browser preview
    const localPreview = URL.createObjectURL(file)

    // Show image immediately
    setImagePreview(localPreview)

    setImageLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      const response =
        await recruiterService.uploadProfileImage(file)

      /*
       * IMPORTANT:
       *
       * Do NOT do:
       *
       * setProfile(response)
       *
       * because the image API returns only the image
       * response, not the complete recruiter profile.
       *
       * Instead, preserve the existing profile fields
       * and update only profileImageUrl.
       */

      setProfile((previousProfile) => {
        if (!previousProfile) {
          return previousProfile
        }

        return {
          ...previousProfile,
          profileImageUrl:
            response.profileImageUrl,
        }
      })

      if (response?.profileImageUrl) {
        setImagePreview(response.profileImageUrl)

        URL.revokeObjectURL(localPreview)
      }

      setSuccessMessage(
        'Profile image uploaded successfully.',
      )
    } catch (error) {
      // Restore previous image if upload fails
      setImagePreview(previousImage)

      URL.revokeObjectURL(localPreview)

      setPageError(
        getErrorMessage(
          error,
          'Unable to upload profile image.',
        ),
      )
    } finally {
      setImageLoading(false)

      // Allow selecting the same file again
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Loading profile...
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
      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Recruiter Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your recruiter information.
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

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ========================= */}
          {/* Profile Image */}
          {/* ========================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Profile Image
            </h2>

            {/* Image */}
            <div className="mt-6 flex justify-center">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Recruiter profile"
                  className="h-40 w-40 rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 text-5xl text-gray-400">
                  👤
                </div>
              )}

            </div>

            {/* Upload button */}
            <label className="mt-6 block cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700">

              {imageLoading
                ? 'Uploading...'
                : imagePreview
                  ? 'Change Image'
                  : 'Upload Image'}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={imageLoading}
                className="hidden"
              />

            </label>

          </div>

          {/* ========================= */}
          {/* Profile Form */}
          {/* ========================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Professional Information
            </h2>

            <RecruiterProfileForm
              profile={profile}
              onSubmit={handleSubmit}
              loading={saving}
              error=""
            />

          </div>

        </div>
      </main>
    </div>
  )
}

export default RecruiterProfile