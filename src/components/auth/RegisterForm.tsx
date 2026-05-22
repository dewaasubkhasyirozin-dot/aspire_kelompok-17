"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { User, Mail, Lock, GraduationCap, UserPlus } from "lucide-react";
import { EDUCATION_LEVELS, FIELDS } from "@/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const registerSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirm_password: z.string(),
  education_level: z.enum(EDUCATION_LEVELS as any, { errorMap: () => ({ message: "Pilih jenjang pendidikan" }) }),
}).refine((data) => data.password === data.confirm_password, { message: "Password tidak cocok", path: ["confirm_password"] });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [interests, setInterests] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const toggleInterest = (field: string) => {
    setInterests((prev) => prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]);
  };

  const onSubmit = async (data: RegisterFormData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email, password: data.password,
      options: { data: { full_name: data.full_name, education_level: data.education_level } },
    });
    if (authError) { toast.error(authError.message.includes("already registered") ? "Email sudah terdaftar" : authError.message); return; }
    if (authData.user) {
      await supabase.from("profiles").upsert({ id: authData.user.id, full_name: data.full_name, education_level: data.education_level, interests });
    }
    toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nama Lengkap" type="text" placeholder="Nama lengkap kamu" leftIcon={<User size={18} />} error={errors.full_name?.message} {...register("full_name")} />
      <Input label="Email" type="email" placeholder="nama@email.com" leftIcon={<Mail size={18} />} error={errors.email?.message} {...register("email")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Password" type="password" placeholder="Minimal 6 karakter" leftIcon={<Lock size={18} />} error={errors.password?.message} {...register("password")} />
        <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" leftIcon={<Lock size={18} />} error={errors.confirm_password?.message} {...register("confirm_password")} />
      </div>
      <Select label="Jenjang Pendidikan" options={EDUCATION_LEVELS.map((level) => ({ value: level, label: level }))} placeholder="Pilih jenjang pendidikan" error={errors.education_level?.message as string} {...register("education_level")} />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Minat / Bidang (opsional)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FIELDS.filter((f) => f !== "Umum").map((field) => (
            <button key={field} type="button" onClick={() => toggleInterest(field)}
              className={cn("px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-200 cursor-pointer",
                interests.includes(field) ? "bg-primary-50 text-primary-700 border-primary-300 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")}>
              {field}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} leftIcon={<UserPlus size={18} />} size="lg">Daftar Sekarang</Button>
      <p className="text-center text-sm text-gray-500">Sudah punya akun? <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Masuk di sini</Link></p>
    </form>
  );
}
