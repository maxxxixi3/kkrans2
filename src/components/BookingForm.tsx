import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Vorname ist erforderlich" }),
  lastName: z.string().min(2, { message: "Nachname ist erforderlich" }),
  email: z.string().email({ message: "Gültige E-Mail-Adresse erforderlich" }),
  phoneNumber: z.string().min(6, { message: "Telefonnummer ist erforderlich" }),
  pickupAddress: z
    .string()
    .min(5, { message: "Abholadresse ist erforderlich" }),
  destinationAddress: z
    .string()
    .min(5, { message: "Zieladresse ist erforderlich" }),
  transportType: z.string({
    required_error: "Bitte wählen Sie eine Beförderungsart",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedSlot?: Date | null;
  onSubmit?: (data: FormValues) => void;
}

const BookingForm = ({
  open = true,
  onOpenChange = () => {},
  selectedSlot = new Date(),
  onSubmit = () => {},
}: BookingFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      pickupAddress: "",
      destinationAddress: "",
      transportType: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Krankentransport buchen
          </DialogTitle>
          {selectedSlot && (
            <p className="text-center text-gray-600">
              Ausgewählter Termin: {format(selectedSlot, "dd.MM.yyyy HH:mm")}{" "}
              Uhr
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Name fields side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname</FormLabel>
                    <FormControl>
                      <Input placeholder="Vorname eingeben" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachname</FormLabel>
                    <FormControl>
                      <Input placeholder="Nachname eingeben" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone and Email fields side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefonnummer</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefonnummer eingeben" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input placeholder="E-Mail eingeben" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pickupAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abholadresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Straße, Hausnummer, PLZ, Ort"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zieladresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Straße, Hausnummer, PLZ, Ort"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beförderungsart</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Beförderungsart auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wheelchair">Rollstuhl</SelectItem>
                      <SelectItem value="carryingChair">Tragestuhl</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit">Termin buchen</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
