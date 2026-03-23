import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import { createStaff } from "../../api/adminUserApi";
import { validateUserForm } from "../../utils/validation";
import UserForm from "./UserForm";

export default function CreateUser() {
  const navigate = useNavigate();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff", isDeleted: false });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationMessage = validateUserForm(form, { requirePassword: true });
    if (validationMessage) {
      toast.error(validationMessage, "User form");
      return;
    }
    setSaving(true);
    try {
      await createStaff({ name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role });
      toast.success("User created");
      navigate("/admin/staff");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed", "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserForm
      title="Create Staff / Manager"
      subtitle=""
      modeLabel="New Team Account"
      form={form}
      onChange={onChange}
      onSubmit={submit}
      saving={saving}
      submitLabel="Create User"
      onCancel={() => navigate("/admin/staff")}
      showPassword
    />
  );
}
