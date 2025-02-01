import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { InvoiceData } from "../../BillingForm";
import { Label } from "@/components/ui/label";

interface DeferredPaymentProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const DeferredPayment = ({ formData, setFormData }: DeferredPaymentProps) => {
  return (
    <div className="space-y-2">
      <Label>تاريخ الاستحقاق</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-right font-normal"
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {formData.dueDate
              ? format(formData.dueDate, "PPP")
              : "اختر التاريخ"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formData.dueDate}
            onSelect={(date) =>
              setFormData((prev) => ({ ...prev, dueDate: date || undefined }))
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};