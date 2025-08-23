import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash, Package, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ItemData {
    id: string;
    itemCode: string;
    itemName: string;
    type: 'item' | 'service';
    unit?: string;
    serviceUnit?: string;
    sellingPrice: number;
    purchasePrice?: number;
    mrp?: number;
    openingStock?: number;
    minStock?: number;
    taxStatus: string;
    gstRate: number;
    isActive: boolean;
    createdAt: string;
}

const Item = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [items, setItems] = useState<ItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        taxStatus: "",
    });

    // Fetch Items
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/item/list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                    body: JSON.stringify({
                        search: filters.search,
                        type: filters.type,
                        taxStatus: filters.taxStatus,
                        page: 1,
                        limit: 50
                    }),
                });

                if (!res.ok) throw new Error("Failed to fetch items");

                const result = await res.json();
                const rawList: any[] = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];
                const normalized = rawList.map((i: any) => ({
                    ...i,
                    id: i.id || i._id,
                    sellingPrice: Number(i.sellingPrice || 0),
                    purchasePrice: Number(i.purchasePrice || 0),
                    mrp: Number(i.mrp || 0),
                    openingStock: typeof i.openingStock === 'number' ? i.openingStock : Number(i.openingStock || 0),
                    minStock: typeof i.minStock === 'number' ? i.minStock : Number(i.minStock || 0),
                    gstRate: Number(i.gstRate || 0),
                }));
                setItems(normalized);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [filters]);

    // Apply Filters
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (
                    !item.itemName.toLowerCase().includes(searchLower) &&
                    !item.itemCode.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            // type filter
            if (filters.type && item.type !== filters.type) {
                return false;
            }

            // tax status filter
            if (filters.taxStatus && item.taxStatus !== filters.taxStatus) {
                return false;
            }

            return true;
        });
    }, [filters, items]);

    const clearFilters = () => {
        setFilters({
            search: "",
            type: "",
            taxStatus: "",
        });
    };

    const handleEditItem = (item: ItemData) => {
        navigate(`/item/edit/${item.id}`, { state: { item } });
    };

    const handleDeleteItem = async (item: ItemData) => {
        if (!confirm(`Are you sure you want to delete ${item.itemName}?`)) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/item/delete/${item.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });

            const result = await res.json();

            if (result.status === true) {
                toast({
                    title: result.message,
                });

                setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete item.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        }
    };

    const getTypeBadge = (type: string) => {
        return type === 'service' ? (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Wrench className="w-3 h-3 mr-1" />
                Service
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Package className="w-3 h-3 mr-1" />
                Item
            </Badge>
        );
    };

    const getTaxStatusBadge = (status: string) => {
        switch (status) {
            case 'taxable':
                return <Badge variant="default" className="bg-green-100 text-green-800">Taxable</Badge>;
            case 'exempt':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Exempt</Badge>;
            case 'non-gst':
                return <Badge variant="outline" className="bg-gray-100 text-gray-800">Non-GST</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Layout currentPath="/item">
            <DashboardHeader
                title="Items & Services Management"
                showCreateButton
                createButtonText="New Item/Service"
                onCreateClick={() => navigate("/item/create")}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Items & Services List</CardTitle>
                </CardHeader>
                <CardContent>
                    <FilterBar
                        onSearchChange={(search) => setFilters({ ...filters, search })}
                        onClearFilters={clearFilters}
                        activeFilters={filters}
                    />
                    
                    {/* Additional Filters */}
                    <div className="flex gap-4 mt-4">
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="item">Items</option>
                            <option value="service">Services</option>
                        </select>
                        <select
                            value={filters.taxStatus}
                            onChange={(e) => setFilters({ ...filters, taxStatus: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">All Tax Status</option>
                            <option value="taxable">Taxable</option>
                            <option value="exempt">Exempt</option>
                            <option value="non-gst">Non-GST</option>
                        </select>
                    </div>

                    <div className="mt-6">
                        {isLoading ? (
                            <div className="text-center py-8">Loading items...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-destructive">
                                {error}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Tax Status</TableHead>
                                        <TableHead>GST Rate</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No items found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {item.itemCode}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.itemName}
                                                </TableCell>
                                                <TableCell>
                                                    {getTypeBadge(item.type)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.type === 'service' ? item.serviceUnit : item.unit}
                                                </TableCell>
                                                <TableCell>
                                                    ₹{Number(item.sellingPrice).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {getTaxStatusBadge(item.taxStatus)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.gstRate > 0 ? `${item.gstRate}%` : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.type === 'item' && item.openingStock !== undefined ? (
                                                        <span className={item.openingStock <= (item.minStock || 0) ? 'text-red-600 font-semibold' : ''}>
                                                            {item.openingStock}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit {item.type === 'service' ? 'Service' : 'Item'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDeleteItem(item)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete {item.type === 'service' ? 'Service' : 'Item'}
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
        </Layout>
    );
};

export default Item;
