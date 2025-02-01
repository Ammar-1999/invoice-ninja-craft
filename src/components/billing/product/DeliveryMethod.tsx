import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InvoiceData } from "../../BillingForm";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { X } from "lucide-react";

interface DeliveryMethodProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const DeliveryMethod = ({ formData, setFormData }: DeliveryMethodProps) => {
  return (
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
    </div>
  );
};