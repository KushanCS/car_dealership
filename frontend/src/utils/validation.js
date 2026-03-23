const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MAX_VEHICLE_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

export function validateVehicleForm(vehicle) {
  const currentYear = new Date().getFullYear();
  const yearNumber = Number(vehicle.year);
  const priceNumber = Number(vehicle.price);
  const mileageNumber = vehicle.mileage === "" || vehicle.mileage === null ? null : Number(vehicle.mileage);

  if (!vehicle.brand?.trim()) return "Brand is required";
  if (!vehicle.type) return "Vehicle type is required";
  if (!vehicle.year) return "Year is required";
  if (Number.isNaN(yearNumber)) return "Year must be a number";
  if (yearNumber > currentYear) return `Year cannot be in the future (max ${currentYear})`;
  if (yearNumber < 1900) return "Year must be 1900 or above";
  if (!vehicle.price && vehicle.price !== 0) return "Price is required";
  if (Number.isNaN(priceNumber) || priceNumber < 0) return "Price must be 0 or more";
  if (mileageNumber !== null && (Number.isNaN(mileageNumber) || mileageNumber < 0)) return "Mileage must be 0 or more";
  return "";
}

export function validateVehicleImages(files = [], existingCount = 0, maxImages = 4) {
  if (existingCount + files.length > maxImages) {
    return `You can upload a maximum of ${maxImages} vehicle images.`;
  }

  for (const file of files) {
    if (!String(file.type || "").startsWith("image/")) {
      return "Only image files can be uploaded for vehicles.";
    }

    if (file.size > MAX_VEHICLE_IMAGE_SIZE_BYTES) {
      return "Each vehicle image must be smaller than 15 MB.";
    }
  }

  return "";
}

export function validateLeadForm(form) {
  if (!form.name?.trim()) return "Lead name is required";
  if (!form.contact_number?.trim()) return "Contact number is required";
  if (!/^\d+$/.test(form.contact_number.trim())) return "Contact number must contain only digits";
  if (!form.email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(form.email.trim())) return "Please enter a valid email address";
  if (!form.lead_source?.trim()) return "Lead source is required";
  return "";
}

export function validateUserForm(form, { requirePassword = false } = {}) {
  if (!form.name?.trim()) return "Name is required";
  if (!form.email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(form.email.trim())) return "Please enter a valid email address";
  if (!form.role?.trim()) return "Role is required";
  if (requirePassword && !form.password?.trim()) return "Password is required";
  if (requirePassword && form.password.trim().length < 6) return "Password must be at least 6 characters";
  return "";
}

export function validateCustomerAppointment({ vehicleId, date, time, minDate = "" }) {
  if (!vehicleId) return "Please select a vehicle";
  if (!date) return "Please select a date";
  if (minDate && date < minDate) return `Please choose a date on or after ${minDate}`;
  if (!time) return "Please select a time";

  const appointmentDateTime = buildAppointmentDateTime(date, time);
  if (!appointmentDateTime || Number.isNaN(appointmentDateTime.getTime())) {
    return "Please select a valid appointment date and time";
  }

  if (appointmentDateTime <= new Date()) {
    return "Please select a future time slot";
  }

  return "";
}

export function buildAppointmentDateTime(date, time) {
  if (!date || !time) return null;
  return new Date(`${date}T${time}:00`);
}

export function isWorkingHours(time) {
  if (!time) return false;
  const [hours, minutes] = time.split(":").map(Number);
  return minutes === 0 && hours >= 9 && hours < 17;
}

export function validateInternalAppointment(appointment) {
  const appointmentDateTime = buildAppointmentDateTime(appointment.date, appointment.time);

  if (!appointment.lead || !appointment.vehicle || !appointment.date || !appointment.time) {
    return "Please complete all required appointment details";
  }

  if (!appointmentDateTime || Number.isNaN(appointmentDateTime.getTime())) {
    return "Please enter a valid appointment date and time";
  }

  if (appointmentDateTime <= new Date()) {
    return "Appointments can only be created for future dates and times";
  }

  if (!isWorkingHours(appointment.time)) {
    return "Appointments must be scheduled between 9:00 AM and 5:00 PM";
  }

  return "";
}
