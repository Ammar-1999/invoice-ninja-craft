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
import { InvoiceData, ProductDeliveryStatus } from "../BillingForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";

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
      products: [
        ...prev.products,
        {
          id: productId,
          quantity: 1,
          status: formData.deliveryMethod === "scheduled" ? "pending" : undefined,
        },
      ],
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

  const handleDeliveryDateChange = (productId: string, date: Date) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, deliveryDate: date } : p
      ),
    }));
  };

  const handleStatusChange = (productId: string, status: ProductDeliveryStatus) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, status } : p
      ),
    }));
  };

  const handleNotesChange = (productId: string, notes: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, notes } : p
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
          <Label>طريقة التسليم</Label>
          <RadioGroup
            value={formData.deliveryMethod}
            onValueChange={(value: "immediate" | "scheduled") =>
              setFormData((prev) => ({
                ...prev,
                deliveryMethod: value,
                singleDeliveryDate: undefined,
                products: prev.products.map((p) => ({
                  ...p,
                  deliveryDate: undefined,
                  status: value === "scheduled" ? "pending" : undefined,
                  notes: undefined,
                })),
              }))
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">حالاً</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled">دفعات</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.deliveryMethod === "scheduled" && (
          <div className="space-y-2">
            <Label>تسليم جميع المنتجات في تاريخ واحد</Label>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-right font-normal",
                      !formData.singleDeliveryDate && "text-muted-foreground"
                    )}
                  >
                    {formData.singleDeliveryDate ? (
                      format(formData.singleDeliveryDate, "PPP", { locale: ar })
                    ) : (
                      "اختر تاريخ"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.singleDeliveryDate}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        singleDeliveryDate: date || undefined,
                        products: prev.products.map((p) => ({
                          ...p,
                          deliveryDate: date || undefined,
                        })),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formData.singleDeliveryDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      singleDeliveryDate: undefined,
                    }))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

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
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{details.name}</p>
                        <p className="text-sm text-gray-500">
                          ${details.price.toFixed(2)}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min="1"
                        className="w-24 mx-4"
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

                    {formData.deliveryMethod === "scheduled" && !formData.singleDeliveryDate && (
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
                                  handleDeliveryDateChange(product.id, date as Date)
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
                              handleStatusChange(product.id, value)
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
                            onChange={(e) =>
                              handleNotesChange(product.id, e.target.value)
                            }
                            placeholder="أضف ملاحظات خاصة بالمنتج"
                          />
                        </div>
                      </div>
                    )}
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