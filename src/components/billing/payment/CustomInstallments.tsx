import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { InvoiceData } from "../../BillingForm";

interface CustomInstallmentsProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const CustomInstallments = ({
  formData,
  setFormData,
}: CustomInstallmentsProps) => {
  const handleAddCustomInstallment = () => {
    setFormData((prev) => ({
      ...prev,
      customInstallments: [
        ...(prev.customInstallments || []),
        { date: new Date(), amount: 0 },
      ],
    }));
  };

  const handleRemoveCustomInstallment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customInstallments: prev.customInstallments?.filter((_, i) => i !== index),
    }));
  };

  const handleCustomInstallmentChange = (
    index: number,
    field: "date" | "amount",
    value: Date | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      customInstallments: prev.customInstallments?.map((installment, i) =>
        i === index ? { ...installment, [field]: value } : installment
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleAddCustomInstallment}
        className="w-full"
      >
        <Plus className="ml-2 h-4 w-4" />
        إضافة قسط
      </Button>

      {formData.customInstallments?.map((installment, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <Label>التاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right font-normal"
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {format(installment.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={installment.date}
                    onSelect={(date) =>
                      handleCustomInstallmentChange(
                        index,
                        "date",
                        date || new Date()
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>المبلغ</Label>
              <Input
                type="number"
                value={installment.amount}
                onChange={(e) =>
                  handleCustomInstallmentChange(
                    index,
                    "amount",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-6"
            onClick={() => handleRemoveCustomInstallment(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};