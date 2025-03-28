import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Check, Calendar, MapPin, Phone, User } from "lucide-react";
import { Separator } from "../components/ui/separator";

interface BookingDetails {
  id?: string;
  confirmationNumber?: string;
  patientName?: string;
  phoneNumber?: string;
  pickupAddress?: string;
  destinationAddress?: string;
  transportType?: string;
  dateTime?: Date;
}

interface BookingConfirmationProps {
  open?: boolean;
  onClose?: () => void;
  bookingDetails?: BookingDetails;
}

const BookingConfirmation = ({
  open = true,
  onClose = () => {},
  bookingDetails = {
    confirmationNumber: "KT-" + Math.floor(100000 + Math.random() * 900000),
    patientName: "Max Mustermann",
    phoneNumber: "+49 123 456789",
    pickupAddress: "Musterstraße 123, 12345 Berlin",
    destinationAddress: "Klinikum Berlin, Charitestraße 1, 10117 Berlin",
    transportType: "Rollstuhl",
    dateTime: new Date(),
  },
}: BookingConfirmationProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-green-600 flex items-center justify-center gap-2">
            <Check className="h-8 w-8" />
            Buchung bestätigt
          </DialogTitle>
        </DialogHeader>

        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">Ihre Buchungsnummer</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookingDetails.confirmationNumber}
            </p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Termin</p>
                <p className="text-gray-600">
                  {bookingDetails.dateTime?.toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Patient</p>
                <p className="text-gray-600">{bookingDetails.patientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Telefonnummer</p>
                <p className="text-gray-600">{bookingDetails.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Abholadresse</p>
                <p className="text-gray-600">{bookingDetails.pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Zieladresse</p>
                <p className="text-gray-600">
                  {bookingDetails.destinationAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 flex items-center justify-center text-green-600 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Beförderungsart</p>
                <p className="text-gray-600">{bookingDetails.transportType}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Zurück zum Kalender
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;
