import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Truck,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Appointment {
  id: string;
  patient: Patient;
  pickupAddress: Address;
  destinationAddress: Address;
  dateTime: string;
  transportType: "wheelchair" | "carryingChair";
  status: "unassigned" | "assigned" | "inProgress" | "completed";
  vehicleId?: string;
}

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  active: boolean;
  appointments: Appointment[];
}

const AppointmentDistribution = () => {
  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<any>(null);

  // Mock data for demonstration
  const [unassignedAppointments, setUnassignedAppointments] = useState<
    Appointment[]
  >([
    {
      id: "appt-1",
      patient: {
        id: "pat-1",
        firstName: "Maria",
        lastName: "Schmidt",
        phone: "+49 123 4567890",
      },
      pickupAddress: {
        street: "Hauptstraße 1",
        city: "Berlin",
        zipCode: "10115",
      },
      destinationAddress: {
        street: "Klinikum Berlin",
        city: "Berlin",
        zipCode: "10117",
      },
      dateTime: "2023-06-15T09:30:00",
      transportType: "wheelchair",
      status: "unassigned",
    },
    {
      id: "appt-2",
      patient: {
        id: "pat-2",
        firstName: "Hans",
        lastName: "Müller",
        phone: "+49 987 6543210",
      },
      pickupAddress: {
        street: "Berliner Str. 42",
        city: "Berlin",
        zipCode: "10243",
      },
      destinationAddress: {
        street: "Charité Campus Mitte",
        city: "Berlin",
        zipCode: "10117",
      },
      dateTime: "2023-06-15T10:15:00",
      transportType: "carryingChair",
      status: "unassigned",
    },
    {
      id: "appt-3",
      patient: {
        id: "pat-3",
        firstName: "Erika",
        lastName: "Weber",
        phone: "+49 456 7891230",
      },
      pickupAddress: {
        street: "Friedrichstraße 123",
        city: "Berlin",
        zipCode: "10117",
      },
      destinationAddress: {
        street: "Vivantes Klinikum",
        city: "Berlin",
        zipCode: "13347",
      },
      dateTime: "2023-06-15T11:00:00",
      transportType: "wheelchair",
      status: "unassigned",
    },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "veh-1",
      name: "Fahrzeug 1",
      licensePlate: "B-KT 1001",
      active: true,
      appointments: [],
    },
    {
      id: "veh-2",
      name: "Fahrzeug 2",
      licensePlate: "B-KT 1002",
      active: true,
      appointments: [],
    },
    {
      id: "veh-3",
      name: "Fahrzeug 3",
      licensePlate: "B-KT 1003",
      active: false,
      appointments: [],
    },
  ]);

  // Process the confirmed move
  const processMove = () => {
    if (!pendingMove) return;

    const { source, destination } = pendingMove;

    // If moving from unassigned to a vehicle
    if (
      source.droppableId === "unassigned" &&
      destination.droppableId.startsWith("vehicle-")
    ) {
      const vehicleId = destination.droppableId.replace("vehicle-", "");
      const newUnassignedAppointments = [...unassignedAppointments];
      const [movedAppointment] = newUnassignedAppointments.splice(
        source.index,
        1,
      );

      // Update appointment status and vehicleId
      const updatedAppointment = {
        ...movedAppointment,
        status: "assigned" as const,
        vehicleId,
      };

      // Update vehicles state
      const newVehicles = vehicles.map((vehicle) => {
        if (vehicle.id === vehicleId) {
          return {
            ...vehicle,
            appointments: [...vehicle.appointments, updatedAppointment],
          };
        }
        return vehicle;
      });

      setUnassignedAppointments(newUnassignedAppointments);
      setVehicles(newVehicles);
    }
    // If moving from a vehicle to unassigned
    else if (
      source.droppableId.startsWith("vehicle-") &&
      destination.droppableId === "unassigned"
    ) {
      const sourceVehicleId = source.droppableId.replace("vehicle-", "");
      const sourceVehicle = vehicles.find((v) => v.id === sourceVehicleId);

      if (!sourceVehicle) return;

      const newVehicleAppointments = [...sourceVehicle.appointments];
      const [movedAppointment] = newVehicleAppointments.splice(source.index, 1);

      // Update appointment status and remove vehicleId
      const updatedAppointment = {
        ...movedAppointment,
        status: "unassigned" as const,
        vehicleId: undefined,
      };

      // Update vehicles state
      const newVehicles = vehicles.map((vehicle) => {
        if (vehicle.id === sourceVehicleId) {
          return {
            ...vehicle,
            appointments: newVehicleAppointments,
          };
        }
        return vehicle;
      });

      setUnassignedAppointments([
        ...unassignedAppointments,
        updatedAppointment,
      ]);
      setVehicles(newVehicles);
    }
    // If moving between vehicles
    else if (
      source.droppableId.startsWith("vehicle-") &&
      destination.droppableId.startsWith("vehicle-")
    ) {
      const sourceVehicleId = source.droppableId.replace("vehicle-", "");
      const destVehicleId = destination.droppableId.replace("vehicle-", "");

      const sourceVehicle = vehicles.find((v) => v.id === sourceVehicleId);
      const destVehicle = vehicles.find((v) => v.id === destVehicleId);

      if (!sourceVehicle || !destVehicle) return;

      const newSourceAppointments = [...sourceVehicle.appointments];
      const [movedAppointment] = newSourceAppointments.splice(source.index, 1);

      // Update appointment vehicleId
      const updatedAppointment = {
        ...movedAppointment,
        vehicleId: destVehicleId,
      };

      // Update vehicles state
      const newVehicles = vehicles.map((vehicle) => {
        if (vehicle.id === sourceVehicleId) {
          return {
            ...vehicle,
            appointments: newSourceAppointments,
          };
        }
        if (vehicle.id === destVehicleId) {
          const newDestAppointments = [...vehicle.appointments];
          newDestAppointments.splice(destination.index, 0, updatedAppointment);
          return {
            ...vehicle,
            appointments: newDestAppointments,
          };
        }
        return vehicle;
      });

      setVehicles(newVehicles);
    }

    // Reset pending move
    setPendingMove(null);
  };

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // If moving within unassigned list
    if (
      source.droppableId === "unassigned" &&
      destination.droppableId === "unassigned"
    ) {
      const newAppointments = [...unassignedAppointments];
      const [movedAppointment] = newAppointments.splice(source.index, 1);
      newAppointments.splice(destination.index, 0, movedAppointment);
      setUnassignedAppointments(newAppointments);
      return;
    }

    // For all other moves (between vehicles or to/from unassigned), show confirmation dialog
    if (
      (source.droppableId.startsWith("vehicle-") &&
        destination.droppableId.startsWith("vehicle-")) ||
      (source.droppableId === "unassigned" &&
        destination.droppableId.startsWith("vehicle-")) ||
      (source.droppableId.startsWith("vehicle-") &&
        destination.droppableId === "unassigned")
    ) {
      // Store the pending move
      setPendingMove(result);
      // Open confirmation dialog
      setConfirmDialogOpen(true);
      return;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Render appointment card
  const renderAppointmentCard = (appointment: Appointment, index: number) => (
    <Draggable key={appointment.id} draggableId={appointment.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card className="bg-white border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="p-3 pb-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </CardTitle>
                <Badge
                  variant={
                    appointment.transportType === "wheelchair"
                      ? "default"
                      : "secondary"
                  }
                >
                  {appointment.transportType === "wheelchair"
                    ? "Rollstuhl"
                    : "Tragestuhl"}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1 text-xs">
                <User size={12} />
                {appointment.patient.phone}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <div className="flex items-center gap-1 text-sm mb-1">
                <Calendar size={14} className="text-gray-500" />
                <span>{formatDate(appointment.dateTime)}</span>
              </div>
              <div className="flex items-start gap-1 text-sm mb-1">
                <MapPin
                  size={14}
                  className="text-gray-500 mt-1 flex-shrink-0"
                />
                <span className="text-xs">
                  Von: {appointment.pickupAddress.street},{" "}
                  {appointment.pickupAddress.zipCode}{" "}
                  {appointment.pickupAddress.city}
                </span>
              </div>
              <div className="flex items-start gap-1 text-sm">
                <MapPin
                  size={14}
                  className="text-gray-500 mt-1 flex-shrink-0"
                />
                <span className="text-xs">
                  Nach: {appointment.destinationAddress.street},{" "}
                  {appointment.destinationAddress.zipCode}{" "}
                  {appointment.destinationAddress.city}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="bg-gray-50 p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Terminverteilung</h1>
        <p className="text-gray-500">
          Ziehen Sie Termine per Drag & Drop auf die gewünschten Fahrzeuge, um
          sie zuzuweisen.
        </p>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Termin verschieben</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Termin wirklich verschieben?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingMove(null)}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction onClick={processMove}>
              Bestätigen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unassigned appointments column */}
          <div className="col-span-1">
            <Card className="bg-white h-full">
              <CardHeader className="bg-gray-100 p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <AlertCircle size={18} />
                    Unverteilte Termine
                  </CardTitle>
                  <Badge variant="outline">
                    {unassignedAppointments.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <Droppable droppableId="unassigned">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px]"
                      >
                        {unassignedAppointments.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <p>Keine unverteilten Termine</p>
                          </div>
                        ) : (
                          unassignedAppointments.map((appointment, index) =>
                            renderAppointmentCard(appointment, index),
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Vehicles columns */}
          <div className="col-span-1 lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Aktive Fahrzeuge</TabsTrigger>
                <TabsTrigger value="all">Alle Fahrzeuge</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles
                    .filter((vehicle) => vehicle.active)
                    .map((vehicle) => (
                      <Card key={vehicle.id} className="bg-white h-full">
                        <CardHeader className="bg-gray-100 p-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                              <Truck size={18} />
                              {vehicle.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {vehicle.licensePlate}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <ScrollArea className="h-[calc(100vh-350px)]">
                            <Droppable droppableId={`vehicle-${vehicle.id}`}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="min-h-[200px]"
                                >
                                  {vehicle.appointments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                      <p>Keine zugewiesenen Termine</p>
                                      <p className="text-xs mt-1">
                                        Termine hierher ziehen
                                      </p>
                                    </div>
                                  ) : (
                                    vehicle.appointments.map(
                                      (appointment, index) =>
                                        renderAppointmentCard(
                                          appointment,
                                          index,
                                        ),
                                    )
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <Card
                      key={vehicle.id}
                      className={`bg-white h-full ${!vehicle.active ? "opacity-60" : ""}`}
                    >
                      <CardHeader className="bg-gray-100 p-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Truck size={18} />
                            {vehicle.name}
                            {!vehicle.active && (
                              <span className="text-xs text-gray-500">
                                (Inaktiv)
                              </span>
                            )}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {vehicle.licensePlate}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <ScrollArea className="h-[calc(100vh-350px)]">
                          <Droppable
                            droppableId={`vehicle-${vehicle.id}`}
                            isDropDisabled={!vehicle.active}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="min-h-[200px]"
                              >
                                {!vehicle.active ? (
                                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <p>Fahrzeug inaktiv</p>
                                    <p className="text-xs mt-1">
                                      Keine Zuweisung möglich
                                    </p>
                                  </div>
                                ) : vehicle.appointments.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <p>Keine zugewiesenen Termine</p>
                                    <p className="text-xs mt-1">
                                      Termine hierher ziehen
                                    </p>
                                  </div>
                                ) : (
                                  vehicle.appointments.map(
                                    (appointment, index) =>
                                      renderAppointmentCard(appointment, index),
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default AppointmentDistribution;
