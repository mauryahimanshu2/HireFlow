import api from './api'

const companyService = {
  async getCompanies() {
    const response = await api.get('/companies')
    return response.data
  },

  async createCompany(companyData) {
    const response = await api.post(
      '/companies',
      companyData,
    )

    return response.data
  },

  async updateCompany(companyData) {
    const response = await api.put(
      '/companies',
      companyData,
    )

    return response.data
  },

  async patchCompany(companyData) {
    const response = await api.patch(
      '/companies',
      companyData,
    )

    return response.data
  },

  async deleteCompany() {
    const response = await api.delete('/companies')
    return response.data
  },

  async uploadLogo(file) {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post(
      '/companies/logo',
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

export default companyService