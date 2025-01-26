import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BillingForm } from "@/components/BillingForm";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing System</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage invoices easily
          </p>
        </div>
        
        <Card className="p-6">
          <BillingForm />
        </Card>
      </div>
    </div>
  );
};

export default Index;