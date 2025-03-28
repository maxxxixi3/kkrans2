import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Define the vehicle schema for form validation
const vehicleFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  licensePlate: z.string().min(1, { message: "Kennzeichen ist erforderlich." }),
  tuev: z.string().optional(),
  active: z.boolean().default(true),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

// Define the vehicle type
interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  tuev?: string;
  active: boolean;
}

const VehicleManagement = ({
  vehicles = mockVehicles,
}: {
  vehicles?: Vehicle[];
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Initialize the form with react-hook-form
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: "",
      licensePlate: "",
      tuev: "",
      active: true,
    },
  });

  // Initialize the edit form
  const editForm = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: selectedVehicle?.name || "",
      licensePlate: selectedVehicle?.licensePlate || "",
      tuev: selectedVehicle?.tuev || "",
      active: selectedVehicle?.active || true,
    },
  });

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (isAddDialogOpen) {
      form.reset();
    }
  }, [isAddDialogOpen, form]);

  // Update edit form when selected vehicle changes
  React.useEffect(() => {
    if (selectedVehicle) {
      editForm.reset({
        name: selectedVehicle.name,
        licensePlate: selectedVehicle.licensePlate,
        tuev: selectedVehicle.tuev || "",
        active: selectedVehicle.active,
      });
    }
  }, [selectedVehicle, editForm]);

  // Handle form submission for adding a new vehicle
  const onSubmit = (data: VehicleFormValues) => {
    // Here you would typically send the data to your backend
    console.log("Add vehicle:", data);
    setIsAddDialogOpen(false);
  };

  // Handle form submission for editing a vehicle
  const onEditSubmit = (data: VehicleFormValues) => {
    // Here you would typically update the vehicle in your backend
    console.log("Edit vehicle:", data);
    setIsEditDialogOpen(false);
  };

  // Handle vehicle deletion
  const onDeleteConfirm = () => {
    // Here you would typically delete the vehicle from your backend
    console.log("Delete vehicle:", selectedVehicle);
    setIsDeleteDialogOpen(false);
  };

  // Handle opening the edit dialog
  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  // Handle opening the delete dialog
  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  // Handle toggling vehicle active status
  const handleToggleActive = (vehicle: Vehicle) => {
    // Here you would typically update the vehicle's active status in your backend
    console.log("Toggle active status for vehicle:", vehicle);

    // For demo purposes, let's update the local state
    const updatedVehicles = mockVehicles.map((v) => {
      if (v.id === vehicle.id) {
        return { ...v, active: !v.active };
      }
      return v;
    });

    // In a real app, you would update the state with the new vehicles array
    console.log("Updated vehicles:", updatedVehicles);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fahrzeugverwaltung</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Fahrzeug hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Fahrzeug hinzufügen</DialogTitle>
              <DialogDescription>
                Fügen Sie ein neues Fahrzeug zu Ihrer Flotte hinzu. Dies wird
                die verfügbaren Buchungsslots beeinflussen.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Fahrzeugname eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kennzeichen</FormLabel>
                      <FormControl>
                        <Input placeholder="Kennzeichen eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tuev"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TÜV</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Datum der nächsten TÜV-Prüfung.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Aktiv Status</FormLabel>
                        <FormDescription>
                          Inaktive Fahrzeuge stehen nicht für Buchungen zur
                          Verfügung.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Abbrechen
                    </Button>
                  </DialogClose>
                  <Button type="submit">Fahrzeug hinzufügen</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>Liste aller Fahrzeuge in Ihrer Flotte.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Kennzeichen</TableHead>
            <TableHead>TÜV</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.name}</TableCell>
              <TableCell>{vehicle.licensePlate}</TableCell>
              <TableCell>{vehicle.tuev || "Nicht angegeben"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={vehicle.active}
                    onCheckedChange={() => handleToggleActive(vehicle)}
                  />
                  <span
                    className={
                      vehicle.active ? "text-green-600" : "text-red-600"
                    }
                  >
                    {vehicle.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(vehicle)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fahrzeug bearbeiten</DialogTitle>
            <DialogDescription>
              Aktualisieren Sie die Details dieses Fahrzeugs.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Fahrzeugname eingeben" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kennzeichen</FormLabel>
                    <FormControl>
                      <Input placeholder="Kennzeichen eingeben" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="tuev"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TÜV</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Datum der nächsten TÜV-Prüfung.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Aktiv Status</FormLabel>
                      <FormDescription>
                        Inaktive Fahrzeuge stehen nicht für Buchungen zur
                        Verfügung.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Abbrechen
                  </Button>
                </DialogClose>
                <Button type="submit">Änderungen speichern</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fahrzeug löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 mb-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-sm text-red-600">
              Das Löschen dieses Fahrzeugs entfernt es aus allen zukünftigen
              Buchungen.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Abbrechen
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={onDeleteConfirm}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Mock data for vehicles
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Mercedes Sprinter",
    licensePlate: "M-KT 1234",
    tuev: "2024-12-31",
    active: true,
  },
  {
    id: "2",
    name: "VW Transporter",
    licensePlate: "M-KT 5678",
    tuev: "2025-06-15",
    active: true,
  },
  {
    id: "3",
    name: "Ford Transit",
    licensePlate: "M-KT 9012",
    tuev: "2024-09-22",
    active: false,
  },
];

export default VehicleManagement;
