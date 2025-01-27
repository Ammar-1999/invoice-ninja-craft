import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { InvoiceData } from "../BillingForm";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PaymentSectionProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const PaymentSection = ({ formData, setFormData }: PaymentSectionProps) => {
  const [showCustomInstallments, setShowCustomInstallments] = useState(false);

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
        i === index
          ? { ...installment, [field]: value }
          : installment
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">تفاصيل الدفع</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currency">العملة</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, currency: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر العملة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">دولار أمريكي</SelectItem>
              <SelectItem value="EUR">يورو</SelectItem>
              <SelectItem value="SAR">ريال سعودي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">طريقة الدفع</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                paymentMethod: value,
                installmentType: undefined,
                customInstallments: undefined,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر طريقة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">نقدي</SelectItem>
              <SelectItem value="deferred">آجل</SelectItem>
              <SelectItem value="installments">أقساط</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidAmount">المبلغ المدفوع</Label>
          <Input
            type="number"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                paidAmount: parseFloat(e.target.value),
              }))
            }
            placeholder="0.00"
          />
        </div>

        {formData.paymentMethod === "deferred" && (
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
        )}
      </div>

      {formData.paymentMethod === "installments" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>نوع التقسيط</Label>
            <ToggleGroup
              type="single"
              defaultValue="recurring"
              value={formData.installmentType || "recurring"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  installmentType: value as "recurring" | "custom",
                  customInstallments: undefined,
                }))
              }
              className="justify-start"
            >
              <ToggleGroupItem value="recurring">دوري</ToggleGroupItem>
              <ToggleGroupItem value="custom">مخصص</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {(formData.installmentType || "recurring") === "recurring" && (
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
                <Label>تاريخ النهاية</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-right font-normal"
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
                        interval: parseInt(e.target.value),
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
                      installmentAmount: parseFloat(e.target.value),
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {formData.installmentType === "custom" && (
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
                            parseFloat(e.target.value)
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
          )}
        </div>
      )}
    </div>
  );
};
