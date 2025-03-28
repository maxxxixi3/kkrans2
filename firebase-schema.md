# Firebase Database Schema Documentation

## Collections

### 1. appointments
- id: auto-generated
- patient: object (patient data)
- pickupAddress: object (address details)
- destinationAddress: object (address details)
- dateTime: timestamp
- transportType: string (wheelchair/carryingChair)
- status: string (unassigned/assigned/inProgress/completed)
- vehicleId: string (optional)
- createdAt: timestamp
- updatedAt: timestamp

### 2. vehicles
- id: auto-generated
- name: string
- licensePlate: string
- active: boolean
- createdAt: timestamp
- updatedAt: timestamp

### 3. patients
- id: auto-generated
- firstName: string
- lastName: string
- phone: string
- createdAt: timestamp
- updatedAt: timestamp

### 4. staff
- id: auto-generated (matches auth UID)
- email: string
- role: string (staff/admin)
- createdAt: timestamp
- lastLogin: timestamp
