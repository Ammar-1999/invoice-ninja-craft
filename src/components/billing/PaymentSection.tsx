import { InvoiceData } from "../BillingForm";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { BasicPaymentInfo } from "./payment/BasicPaymentInfo";
import { DeferredPayment } from "./payment/DeferredPayment";
import { RecurringInstallments } from "./payment/RecurringInstallments";
import { CustomInstallments } from "./payment/CustomInstallments";

interface PaymentSectionProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const PaymentSection = ({ formData, setFormData }: PaymentSectionProps) => {
  const totalAmount = 1000; // This should be calculated based on selected products

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">تفاصيل الدفع</h2>

      <BasicPaymentInfo formData={formData} setFormData={setFormData} />

      {formData.paymentMethod === "deferred" && (
        <DeferredPayment formData={formData} setFormData={setFormData} />
      )}

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
            <RecurringInstallments
              formData={formData}
              setFormData={setFormData}
              totalAmount={totalAmount}
            />
          )}

          {formData.installmentType === "custom" && (
            <CustomInstallments formData={formData} setFormData={setFormData} />
          )}
        </div>
      )}
    </div>
  );
};