"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const schema = z.object({ email: z.string().email("Email tidak valid") });
type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });
    if (error) { toast.error(error.message); return; }
    setIsSent(true);
    toast.success("Link reset password telah dikirim ke email kamu!");
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h3 className="text-lg font-semibold text-gray-900">Cek Email Kamu!</h3>
        <p className="text-sm text-gray-500">Kami telah mengirim link reset password. Silakan cek inbox atau folder spam.</p>
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">Kembali ke login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" placeholder="nama@email.com" leftIcon={<Mail size={18} />} error={errors.email?.message} {...register("email")} />
      <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>Kirim Link Reset</Button>
      <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft size={14} /> Kembali ke login
      </Link>
    </form>
  );
}