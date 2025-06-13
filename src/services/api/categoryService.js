import categoryData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CategoryService {
  constructor() {
    this.data = [...categoryData]
  }

  async getAll() {
    await delay(250)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const category = this.data.find(cat => cat.id === id)
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  }

  async create(categoryData) {
    await delay(350)
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      itemCount: 0
    }
    this.data.push(newCategory)
    return { ...newCategory }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.data.findIndex(cat => cat.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    this.data[index] = {
      ...this.data[index],
      ...updates
    }
    
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(cat => cat.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const deletedCategory = this.data.splice(index, 1)[0]
    return { ...deletedCategory }
  }
}

export default new CategoryService()