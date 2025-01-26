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
      <h2 className="text-xl font-semibold">Payment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, currency: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
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
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="deferred">Deferred</SelectItem>
              <SelectItem value="installments">Installments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidAmount">Paid Amount</Label>
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
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? format(formData.dueDate, "PPP")
                    : "Pick a date"}
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
            <Label>Installment Type</Label>
            <Select
              value={formData.installmentType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  installmentType: value,
                  customInstallments: undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select installment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.installmentType === "recurring" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Pick a date"}
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
                <Label>Interval</Label>
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
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Installment Amount</Label>
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
                <Plus className="mr-2 h-4 w-4" />
                Add Installment
              </Button>

              {formData.customInstallments?.map((installment, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
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
                      <Label>Amount</Label>
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