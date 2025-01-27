import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { InvoiceData } from "../BillingForm";

const mockGroups = [
  { id: "1", name: "إلكترونيات" },
  { id: "2", name: "مستلزمات مكتبية" },
  { id: "3", name: "برمجيات" },
];

const mockProducts = {
  "1": [
    { id: "e1", name: "لابتوب", price: 999.99 },
    { id: "e2", name: "شاشة", price: 299.99 },
    { id: "e3", name: "لوحة مفاتيح", price: 79.99 },
  ],
  "2": [
    { id: "o1", name: "ورق", price: 9.99 },
    { id: "o2", name: "أقلام", price: 4.99 },
    { id: "o3", name: "دباسة", price: 7.99 },
  ],
  "3": [
    { id: "s1", name: "أوفيس 365", price: 99.99 },
    { id: "s2", name: "مضاد فيروسات", price: 49.99 },
    { id: "s3", name: "برنامج تصميم", price: 599.99 },
  ],
};

interface ProductSelectionProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const ProductSelection = ({
  formData,
  setFormData,
}: ProductSelectionProps) => {
  const handleAddProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { id: productId, quantity: 1 }],
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, quantity } : p
      ),
    }));
  };

  const getProductDetails = (productId: string) => {
    if (!formData.group) return null;
    return mockProducts[formData.group as keyof typeof mockProducts].find(
      (p) => p.id === productId
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">المنتجات</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="group">مجموعة المنتجات</Label>
          <Select
            value={formData.group}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, group: value, products: [] }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مجموعة" />
            </SelectTrigger>
            <SelectContent>
              {mockGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.group && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>إضافة منتج</Label>
              <Select onValueChange={handleAddProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر منتج" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts[formData.group as keyof typeof mockProducts]
                    .filter(
                      (product) =>
                        !formData.products.some((p) => p.id === product.id)
                    )
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {formData.products.map((product) => {
                const details = getProductDetails(product.id);
                if (!details) return null;

                return (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{details.name}</p>
                      <p className="text-sm text-gray-500">
                        ${details.price.toFixed(2)}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min="1"
                      className="w-24"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, parseInt(e.target.value))
                      }
                      placeholder="الكمية"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
