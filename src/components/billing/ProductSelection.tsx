import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceData } from "../BillingForm";

const mockGroups = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Office Supplies" },
  { id: "3", name: "Software" },
];

const mockProducts = {
  "1": [
    { id: "e1", name: "Laptop", price: 999.99 },
    { id: "e2", name: "Monitor", price: 299.99 },
    { id: "e3", name: "Keyboard", price: 79.99 },
  ],
  "2": [
    { id: "o1", name: "Paper", price: 9.99 },
    { id: "o2", name: "Pens", price: 4.99 },
    { id: "o3", name: "Stapler", price: 7.99 },
  ],
  "3": [
    { id: "s1", name: "Office 365", price: 99.99 },
    { id: "s2", name: "Antivirus", price: 49.99 },
    { id: "s3", name: "Design Suite", price: 599.99 },
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
  const handleProductChange = (productId: string, quantity: number) => {
    setFormData((prev) => {
      const existingProducts = prev.products.filter((p) => p.id !== productId);
      return {
        ...prev,
        products:
          quantity > 0
            ? [...existingProducts, { id: productId, quantity }]
            : existingProducts,
      };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Products</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="group">Product Group</Label>
          <Select
            value={formData.group}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, group: value, products: [] }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a group" />
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
            <Label>Products</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProducts[formData.group as keyof typeof mockProducts].map(
                (product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      className="w-24"
                      value={
                        formData.products.find((p) => p.id === product.id)
                          ?.quantity || ""
                      }
                      onChange={(e) =>
                        handleProductChange(product.id, parseInt(e.target.value))
                      }
                      placeholder="Qty"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};