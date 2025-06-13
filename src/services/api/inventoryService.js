import { toast } from 'react-toastify'

class InventoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'inventory'
  }

  async getAll() {
    try {
      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "Tags" } },
          { Field: { Name: "Owner" } },
          { Field: { Name: "CreatedOn" } },
          { Field: { Name: "CreatedBy" } },
          { Field: { Name: "ModifiedOn" } },
          { Field: { Name: "ModifiedBy" } },
          { Field: { Name: "category" } },
          { Field: { Name: "quantity" } },
          { Field: { Name: "min_stock" } },
          { Field: { Name: "location" } },
          { Field: { Name: "unit" } },
          { Field: { Name: "last_updated" } }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      // Map database fields to UI expected format for backward compatibility
      return response.data?.map(record => ({
        id: record.Id,
        name: record.Name,
        category: record.category,
        quantity: record.quantity,
        minStock: record.min_stock,
        location: record.location,
        unit: record.unit,
        lastUpdated: record.last_updated,
        tags: record.Tags,
        owner: record.Owner
      })) || []
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast.error("Failed to fetch inventory")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          "Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy",
          "ModifiedOn", "ModifiedBy", "category", "quantity", 
          "min_stock", "location", "unit", "last_updated"
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Item not found')
      }
      
      const record = response.data
      return {
        id: record.Id,
        name: record.Name,
        category: record.category,
        quantity: record.quantity,
        minStock: record.min_stock,
        location: record.location,
        unit: record.unit,
        lastUpdated: record.last_updated,
        tags: record.Tags,
        owner: record.Owner
      }
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error)
      throw error
    }
  }

  async create(itemData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: itemData.name,
          Tags: itemData.tags || '',
          Owner: itemData.owner,
          category: itemData.category,
          quantity: parseInt(itemData.quantity),
          min_stock: parseInt(itemData.minStock),
          location: itemData.location,
          unit: itemData.unit,
          last_updated: new Date().toISOString()
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create item')
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data
          return {
            id: record.Id,
            name: record.Name,
            category: record.category,
            quantity: record.quantity,
            minStock: record.min_stock,
            location: record.location,
            unit: record.unit,
            lastUpdated: record.last_updated
          }
        }
      }
      
      throw new Error('No records were created')
    } catch (error) {
      console.error("Error creating item:", error)
      throw error
    }
  }

  async update(id, updates) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields that are being updated
          ...(updates.name && { Name: updates.name }),
          ...(updates.tags && { Tags: updates.tags }),
          ...(updates.owner && { Owner: updates.owner }),
          ...(updates.category && { category: updates.category }),
          ...(updates.quantity !== undefined && { quantity: parseInt(updates.quantity) }),
          ...(updates.minStock !== undefined && { min_stock: parseInt(updates.minStock) }),
          ...(updates.location && { location: updates.location }),
          ...(updates.unit && { unit: updates.unit }),
          last_updated: new Date().toISOString()
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to update item')
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const record = successfulUpdates[0].data
          return {
            id: record.Id,
            name: record.Name,
            category: record.category,
            quantity: record.quantity,
            minStock: record.min_stock,
            location: record.location,
            unit: record.unit,
            lastUpdated: record.last_updated
          }
        }
      }
      
      throw new Error('No records were updated')
    } catch (error) {
      console.error("Error updating item:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to delete item')
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting item:", error)
      throw error
    }
  }

  async getLowStockItems() {
    try {
      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "category" } },
          { Field: { Name: "quantity" } },
          { Field: { Name: "min_stock" } },
          { Field: { Name: "location" } },
          { Field: { Name: "unit" } }
        ],
        where: [
          {
            FieldName: "quantity",
            Operator: "LessThanOrEqualTo",
            Values: ["min_stock"]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data?.map(record => ({
        id: record.Id,
        name: record.Name,
        category: record.category,
        quantity: record.quantity,
        minStock: record.min_stock,
        location: record.location,
        unit: record.unit
      })) || []
    } catch (error) {
      console.error("Error fetching low stock items:", error)
      return []
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "category" } },
          { Field: { Name: "quantity" } },
          { Field: { Name: "min_stock" } },
          { Field: { Name: "location" } },
          { Field: { Name: "unit" } },
          { Field: { Name: "last_updated" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "ExactMatch",
            Values: [category]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data?.map(record => ({
        id: record.Id,
        name: record.Name,
        category: record.category,
        quantity: record.quantity,
        minStock: record.min_stock,
        location: record.location,
        unit: record.unit,
        lastUpdated: record.last_updated
      })) || []
    } catch (error) {
      console.error("Error fetching items by category:", error)
      return []
    }
  }
}

export default new InventoryService()