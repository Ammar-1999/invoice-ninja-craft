import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { InvoiceData } from "../BillingForm";

const mockClients = [
  { id: "1", name: "شركة أكمي" },
  { id: "2", name: "مؤسسة واين" },
  { id: "3", name: "صناعات ستارك" },
];

interface InvoiceInfoProps {
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export const InvoiceInfo = ({ formData, setFormData }: InvoiceInfoProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">معلومات الفاتورة</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="client">العميل</Label>
          <Select
            value={formData.client}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, client: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر العميل" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">نوع الفاتورة</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="confirmed">مؤكدة</SelectItem>
              <SelectItem value="paid">مدفوعة</SelectItem>
              <SelectItem value="canceled">ملغاة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>تاريخ الفاتورة</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-right font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, date: date || new Date() }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">رقم الفاتورة</Label>
          <Input
            id="number"
            value={formData.number}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, number: e.target.value }))
            }
            placeholder="INV-001"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="ملاحظات إضافية..."
          className="h-24"
        />
      </div>
    </div>
  );
};
