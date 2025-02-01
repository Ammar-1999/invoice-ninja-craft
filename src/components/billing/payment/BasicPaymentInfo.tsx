import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceData } from "../../BillingForm";

interface BasicPaymentInfoProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const BasicPaymentInfo = ({ formData, setFormData }: BasicPaymentInfoProps) => {
  return (
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
              paidAmount: parseFloat(e.target.value) || 0,
            }))
          }
          placeholder="0.00"
        />
      </div>
    </div>
  );
};