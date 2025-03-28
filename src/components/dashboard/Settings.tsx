import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clock, Save, Settings as SettingsIcon } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  workingHoursStart: z.string().min(1, { message: "Start time is required" }),
  workingHoursEnd: z.string().min(1, { message: "End time is required" }),
  appointmentDuration: z.string().min(1, { message: "Duration is required" }),
  maxAppointmentsPerSlot: z
    .string()
    .min(1, { message: "Maximum appointments is required" }),
  allowWeekends: z.boolean().default(false),
  bufferTime: z.string().min(1, { message: "Buffer time is required" }),
  notificationEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional(),
  defaultTransportType: z
    .string()
    .min(1, { message: "Default transport type is required" }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  workingHoursStart: "08:00",
  workingHoursEnd: "18:00",
  appointmentDuration: "15",
  maxAppointmentsPerSlot: "1",
  allowWeekends: false,
  bufferTime: "45",
  notificationEmail: "",
  defaultTransportType: "wheelchair",
};

const Settings = () => {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    // In a real implementation, this would save to Supabase
    console.log("Settings saved:", data);
    // Show success message
    alert("Settings saved successfully!");
  }

  return (
    <div className="w-full p-6 bg-white">
      <div className="flex items-center mb-6">
        <SettingsIcon className="mr-2 h-6 w-6 text-gray-500" />
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Working Hours & Appointment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="workingHoursStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours Start</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      The time when your service starts accepting appointments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingHoursEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours End</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      The time when your service stops accepting appointments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Duration (minutes)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The standard duration for each appointment slot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAppointmentsPerSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Appointments Per Vehicle</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of appointments each vehicle can handle per
                      slot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bufferTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buffer Time (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Additional time blocked after each appointment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowWeekends"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Allow Weekend Appointments
                      </FormLabel>
                      <FormDescription>
                        Enable booking appointments on Saturdays and Sundays.
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Settings & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="defaultTransportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Transport Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transport type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wheelchair">Wheelchair</SelectItem>
                          <SelectItem value="carryingChair">
                            Carrying Chair
                          </SelectItem>
                          <SelectItem value="walkingAssistance">
                            Walking Assistance
                          </SelectItem>
                          <SelectItem value="stretcher">Stretcher</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The default transport type for new appointments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Email address for system notifications and alerts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
