// API service for communicating with MongoDB backend
const API_BASE_URL = 'http://localhost:3001/api'; // Update with your Node.js server URL

interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
  items: number;
}

interface PurchaseOrder {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  status: string;
  items: number;
  dueDate: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Sales Orders
  async getSalesOrders(): Promise<SalesOrder[]> {
    return this.request<SalesOrder[]>('/sales');
  }

  async getSalesOrder(id: string): Promise<SalesOrder> {
    return this.request<SalesOrder>(`/sales/${id}`);
  }

  async createSalesOrder(order: Omit<SalesOrder, 'id'>): Promise<SalesOrder> {
    return this.request<SalesOrder>('/sales', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateSalesOrder(id: string, order: Partial<SalesOrder>): Promise<SalesOrder> {
    return this.request<SalesOrder>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  async deleteSalesOrder(id: string): Promise<void> {
    return this.request<void>(`/sales/${id}`, {
      method: 'DELETE',
    });
  }

  // Purchase Orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.request<PurchaseOrder[]>('/purchases');
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>(`/purchases/${id}`);
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>('/purchases', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>(`/purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    return this.request<void>(`/purchases/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard metrics
  async getDashboardMetrics() {
    return this.request<any>('/dashboard/metrics');
  }
}

export const apiService = new ApiService();
export type { SalesOrder, PurchaseOrder };