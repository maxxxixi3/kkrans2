import React, { useState } from "react";
import Header from "./Header";
import BookingForm from "./BookingForm";
import BookingConfirmation from "./BookingConfirmation";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { format, addDays } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomeProps {
  className?: string;
}

const Home = ({ className }: HomeProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    confirmationNumber: string;
    patientName: string;
    phoneNumber: string;
    email?: string;
    pickupAddress: string;
    destinationAddress: string;
    transportType: string;
    dateTime: Date;
  } | null>(null);

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 6;
    const endHour = 20;
    const now = new Date();

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date(selectedDate);
        time.setHours(hour, minute, 0, 0);

        // Skip slots in the past
        if (selectedDate.toDateString() === now.toDateString() && time < now) {
          continue;
        }

        slots.push(time);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle slot selection
  const handleSlotSelect = (time: Date) => {
    setSelectedSlot(time);
    setShowBookingForm(true);
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    // Generate a random confirmation number
    const confirmationNumber =
      "KT-" + Math.floor(100000 + Math.random() * 900000);

    // Create booking details object
    const newBookingDetails = {
      confirmationNumber,
      patientName: `${data.firstName} ${data.lastName}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      pickupAddress: data.pickupAddress,
      destinationAddress: data.destinationAddress,
      transportType:
        data.transportType === "wheelchair" ? "Rollstuhl" : "Tragestuhl",
      dateTime: selectedSlot || new Date(),
    };

    setBookingDetails(newBookingDetails);
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  // Handle closing the confirmation dialog
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedSlot(null);
    setBookingDetails(null);
  };

  // Navigate to previous/next day
  const goToPreviousDay = () => {
    setSelectedDate((prevDate) => addDays(prevDate, -1));
  };

  const goToNextDay = () => {
    setSelectedDate((prevDate) => addDays(prevDate, 1));
  };

  // Format time slot for display
  const formatTimeSlot = (time: Date) => {
    return format(time, "HH:mm");
  };

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <Header />
      <main className="container max-w-6xl py-[80] py-[900] flex top-[90] right-0 bottom-0 relative top-[90px] justify-end items-center flex-col">
        <img src="/logo.svg" alt="Logo" className="h-16 mb-6" />
        <div className="text-center mb-8 py-2.5">
          <h1 className="text-3xl font-bold mb-2">
            Krankentransport Terminbuchung
          </h1>
          <p className="text-gray-600">
            Wählen Sie einen Termin im Kalender und buchen Sie Ihren
            Krankentransport.
          </p>
        </div>

        <div className="md:grid-cols-2 flex justify-center items-start gap-[40px] w-[878.1875px]">
          {/* Date Selection */}
          <div className="bg-white rounded-lg shadow-sm py-[6] py-[6] px-5 w-[278.5px]">
            <h2 className="text-xl font-semibold mb-4">Datum auswählen</h2>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-medium">
                {format(selectedDate, "MMMM yyyy", { locale: de })}
              </h3>

              <button
                onClick={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                <div key={day} className="text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {(() => {
                // Get first day of month
                const firstDayOfMonth = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  1,
                );
                // Get day of week (0 = Sunday, 1 = Monday, etc.)
                let dayOfWeek = firstDayOfMonth.getDay();
                // Adjust for Monday start (0 = Monday, 6 = Sunday)
                dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

                // Get last day of month
                const lastDayOfMonth = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() + 1,
                  0,
                );
                const daysInMonth = lastDayOfMonth.getDate();

                // Create array for all days to display
                const days = [];
                const today = new Date();

                // Add empty cells for days before first of month
                for (let i = 0; i < dayOfWeek; i++) {
                  days.push(
                    <div key={`empty-${i}`} className="h-10 w-full"></div>,
                  );
                }

                // Add cells for each day of the month
                for (let i = 1; i <= daysInMonth; i++) {
                  const date = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    i,
                  );
                  const isToday = today.toDateString() === date.toDateString();
                  const isSelected =
                    selectedDate.toDateString() === date.toDateString();
                  const isPast = date < today && !isToday;

                  days.push(
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      disabled={isPast}
                      className={cn(
                        "h-10 w-full rounded-md text-sm",
                        isPast && "text-gray-300 cursor-not-allowed",
                        isToday && "border border-blue-300",
                        isSelected && "bg-blue-600 text-white",
                        !isSelected && !isPast && "hover:bg-gray-100",
                      )}
                    >
                      {i}
                    </button>,
                  );
                }

                return days;
              })()}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="bg-white rounded-lg shadow-sm pl-[6] py-[6] pl-[6] py-[6] pl-[6] pr-[25px.625rem] py-[6] pl-[6] py-[6] py-[6] w-[521.5px]">
            <h2 className="text-xl font-semibold mb-4">
              Uhrzeit auswählen für{" "}
              {format(selectedDate, "dd.MM.yyyy", { locale: de })}
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time, index) => {
                const isAvailable = Math.random() > 0.3; // Simulate availability

                return (
                  <button
                    key={index}
                    onClick={() => isAvailable && handleSlotSelect(time)}
                    disabled={!isAvailable}
                    className={cn(
                      "py-3 px-4 rounded-md text-center border",
                      isAvailable
                        ? "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed",
                    )}
                  >
                    {formatTimeSlot(time)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      {/* Booking Form Dialog */}
      <BookingForm
        open={showBookingForm}
        onOpenChange={setShowBookingForm}
        selectedSlot={selectedSlot}
        onSubmit={handleFormSubmit}
      />
      {/* Booking Confirmation Dialog */}
      {bookingDetails && (
        <BookingConfirmation
          open={showConfirmation}
          onClose={handleConfirmationClose}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  );
};

export default Home;
