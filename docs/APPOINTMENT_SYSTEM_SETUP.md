# Appointment Booking System - Setup Guide

## ✅ What's Been Implemented

Your appointment booking system now has complete business logic for:

1. **Future Dates Only** - Customers can only book appointments for tomorrow onwards
2. **Working Hours** - Appointments available 9:00 AM to 5:30 PM in 1-hour slots
3. **Holiday Restrictions** - Shop closes on Poya days and public holidays
4. **Staff Availability** - Prevents overlapping appointments, auto-assigns available staff
5. **Time Slot Selection** - Interactive slot picker showing staff availability

## 🚀 Quick Start

### 1. Seed Initial Holidays (Poya Days)
From the BACKEND directory, run:
```bash
cd BACKEND
node seedHolidays.js
```

This adds 2024-2025 Sri Lankan public holidays to your database. You can run this multiple times safely - it skips existing dates.

Output will show:
```
✅  Added: Thai Pongal (2024-01-14)
✅  Added: Independence Day (2024-02-04)
...
📊 Summary:
   Added: 28 holidays
   Skipped: 0 holidays
```

### 2. Restart Your Backend Server
The new routes and models require a server restart:
```bash
npm start  # or your start command
```

### 3. Test the Customer Booking Flow
1. Open `/book-appointment` as a customer
2. Select a vehicle
3. Pick a date (future dates only - past dates disabled)
4. See available time slots with staff availability
5. Click a time slot to select it
6. Confirm booking

## 🔧 Admin Features

### Add Custom Holidays
Use the API or Postman:
```
POST http://localhost:8070/api/holidays/add
Headers: Authorization: Bearer {token}
Body:
{
  "name": "Special Holiday",
  "date": "2025-03-21",
  "description": "Optional description"
}
```

### View All Holidays
```
GET http://localhost:8070/api/holidays
```

### Delete a Holiday
```
DELETE http://localhost:8070/api/holidays/:holidayId
```

## 📋 How the System Works

### Booking Flow (Frontend)
1. User selects vehicle
2. User picks date (min = tomorrow, holidays disabled)
3. System loads available time slots for that date
4. Each slot shows how many staff members are available
5. User clicks a time slot
6. System auto-assigns first available staff member
7. Booking confirmed with staff member assigned

### Availability Logic (Backend)
For each time slot (9:00 AM - 4:30 PM):
- Check if any staff member has an overlapping appointment
- If staff free → include in available slots
- If all staff booked → slot disabled (grayed out)

### Business Rules (Validated)
✅ Date must be in future  
✅ Date must NOT be a holiday  
✅ Time must be 9 AM - 4:30 PM  
✅ Exactly 1-hour duration  
✅ Staff member must be available (no overlaps)

## ⚙️ Customization

To change working hours or duration, edit `BACKEND/utils/appointmentValidation.js`:

```javascript
const WORK_START_HOUR = 9;        // Change start hour
const WORK_END_HOUR = 17;         // Change end hour
const WORK_END_MINUTE = 30;       // For 5:30 PM
const APPOINTMENT_DURATION = 60;  // Change from 60 minutes
```

## 📊 Database Collections

### Holiday Document Structure
```javascript
{
  _id: ObjectId,
  name: "Full Moon Poya",
  date: Date,
  description: "Full moon poya day",
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Document (Updated)
```javascript
{
  ...other fields,
  staffMember: ObjectId,  // NEW - reference to User (staff)
  date: Date,
  time: String("09:00"),
  ...
}
```

## ⚠️ Important Notes

- **Staff Members**: Only users with role "staff" or "manager" can be assigned
- **Customer Booking**: Uses `/api/customer/appointments/book` endpoint
- **Auto-Assignment**: If `staffMember` not provided, system automatically selects first available
- **Validation**: All rules validated on backend - frontend validation is UX only
- **Editing Appointments**: Customers can edit booked appointments with same rules applied

## 🧪 Test Scenarios

### Test Case 1: Book Future Date
✅ Should succeed - system auto-assigns staff

### Test Case 2: Book Past Date
❌ Should fail - "Appointment must be in future"

### Test Case 3: Book Holiday
❌ Should fail - "Shop is closed on this day (holiday)"

### Test Case 4: Book Outside Hours (e.g., 8:00 AM)
❌ Should fail - "Appointments available 9:00 AM to 4:30 PM"

### Test Case 5: All Staff Booked at 10:00 AM
❌ Time slot disabled - "No staff available" message with alternatives

### Test Case 6: Edit to Holiday Date
❌ Should fail - same validation as booking

## 📱 UI Changes

### CustomerBookAppointment.jsx
- Time input replaced with interactive slot selector
- Shows "[X available]" next to each time
- Disabled slots shown in gray
- Error messages for invalid dates
- Loading state while fetching slots

### EditMyAppointment.jsx
- Same slot selector as booking page
- Prevents editing to invalid times

### MyAppointments.jsx
- New section showing assigned staff member name and email
- Staff contact info visible to customer

## 🆘 Troubleshooting

**Q: After seeding, appointments still booking on Poya days**
A: Restart your backend server after running seedHolidays.js

**Q: Time slots showing but all disabled (no staffavailable)**
A: Ensure you have staff members created with role "staff" or "manager"

**Q: Frontend showing available slots but booking fails**
A: Verify staffMember field exists in Appointment model and database

**Q: "available-slots" endpoint 404**
A: Check that customerAppointments.js is loaded in server.js
