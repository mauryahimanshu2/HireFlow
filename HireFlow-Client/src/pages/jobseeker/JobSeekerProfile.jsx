import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JobSeekerProfileForm from '../../components/jobseeker/JobSeekerProfileForm'
import jobSeekerService from '../../services/jobSeekerService'

function JobSeekerProfile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [imageLoading, setImageLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  // Load existing profile
  const loadProfile = async () => {
    setLoading(true)
    setPageError('')

    try {
      const data = await jobSeekerService.getProfile()

      setProfile(data)

      // Use saved Cloudinary image when profile is loaded
      if (data?.profileImageUrl) {
        setImagePreview(data.profileImageUrl)
      }
    } catch (error) {
      // 404 means profile does not exist yet
      if (error.response?.status === 404) {
        setProfile(null)
        setImagePreview(null)
      } else {
        setPageError(
          getErrorMessage(
            error,
            'Unable to load your profile.',
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

  // Create / Update profile
  const handleSubmit = async (formData) => {
    setSaving(true)
    setPageError('')
    setSuccessMessage('')

    try {
      if (profile) {
        await jobSeekerService.updateProfile(formData)

        setSuccessMessage(
          'Profile updated successfully.',
        )

        // Redirect to dashboard after successful update
        setTimeout(() => {
          navigate('/jobseeker/dashboard')
        }, 700)
      } else {
        const response =
          await jobSeekerService.createProfile(formData)

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
          'Unable to save your profile.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  // Upload profile image
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    /*
     * Create a temporary local URL.
     *
     * This makes the selected image appear immediately,
     * without waiting for Cloudinary.
     */
    const localPreview = URL.createObjectURL(file)

    setImagePreview(localPreview)

    setImageLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      const response =
        await jobSeekerService.uploadProfileImage(file)

      /*
       * Backend should return the updated profile
       * containing the permanent Cloudinary URL.
       */
      setProfile(response)

      if (response?.profileImageUrl) {
        // Replace temporary preview with permanent URL
        setImagePreview(response.profileImageUrl)

        // Release temporary browser URL
        URL.revokeObjectURL(localPreview)
      }

      setSuccessMessage(
        'Profile image uploaded successfully.',
      )
    } catch (error) {
      /*
       * If upload fails, restore the previous image.
       */
      setImagePreview(
        profile?.profileImageUrl || null,
      )

      URL.revokeObjectURL(localPreview)

      setPageError(
        getErrorMessage(
          error,
          'Unable to upload profile image.',
        ),
      )
    } finally {
      setImageLoading(false)

      // Allows selecting the same file again
      event.target.value = ''
    }
  }

  // Upload resume
  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setResumeLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      const response =
        await jobSeekerService.uploadResume(file)

      setProfile(response)

      setSuccessMessage(
        'Resume uploaded successfully.',
      )
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to upload resume.',
        ),
      )
    } finally {
      setResumeLoading(false)

      event.target.value = ''
    }
  }

  // Open resume
  const handleViewResume = () => {
    if (!profile?.resumeUrl) {
      return
    }

    window.open(
      profile.resumeUrl,
      '_blank',
      'noopener,noreferrer',
    )
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
            to="/jobseeker/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <Link
            to="/jobseeker/dashboard"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main */}

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Keep your professional information up to date.
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
          {/* PROFILE IMAGE */}
          {/* ========================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Profile Image
            </h2>

            <div className="mt-6 flex justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="h-40 w-40 rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 text-5xl text-gray-400">
                  👤
                </div>
              )}
            </div>

            <label className="mt-6 block cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-700">
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
          {/* PROFILE FORM */}
          {/* ========================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Professional Information
            </h2>

            <JobSeekerProfileForm
              profile={profile}
              onSubmit={handleSubmit}
              loading={saving}
              error=""
            />
          </div>
        </div>

        {/* ========================= */}
        {/* RESUME */}
        {/* ========================= */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Resume
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Upload your latest resume for recruiters to
            review.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {profile?.resumeUrl && (
              <button
                type="button"
                onClick={handleViewResume}
                className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                View Resume
              </button>
            )}

            <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
              {resumeLoading
                ? 'Uploading...'
                : profile?.resumeUrl
                  ? 'Change Resume'
                  : 'Upload Resume'}

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={resumeLoading}
                className="hidden"
              />
            </label>
          </div>

          {profile?.resumeUrl && (
            <p className="mt-4 text-sm text-green-600">
              ✓ Resume uploaded successfully
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobSeekerProfile