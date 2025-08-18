import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePurchaseOrders } from "@/hooks/useApi";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import CreatePurchaseOrderModal from "@/components/CreatePurchaseOrderModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import FilterBar from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingDown, 
  DollarSign, 
  Package,
  Truck,
  Eye,
  Edit,
  MoreHorizontal,
  Mail,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Remove static data - now fetched from MongoDB

const getStatusColor = (status: string) => {
  switch (status) {
    case "received":
      return "bg-success text-success-foreground";
    case "shipped":
      return "bg-info text-info-foreground";
    case "ordered":
      return "bg-warning text-warning-foreground";
    case "pending":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const Purchases = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: purchaseOrders = [], isLoading, error } = usePurchaseOrders();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    amountRange: { min: undefined as number | undefined, max: undefined as number | undefined },
  });

  // Filter orders based on active filters
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((order) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !order.id.toLowerCase().includes(searchLower) &&
          !order.vendor.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && order.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from) {
        const orderDate = new Date(order.date);
        if (orderDate < filters.dateRange.from) {
          return false;
        }
      }
      if (filters.dateRange.to) {
        const orderDate = new Date(order.date);
        if (orderDate > filters.dateRange.to) {
          return false;
        }
      }

      // Amount range filter
      if (filters.amountRange.min && order.amount < filters.amountRange.min) {
        return false;
      }
      if (filters.amountRange.max && order.amount > filters.amountRange.max) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEditOrder = (order: any) => {
    // Navigate to edit page with order data
    navigate(`/purchases/edit/${order.id}`, { 
      state: { order } 
    });
  };

  const handleTrackDelivery = (order: any) => {
    toast({
      title: "Tracking Delivery",
      description: `Tracking delivery for order ${order.id}`,
    });
  };

  const handleMarkReceived = (order: any) => {
    toast({
      title: "Order Received",
      description: `Marked order ${order.id} as received`,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      dateRange: { from: undefined, to: undefined },
      amountRange: { min: undefined, max: undefined },
    });
  };
  return (
    <Layout currentPath="/purchases">
      <DashboardHeader
        title="Purchase Management"
        subtitle="Manage purchase orders, vendors, and incoming goods"
        showCreateButton
        createButtonText="New Purchase Order"
        onCreateClick={() => navigate("/purchases/create")}
      />

      {/* Purchase Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Purchases
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$51,401.50</div>
            <p className="text-xs text-success">-8.2% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders This Month
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-info">15 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">34</div>
            <p className="text-xs text-warning">5 delayed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$577.80</div>
            <p className="text-xs text-success">+3.1% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar
            onSearchChange={(search) => setFilters({ ...filters, search })}
            // onStatusFilter={(status) => setFilters({ ...filters, status })}
            // onDateRangeFilter={(dateRange) => setFilters({ ...filters, dateRange: { from: dateRange.from, to: dateRange.to } })}
            // onAmountRangeFilter={(amountRange) => setFilters({ ...filters, amountRange: { min: amountRange.min, max: amountRange.max } })}
            onClearFilters={clearFilters}
            // type="purchase"
            activeFilters={filters}
          />
          
          <div className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading purchase orders...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading purchase orders. Please check your backend connection.
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.dueDate}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="font-medium">
                    ${order.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTrackDelivery(order)}>
                          <Truck className="mr-2 h-4 w-4" />
                          Track Delivery
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkReceived(order)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Received
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <OrderDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        order={selectedOrder}
        type="purchase"
      />
    </Layout>
  );
};

export default Purchases;