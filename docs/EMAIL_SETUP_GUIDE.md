# Email Appointment Reminder Setup Guide

## Overview
This system automatically sends appointment reminder emails to customers and users **1 hour before their scheduled appointment**.

## What's Been Created

### 1. **Email Service** (`utils/emailService.js`)
   - Handles all email sending functionality using Nodemailer
   - Sends professionally formatted HTML emails
   - Supports custom email templates

### 2. **Appointment Reminder Scheduler** (`utils/appointmentReminder.js`)
   - Runs every minute using node-cron
   - Checks for appointments scheduled within the next 1 hour
   - Sends reminder emails to customers (Users) or leads
   - Tracks which appointments have been reminded (emailSent flag)

### 3. **Updated Appointment Model**
   - Added `emailSent` (boolean) - tracks if email has been sent
   - Added `emailSentAt` (Date) - timestamp of when email was sent

### 4. **Server Integration**
   - Scheduler automatically starts when the server starts
   - Checks appointments every minute

---

## Setup Instructions

### Step 1: Configure Gmail App Password

If you're using **Gmail**, you need to create an **App Password**:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords** (appears only if 2FA is enabled)
4. Select "Mail" and "Windows Computer" (or your device)
5. Google will generate a 16-character password
6. Copy this password

### Step 2: Update `.env` File

Update your `.env` file in the BACKEND folder with:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=your_16_character_app_password
FRONTEND_URL=http://localhost:3000
```

**Example:**
```env
EMAIL_USER=leaflanka@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:3000
```

### Step 3: How It Works

1. **When an appointment is created:**
   - System stores the appointment with `emailSent: false`

2. **Every minute, the scheduler checks:**
   - All appointments with `status: "scheduled"` 
   - That have `emailSent: false`
   - Scheduled between now and the next 1 hour

3. **When a match is found:**
   - System determines recipient (User or Lead email)
   - Sends a professional reminder email
   - Sets `emailSent: true` and `emailSentAt: new Date()`

4. **Email includes:**
   - Appointment type (Viewing, Test Drive, Follow-up)
   - Appointment date and time
   - Vehicle details (if available)
   - Professional formatting and links

---

## Testing the System

### Method 1: Create a Test Appointment
1. Create an appointment with a date/time exactly 1 hour from now
2. Wait for the reminder email to arrive
3. Check the appointment record to see `emailSent: true`

### Method 2: Manual Test via API
```bash
# Check if scheduler is running (check server logs)
# You should see: ✅ Appointment reminder scheduler started!

# Create an appointment 1 hour in the future
POST /api/appointments/add
{
  "customer": "user_id_here",
  "vehicle": "vehicle_id_here",
  "date": "2024-03-18T11:00:00Z",
  "time": "11:00",
  "appointmentType": "test_drive",
  "notes": "Test appointment"
}
```

### Check Logs
Your server logs will show:
- ✅ When the scheduler starts
- 📧 When appointments are found
- ✅ When emails are sent successfully
- ❌ Any errors that occur

---

## Email Template Features

The reminder email includes:
- ✅ Professional HTML formatting
- ✅ Appointment type, date, and time
- ✅ Vehicle details (make, model, year)
- ✅ Pre-arrival instructions
- ✅ Link to your website
- ✅ Brand name and footer
- ✅ Responsive design

---

## Types of Appointment Reminders

The system sends reminders for:
- **Vehicle Viewing** - Standard viewing appointment
- **Test Drive** - Customer test drive appointment
- **Follow-up** - Follow-up meeting with customer

---

## Troubleshooting

### Issue: Emails not being sent
1. Check `.env` file has correct credentials
2. Verify Gmail App Password is correct (Gmail may block regular passwords)
3. Check server logs for error messages
4. Ensure MongoDB is running and appointments exist

### Issue: Wrong email recipient
- System checks: Customer User email → Lead email
- Make sure either customer or lead has a valid email address

### Issue: App Password not working
- Make sure you created an **App Password**, not a regular password
- Enable 2-Step Verification first
- Generate a new one if unsure

### Issue: "Email transporter error"
- Wrong Gmail credentials
- App Password has spaces (they're intentional, keep them)
- Check your internet connection

---

## Database Migration

If you have existing appointments, they will start with:
- `emailSent: false`
- `emailSentAt: null`

The system will send reminders for these once they fall within the 1-hour window.

---

## Advanced Configuration

### Change Email Service
If not using Gmail, update EMAIL_SERVICE:
```env
EMAIL_SERVICE=outlook
EMAIL_SERVICE=yahoo
EMAIL_SERVICE=custom_smtp  # Requires additional setup
```

### Change Reminder Timing
Edit `utils/appointmentReminder.js` line 15:
```javascript
// Change 60 * 60 * 1000 to your desired milliseconds
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
```

### Add More Email Types
Extend `utils/emailService.js` with additional methods:
```javascript
const sendPaymentReminder = async (email, details) => { ... }
const sendCancellationNotice = async (email, details) => { ... }
```

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` file with real credentials to Git
- Use environment-specific credentials in production
- Use OAuth2 instead of app passwords for production systems
- Consider using a service like SendGrid for high-volume emails

---

## Support

If emails aren't sending:
1. Check server console logs for specific errors
2. Verify `.env` credentials are correct
3. Test Gmail App Password directly
4. Check MongoDB connection status
5. Ensure appointment date/time format is correct

