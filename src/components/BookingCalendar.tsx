import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: Date;
  isAvailable: boolean;
}

interface BookingCalendarProps {
  selectedDate?: Date;
  onSlotSelect?: (slotInfo: { start: Date; end: Date }) => void;
}

const BookingCalendar = ({
  selectedDate = new Date(),
  onSlotSelect = () => {},
}: BookingCalendarProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Generate time slots for the selected date
  useEffect(() => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date(selectedDate);
        time.setHours(hour, minute, 0, 0);

        // Randomly determine availability (for demo purposes)
        const isAvailable = Math.random() > 0.3;

        slots.push({
          time,
          isAvailable,
        });
      }
    }

    setTimeSlots(slots);
  }, [selectedDate]);

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      const endTime = new Date(slot.time);
      endTime.setMinutes(endTime.getMinutes() + 15);

      onSlotSelect({
        start: slot.time,
        end: endTime,
      });
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">
        Uhrzeit auswählen für{" "}
        {format(selectedDate, "dd.MM.yyyy", { locale: de })}
      </h2>

      <div className="grid grid-cols-4 gap-2">
        {timeSlots.map((slot, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleSlotSelect(slot)}
            disabled={!slot.isAvailable}
            className={cn(
              "py-3 px-4 h-auto",
              !slot.isAvailable &&
                "bg-gray-50 text-gray-400 cursor-not-allowed",
            )}
          >
            {format(slot.time, "HH:mm")}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default BookingCalendar;
