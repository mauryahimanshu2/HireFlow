import api from './api'

const jobSeekerService = {
  async getProfile() {
    const response = await api.get('/jobseekers/profile')
    return response.data
  },

  async createProfile(profileData) {
    const response = await api.post(
      '/jobseekers/profile',
      profileData,
    )

    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put(
      '/jobseekers/profile',
      profileData,
    )

    return response.data
  },

  async patchProfile(profileData) {
    const response = await api.patch(
      '/jobseekers/profile',
      profileData,
    )

    return response.data
  },

  async deleteProfile() {
    const response = await api.delete(
      '/jobseekers/profile',
    )

    return response.data
  },

  async uploadProfileImage(file) {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post(
      '/jobseekers/profile/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  },

  async uploadResume(file) {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post(
      '/jobseekers/profile/resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  },
}

export default jobSeekerService