import api from './api'

const authService = {
  async register(registerData) {
    const response = await api.post('/auth/register', registerData)

    return response.data
  },

  async login(loginData) {
    const response = await api.post('/auth/login', loginData)

    return response.data
  },
}

export default authService