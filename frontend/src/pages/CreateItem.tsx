import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Wrench, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateItem() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isServiceMode, setIsServiceMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unitOptions, setUnitOptions] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        itemCode: "",
        itemName: "",
        hsnCode: "",
        unit: "",
        serviceUnit: "",
        purchasePrice: "",
        sellingPrice: "",
        mrp: "",
        openingStock: "",
        openingStockValue: "",
        minStock: "",
        description: "",
        taxStatus: "taxable",
        gstRate: "18",
    });

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/unit/list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                });
                const data = await res.json();
                const units = (data.data || data || []).map((u: any) => u.name).filter(Boolean);
                setUnitOptions(units);
            } catch (e) {
                // Non-blocking
            }
        };
        fetchUnits();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const switchToItem = () => setIsServiceMode(false);
    const switchToService = () => setIsServiceMode(true);

    const generateCode = () => {
        if (!formData.itemName) return;
        const prefix = isServiceMode ? "SRV" : "ITM";
        const code = prefix + Date.now().toString().slice(-6);
        setFormData(prev => ({ ...prev, itemCode: code }));
    };

    const resetForm = () => {
        setFormData({
            itemCode: "",
            itemName: "",
            hsnCode: "",
            unit: "",
            serviceUnit: "",
            purchasePrice: "",
            sellingPrice: "",
            mrp: "",
            openingStock: "",
            openingStockValue: "",
            minStock: "",
            description: "",
            taxStatus: "taxable",
            gstRate: "18",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validations
        if (!formData.itemCode.trim()) {
            toast({ title: "Validation", description: "Item code is required", variant: "destructive" });
            return;
        }
        if (!formData.itemName.trim()) {
            toast({ title: "Validation", description: `${isServiceMode ? "Service" : "Item"} name is required`, variant: "destructive" });
            return;
        }
        if (isServiceMode && !formData.serviceUnit) {
            toast({ title: "Validation", description: "Service unit is required", variant: "destructive" });
            return;
        }
        if (!isServiceMode && !formData.unit) {
            toast({ title: "Validation", description: "Unit is required", variant: "destructive" });
            return;
        }
        const selling = parseFloat(formData.sellingPrice || "0");
        if (Number.isNaN(selling) || selling < 0) {
            toast({ title: "Validation", description: "Selling price must be a valid non-negative number", variant: "destructive" });
            return;
        }
        const mrp = parseFloat(formData.mrp || "0");
        if (!isServiceMode && mrp > 0 && selling > mrp) {
            toast({ title: "Validation", description: "Selling price cannot be higher than MRP", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                type: isServiceMode ? "service" : "item",
                purchasePrice: parseFloat(formData.purchasePrice) || 0,
                sellingPrice: selling || 0,
                mrp: mrp || 0,
                openingStock: parseInt(formData.openingStock) || 0,
                openingStockValue: parseFloat(formData.openingStockValue) || 0,
                minStock: parseInt(formData.minStock) || 0,
                gstRate: formData.taxStatus === "exempt" ? 0 : parseFloat(formData.gstRate || "0")
            };

            const response = await fetch("http://localhost:5000/api/item/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.status) {
                toast({
                    title: "Success",
                    description: `${isServiceMode ? "Service" : "Item"} created successfully!`,
                });
                resetForm();
                navigate("/item");
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to create item",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/item");
    };

    return (
        <Layout currentPath="/item">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {isServiceMode ? "Create New Service" : "Create New Item"}
                        </h1>
                        <p className="text-muted-foreground mt-1">Indian Accounting System - Item & Service Master</p>
                    </div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-4 justify-center mb-6">
                    <Button
                        variant={!isServiceMode ? "default" : "outline"}
                        onClick={switchToItem}
                    >
                        <Package className="w-4 h-4 mr-2" />
                        Item
                    </Button>
                    <Button
                        variant={isServiceMode ? "default" : "outline"}
                        onClick={switchToService}
                    >
                        <Wrench className="w-4 h-4 mr-2" />
                        Service
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="itemCode" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Code" : "Item Code"} *
                                    </Label>
                                    <Input
                                        id="itemCode"
                                        value={formData.itemCode}
                                        onChange={(e) => handleInputChange("itemCode", e.target.value)}
                                        placeholder={isServiceMode ? "e.g., SRV001" : "e.g., ITM001"}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="itemName" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Name" : "Item Name"} *
                                    </Label>
                                    <Input
                                        id="itemName"
                                        value={formData.itemName}
                                        onChange={(e) => handleInputChange("itemName", e.target.value)}
                                        placeholder={`Enter ${isServiceMode ? "service" : "item"} name`}
                                        required
                                        onBlur={generateCode}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hsnCode" className="text-sm font-semibold">
                                        {isServiceMode ? "SAC Code" : "HSN/SAC Code"}
                                    </Label>
                                    <Input
                                        id="hsnCode"
                                        value={formData.hsnCode}
                                        onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                                        placeholder="e.g., 1234567890"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Unit" : "Unit of Measurement"} *
                                    </Label>
                                    <Select
                                        value={isServiceMode ? formData.serviceUnit : formData.unit}
                                        onValueChange={(value) =>
                                            handleInputChange(isServiceMode ? "serviceUnit" : "unit", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${isServiceMode ? "unit" : "unit"}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unitOptions.length === 0 ? (
                                                <SelectItem value="pcs">Pieces (PCS)</SelectItem>
                                            ) : (
                                                unitOptions.map((u) => (
                                                    <SelectItem key={u} value={u}>{u}</SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {!isServiceMode && (
                                    <div className="space-y-2">
                                        <Label htmlFor="purchasePrice" className="text-sm font-semibold">
                                            Purchase Price
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                            <Input
                                                id="purchasePrice"
                                                type="number"
                                                value={formData.purchasePrice}
                                                onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="sellingPrice" className="text-sm font-semibold">
                                        {isServiceMode ? "Service Rate" : "Selling Price"} *
                                    </Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        <Input
                                            id="sellingPrice"
                                            type="number"
                                            value={formData.sellingPrice}
                                            onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                {!isServiceMode && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="mrp" className="text-sm font-semibold">
                                                MRP
                                            </Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                <Input
                                                    id="mrp"
                                                    type="number"
                                                    value={formData.mrp}
                                                    onChange={(e) => handleInputChange("mrp", e.target.value)}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    className="pl-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="openingStock" className="text-sm font-semibold">
                                                Opening Stock
                                            </Label>
                                            <Input
                                                id="openingStock"
                                                type="number"
                                                value={formData.openingStock}
                                                onChange={(e) => handleInputChange("openingStock", e.target.value)}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="openingStockValue" className="text-sm font-semibold">
                                                Opening Stock Value
                                            </Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                <Input
                                                    id="openingStockValue"
                                                    type="number"
                                                    value={formData.openingStockValue}
                                                    onChange={(e) => handleInputChange("openingStockValue", e.target.value)}
                                                    placeholder="0"
                                                    min="0"
                                                    className="pl-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="minStock" className="text-sm font-semibold">
                                                Minimum Stock Level
                                            </Label>
                                            <Input
                                                id="minStock"
                                                type="number"
                                                value={formData.minStock}
                                                onChange={(e) => handleInputChange("minStock", e.target.value)}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold">
                                    {isServiceMode ? "Service Description" : "Description"}
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder={`Enter ${isServiceMode ? "service" : "item"} description...`}
                                    rows={4}
                                />
                            </div>

                            {/* GST Configuration */}
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-800">GST Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="taxStatus" className="text-sm font-semibold">
                                                Tax Status *
                                            </Label>
                                            <Select
                                                value={formData.taxStatus}
                                                onValueChange={(value) => handleInputChange("taxStatus", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="taxable">Taxable</SelectItem>
                                                    <SelectItem value="exempt">Exempt</SelectItem>
                                                    <SelectItem value="non-gst">Non-GST</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gstRate" className="text-sm font-semibold">
                                                GST Rate *
                                            </Label>
                                            <Select
                                                value={formData.gstRate}
                                                onValueChange={(value) => handleInputChange("gstRate", value)}
                                                disabled={formData.taxStatus === "exempt"}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select GST Rate" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0% GST</SelectItem>
                                                    <SelectItem value="1.25">1.25% GST</SelectItem>
                                                    <SelectItem value="3">3% GST</SelectItem>
                                                    <SelectItem value="5">5% GST</SelectItem>
                                                    <SelectItem value="12">12% GST</SelectItem>
                                                    <SelectItem value="18">18% GST</SelectItem>
                                                    <SelectItem value="28">28% GST</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> Most {isServiceMode ? "services" : "items"} attract 18% GST. 
                                            Please verify the correct rate for your specific {isServiceMode ? "service" : "item"} category.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Reset
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Creating..." : `Create ${isServiceMode ? "Service" : "Item"}`}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
