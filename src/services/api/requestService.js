import requestData from '../mockData/requests.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class RequestService {
  constructor() {
    this.data = [...requestData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const request = this.data.find(req => req.id === id)
    if (!request) {
      throw new Error('Request not found')
    }
    return { ...request }
  }

  async create(requestData) {
    await delay(400)
    const newRequest = {
      ...requestData,
      id: Date.now().toString(),
      requestDate: new Date().toISOString(),
      status: requestData.status || 'pending'
    }
    this.data.push(newRequest)
    return { ...newRequest }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(req => req.id === id)
    if (index === -1) {
      throw new Error('Request not found')
    }
    
    this.data[index] = {
      ...this.data[index],
      ...updates
    }
    
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(req => req.id === id)
    if (index === -1) {
      throw new Error('Request not found')
    }
    
    const deletedRequest = this.data.splice(index, 1)[0]
    return { ...deletedRequest }
  }

  async getByStatus(status) {
    await delay(250)
    return this.data.filter(req => req.status === status).map(req => ({ ...req }))
  }

  async getPendingRequests() {
    await delay(200)
    return this.data.filter(req => req.status === 'pending').map(req => ({ ...req }))
  }

  async approve(id) {
    return this.update(id, { status: 'approved' })
  }

  async reject(id) {
    return this.update(id, { status: 'rejected' })
  }

  async fulfill(id) {
    return this.update(id, { status: 'fulfilled' })
  }
}

export default new RequestService()