import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { InvoiceData } from "../../BillingForm";
import { useEffect } from "react";

interface RecurringInstallmentsProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  totalAmount: number;
}

export const RecurringInstallments = ({
  formData,
  setFormData,
  totalAmount,
}: RecurringInstallmentsProps) => {
  const remainingAmount = totalAmount - (formData.paidAmount || 0);

  useEffect(() => {
    if (formData.endDate && formData.startDate && formData.interval && formData.intervalType) {
      // Reset installment amount when end date changes
      setFormData(prev => ({ ...prev, installmentAmount: undefined }));
    }
  }, [formData.endDate]);

  useEffect(() => {
    if (formData.installmentAmount) {
      // Reset end date when installment amount changes
      setFormData(prev => ({ ...prev, endDate: undefined }));
    }
  }, [formData.installmentAmount]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>تاريخ البداية</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-right font-normal"
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {formData.startDate
                ? format(formData.startDate, "PPP")
                : "اختر التاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.startDate}
              onSelect={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: date || undefined,
                }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>الفترة</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={formData.interval}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                interval: parseInt(e.target.value) || undefined,
              }))
            }
            placeholder="1"
            className="flex-1"
          />
          <Select
            value={formData.intervalType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, intervalType: value }))
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">أيام</SelectItem>
              <SelectItem value="months">شهور</SelectItem>
              <SelectItem value="years">سنوات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>قيمة القسط</Label>
        <Input
          type="number"
          value={formData.installmentAmount}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              installmentAmount: parseFloat(e.target.value) || undefined,
              endDate: undefined, // Reset end date when amount changes
            }))
          }
          placeholder="0.00"
          disabled={!!formData.endDate}
        />
      </div>

      <div className="space-y-2">
        <Label>تاريخ النهاية</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-right font-normal"
              disabled={!!formData.installmentAmount}
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {formData.endDate
                ? format(formData.endDate, "PPP")
                : "اختر التاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.endDate}
              onSelect={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  endDate: date || undefined,
                  installmentAmount: undefined, // Reset amount when end date changes
                }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};