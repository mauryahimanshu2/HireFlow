import api from './api'

const recruiterService = {
  async getProfile() {
    const response = await api.get('/recruiters/profile')
    return response.data
  },

  async createProfile(profileData) {
    const response = await api.post(
      '/recruiters/profile',
      profileData,
    )

    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put(
      '/recruiters/profile',
      profileData,
    )

    return response.data
  },

  async patchProfile(profileData) {
    const response = await api.patch(
      '/recruiters/profile',
      profileData,
    )

    return response.data
  },

  async deleteProfile() {
    const response = await api.delete(
      '/recruiters/profile',
    )

    return response.data
  },

  async uploadProfileImage(file) {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post(
      '/recruiters/profile/image',
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

export default recruiterService