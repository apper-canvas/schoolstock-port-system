import { toast } from 'react-toastify'

class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'category'
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
          { Field: { Name: "icon" } },
          { Field: { Name: "item_count" } }
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
        icon: record.icon,
        itemCount: record.item_count,
        tags: record.Tags,
        owner: record.Owner
      })) || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          "Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy",
          "ModifiedOn", "ModifiedBy", "icon", "item_count"
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Category not found')
      }
      
      const record = response.data
      return {
        id: record.Id,
        name: record.Name,
        icon: record.icon,
        itemCount: record.item_count,
        tags: record.Tags,
        owner: record.Owner
      }
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      throw error
    }
  }

  async create(categoryData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: categoryData.name,
          Tags: categoryData.tags || '',
          Owner: categoryData.owner,
          icon: categoryData.icon || 'Folder',
          item_count: categoryData.itemCount || 0
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create category')
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
            icon: record.icon,
            itemCount: record.item_count
          }
        }
      }
      
      throw new Error('No records were created')
    } catch (error) {
      console.error("Error creating category:", error)
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
          ...(updates.icon && { icon: updates.icon }),
          ...(updates.itemCount !== undefined && { item_count: parseInt(updates.itemCount) })
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to update category')
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
            icon: record.icon,
            itemCount: record.item_count
          }
        }
      }
      
      throw new Error('No records were updated')
    } catch (error) {
      console.error("Error updating category:", error)
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
        throw new Error('Failed to delete category')
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
      console.error("Error deleting category:", error)
      throw error
    }
  }
}

export default new CategoryService()