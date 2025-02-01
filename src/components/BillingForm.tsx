import { useState } from "react";
import { InvoiceInfo } from "./billing/InvoiceInfo";
import { ProductSelection } from "./billing/ProductSelection";
import { PaymentSection } from "./billing/PaymentSection";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export type ProductDeliveryStatus = "delivered" | "pending";

export type ProductWithDelivery = {
  id: string;
  quantity: number;
  deliveryDate?: Date;
  status?: ProductDeliveryStatus;
  notes?: string;
};

export type InvoiceData = {
  client: string;
  type: string;
  date: Date;
  number: string;
  notes: string;
  group: string;
  products: ProductWithDelivery[];
  currency: string;
  paymentMethod: string;
  paidAmount: number;
  dueDate?: Date;
  installmentType?: "recurring" | "custom";
  startDate?: Date;
  endDate?: Date;
  interval?: number;
  intervalType?: string;
  installmentAmount?: number;
  customInstallments?: Array<{ date: Date; amount: number }>;
  deliveryMethod: "immediate" | "scheduled";
  singleDeliveryDate?: Date;
};

export const BillingForm = () => {
  const [formData, setFormData] = useState<InvoiceData>({
    client: "",
    type: "draft",
    date: new Date(),
    number: "",
    notes: "",
    group: "",
    products: [],
    currency: "USD",
    paymentMethod: "cash",
    paidAmount: 0,
    deliveryMethod: "immediate",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "تم بنجاح",
      description: "تم إنشاء الفاتورة بنجاح",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <InvoiceInfo formData={formData} setFormData={setFormData} />
      <ProductSelection formData={formData} setFormData={setFormData} />
      <PaymentSection formData={formData} setFormData={setFormData} />
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button">
          حفظ كمسودة
        </Button>
        <Button type="submit">
          إنشاء الفاتورة
        </Button>
      </div>
    </form>
  );
};
