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
import {MoreHorizontal,Edit,Trash} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Unit {
    id: string;
    name: string;
}


const Units = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filters, setFilters] = useState({
        search: "",
    });

    // Fetch Units
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/unit/list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // if protected
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch units");

                const result = await res.json();
                setUnits(result.data || result); // Adjust depending on your backend response
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnits();
    }, []);

    // Apply Filters
    const filteredUnits = useMemo(() => {
        return units.filter((unit) => {
            // search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (
                    !unit.name.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }
            return true;
        });
    }, [filters, units]);

    const clearFilters = () => {
        setFilters({
            search: "",
        });
    };

    const handleEditUnit = (unit: Unit) => {
        navigate(`/units/edit/${unit.id}`, { state: { unit } });
    };
    const handleDeleteUnit = async (unit: Unit) => {
        try {
            const res = await fetch(`http://localhost:5000/api/unit/delete/${unit.id}`, {
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

                setUnits((prevUnits) => prevUnits.filter((u) => u.id !== unit.id));
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete unit.",
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


    return (
        <Layout currentPath="/units">
            <DashboardHeader
                title="Units Management"
                showCreateButton
                createButtonText="New Unit"
                onCreateClick={() => navigate("/units/create")}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Units List</CardTitle>
                </CardHeader>
                <CardContent>
                    <FilterBar
                        onSearchChange={(search) => setFilters({ ...filters, search })}
                        // onStatusFilter={(status) => setFilters({ ...filters, status })}
                        onClearFilters={clearFilters}
                        // type="units"
                        activeFilters={filters}
                    />

                    <div className="mt-6">
                        {isLoading ? (
                            <div className="text-center py-8">Loading units...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-destructive">
                                {error}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUnits.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No units found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUnits.map((unit) => (
                                            <TableRow key={unit.id}>
                                                <TableCell className="font-medium">{unit.name}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Unit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteUnit(unit)}>
                                                                <Trash className="mr-2 h-4 w-4 text-red-500" />
                                                                Delete Unit
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

export default Units;
