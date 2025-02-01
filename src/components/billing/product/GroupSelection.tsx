import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceData } from "../../BillingForm";
import { mockGroups, mockProducts } from "./mockData";

interface GroupSelectionProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  onProductAdd: (productId: string) => void;
}

export const GroupSelection = ({
  formData,
  setFormData,
  onProductAdd,
}: GroupSelectionProps) => {
  return (
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
        <div className="space-y-2">
          <Label>إضافة منتج</Label>
          <Select onValueChange={onProductAdd}>
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
      )}
    </div>
  );
};