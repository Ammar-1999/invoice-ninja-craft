import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { X } from "lucide-react";
import { ProductDeliveryStatus, ProductWithDelivery } from "../../BillingForm";
import { mockProducts } from "./mockData";

interface ProductItemProps {
  product: ProductWithDelivery;
  groupId: string;
  isScheduled: boolean;
  singleDeliveryDate?: Date;
  onQuantityChange: (productId: string, quantity: number) => void;
  onPriceChange: (productId: string, price: number) => void;
  onRemove: (productId: string) => void;
  onDeliveryDateChange: (productId: string, date: Date) => void;
  onStatusChange: (productId: string, status: ProductDeliveryStatus) => void;
  onNotesChange: (productId: string, notes: string) => void;
}

export const ProductItem = ({
  product,
  groupId,
  isScheduled,
  singleDeliveryDate,
  onQuantityChange,
  onPriceChange,
  onRemove,
  onDeliveryDateChange,
  onStatusChange,
  onNotesChange,
}: ProductItemProps) => {
  const details = mockProducts[groupId as keyof typeof mockProducts].find(
    (p) => p.id === product.id
  );

  if (!details) return null;

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">{details.name}</p>
          <p className="text-sm text-gray-500">${details.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32">
            <Label>السعر</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={(e) =>
                onPriceChange(product.id, parseFloat(e.target.value))
              }
              placeholder="السعر"
            />
          </div>
          <div className="w-24">
            <Label>الكمية</Label>
            <Input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) =>
                onQuantityChange(product.id, parseInt(e.target.value))
              }
              placeholder="الكمية"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(product.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isScheduled && !singleDeliveryDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>تاريخ التسليم</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !product.deliveryDate && "text-muted-foreground"
                  )}
                >
                  {product.deliveryDate ? (
                    format(product.deliveryDate, "PPP", { locale: ar })
                  ) : (
                    "اختر تاريخ"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={product.deliveryDate}
                  onSelect={(date) =>
                    onDeliveryDateChange(product.id, date as Date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              value={product.status}
              onValueChange={(value: ProductDeliveryStatus) =>
                onStatusChange(product.id, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>ملاحظات</Label>
            <Textarea
              value={product.notes}
              onChange={(e) => onNotesChange(product.id, e.target.value)}
              placeholder="أضف ملاحظات خاصة بالمنتج"
            />
          </div>
        </div>
      )}
    </div>
  );
};