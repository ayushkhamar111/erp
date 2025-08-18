import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, SalesOrder, PurchaseOrder } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Sales Orders hooks
export const useSalesOrders = () => {
  return useQuery({
    queryKey: ['salesOrders'],
    queryFn: apiService.getSalesOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSalesOrder = (id: string) => {
  return useQuery({
    queryKey: ['salesOrder', id],
    queryFn: () => apiService.getSalesOrder(id),
    enabled: !!id,
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      toast({
        title: 'Success',
        description: 'Sales order created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create sales order',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSalesOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, order }: { id: string; order: Partial<SalesOrder> }) => 
      apiService.updateSalesOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      queryClient.invalidateQueries({ queryKey: ['salesOrder'] });
      toast({
        title: 'Success',
        description: 'Sales order updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update sales order',
        variant: 'destructive',
      });
    },
  });
};

// Purchase Orders hooks
export const usePurchaseOrders = () => {
  return useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: apiService.getPurchaseOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePurchaseOrder = (id: string) => {
  return useQuery({
    queryKey: ['purchaseOrder', id],
    queryFn: () => apiService.getPurchaseOrder(id),
    enabled: !!id,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create purchase order',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, order }: { id: string; order: Partial<PurchaseOrder> }) => 
      apiService.updatePurchaseOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrder'] });
      toast({
        title: 'Success',
        description: 'Purchase order updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update purchase order',
        variant: 'destructive',
      });
    },
  });
};

// Dashboard hooks
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: apiService.getDashboardMetrics,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};