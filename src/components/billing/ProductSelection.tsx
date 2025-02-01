import { InvoiceData, ProductDeliveryStatus } from "../BillingForm";
import { DeliveryMethod } from "./product/DeliveryMethod";
import { GroupSelection } from "./product/GroupSelection";
import { ProductItem } from "./product/ProductItem";

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">المنتجات</h2>

      <div className="space-y-4">
        <DeliveryMethod formData={formData} setFormData={setFormData} />
        
        <GroupSelection
          formData={formData}
          setFormData={setFormData}
          onProductAdd={handleAddProduct}
        />

        <div className="space-y-4">
          {formData.products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              groupId={formData.group}
              isScheduled={formData.deliveryMethod === "scheduled"}
              singleDeliveryDate={formData.singleDeliveryDate}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveProduct}
              onDeliveryDateChange={handleDeliveryDateChange}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};