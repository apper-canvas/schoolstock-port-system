import { toast } from 'react-toastify'

class RequestService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'request'
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
          { Field: { Name: "quantity" } },
          { Field: { Name: "requester" } },
          { Field: { Name: "department" } },
          { Field: { Name: "status" } },
          { Field: { Name: "request_date" } },
          { Field: { Name: "notes" } },
          { Field: { Name: "item_id" } }
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
        itemId: record.item_id,
        quantity: record.quantity,
        requester: record.requester,
        department: record.department,
        status: record.status,
        requestDate: record.request_date,
        notes: record.notes,
        name: record.Name,
        tags: record.Tags,
        owner: record.Owner
      })) || []
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Failed to fetch requests")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          "Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", 
          "ModifiedOn", "ModifiedBy", "quantity", "requester", 
          "department", "status", "request_date", "notes", "item_id"
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Request not found')
      }
      
      const record = response.data
      return {
        id: record.Id,
        itemId: record.item_id,
        quantity: record.quantity,
        requester: record.requester,
        department: record.department,
        status: record.status,
        requestDate: record.request_date,
        notes: record.notes,
        name: record.Name,
        tags: record.Tags,
        owner: record.Owner
      }
    } catch (error) {
      console.error(`Error fetching request with ID ${id}:`, error)
      throw error
    }
  }

  async create(requestData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: requestData.name || `Request for ${requestData.itemId}`,
          Tags: requestData.tags || '',
          Owner: requestData.owner,
          quantity: parseInt(requestData.quantity),
          requester: requestData.requester,
          department: requestData.department,
          status: requestData.status || 'pending',
          request_date: requestData.requestDate || new Date().toISOString(),
          notes: requestData.notes || '',
          item_id: parseInt(requestData.itemId)
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to create request')
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
            itemId: record.item_id,
            quantity: record.quantity,
            requester: record.requester,
            department: record.department,
            status: record.status,
            requestDate: record.request_date,
            notes: record.notes,
            name: record.Name
          }
        }
      }
      
      throw new Error('No records were created')
    } catch (error) {
      console.error("Error creating request:", error)
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
          ...(updates.quantity && { quantity: parseInt(updates.quantity) }),
          ...(updates.requester && { requester: updates.requester }),
          ...(updates.department && { department: updates.department }),
          ...(updates.status && { status: updates.status }),
          ...(updates.requestDate && { request_date: updates.requestDate }),
          ...(updates.notes !== undefined && { notes: updates.notes }),
          ...(updates.itemId && { item_id: parseInt(updates.itemId) })
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error('Failed to update request')
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
            itemId: record.item_id,
            quantity: record.quantity,
            requester: record.requester,
            department: record.department,
            status: record.status,
            requestDate: record.request_date,
            notes: record.notes,
            name: record.Name
          }
        }
      }
      
      throw new Error('No records were updated')
    } catch (error) {
      console.error("Error updating request:", error)
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
        throw new Error('Failed to delete request')
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
      console.error("Error deleting request:", error)
      throw error
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "quantity" } },
          { Field: { Name: "requester" } },
          { Field: { Name: "department" } },
          { Field: { Name: "status" } },
          { Field: { Name: "request_date" } },
          { Field: { Name: "notes" } },
          { Field: { Name: "item_id" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "ExactMatch",
            Values: [status]
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
        itemId: record.item_id,
        quantity: record.quantity,
        requester: record.requester,
        department: record.department,
        status: record.status,
        requestDate: record.request_date,
        notes: record.notes,
        name: record.Name
      })) || []
    } catch (error) {
      console.error("Error fetching requests by status:", error)
      return []
    }
  }

  async getPendingRequests() {
    return this.getByStatus('pending')
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