"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { UserSubmission } from "@/types";
import { formatDate } from "@/lib/utils";
import { Send, Clock, CheckCircle2, XCircle, Link2 } from "lucide-react";
import toast from "react-hot-toast";

const submitSchema = z.object({
  opportunity_title: z.string().min(5, "Judul minimal 5 karakter").max(200),
  information_link: z.string().url("Link tidak valid").min(1, "Link wajib diisi"),
  additional_notes: z.string().optional(),
});

type SubmitFormData = z.infer<typeof submitSchema>;

export default function SubmitPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SubmitFormData>({ resolver: zodResolver(submitSchema) });

  const fetchSubmissions = async () => {
    if (!user) return;
    const { data } = await supabase.from("user_submissions").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setSubmissions(data as UserSubmission[]);
    setIsLoadingSubmissions(false);
  };

  useEffect(() => { fetchSubmissions(); }, [user]);

  const onSubmit = async (data: SubmitFormData) => {
    if (!user) return;
    const { error } = await supabase.from("user_submissions").insert({ user_id: user.id, ...data, additional_notes: data.additional_notes || null });
    if (error) { toast.error("Gagal mengirim"); return; }
    toast.success("Terima kasih! Tim kami akan meninjau kirimanmu.");
    reset(); fetchSubmissions();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review": return <Badge variant="warning"><Clock size={10} className="mr-1" /> Menunggu Review</Badge>;
      case "approved": return <Badge variant="success"><CheckCircle2 size={10} className="mr-1" /> Disetujui</Badge>;
      case "rejected": return <Badge variant="danger"><XCircle size={10} className="mr-1" /> Ditolak</Badge>;
      default: return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Send size={24} className="text-primary-600" /> Kirim Peluang</h1>
        <p className="text-gray-500 mt-1">Temukan peluang menarik? Kirim ke kami untuk diverifikasi dan dibagikan ke pelajar lain.</p>
      </div>

      <Card padding="lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Form Kirim Peluang</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Judul Peluang *" placeholder="Contoh: Lomba Esai Nasional 2026" leftIcon={<Send size={16} />} error={errors.opportunity_title?.message} {...register("opportunity_title")} />
          <Input label="Link Informasi *" type="url" placeholder="https://..." leftIcon={<Link2 size={16} />} helperText="Link poster, website resmi, atau sosial media" error={errors.information_link?.message} {...register("information_link")} />
          <Textarea label="Catatan Tambahan (opsional)" placeholder="Informasi tambahan..." {...register("additional_notes")} />
          <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Send size={16} />}>Kirim Peluang</Button>
        </form>
      </Card>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Kiriman</h2>
        {isLoadingSubmissions ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : submissions.length === 0 ? (
          <EmptyState icon={<Send size={40} />} title="Belum ada kiriman" description="Peluang yang kamu kirim akan muncul di sini." />
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <Card key={sub.id} padding="md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{sub.opportunity_title}</h3>
                    <a href={sub.information_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"><Link2 size={12} /> {sub.information_link}</a>
                    {sub.additional_notes && <p className="text-sm text-gray-500 mt-1">{sub.additional_notes}</p>}
                    <p className="text-xs text-gray-400 mt-2">Dikirim: {formatDate(sub.created_at)}</p>
                  </div>
                  <div className="flex-shrink-0">{getStatusBadge(sub.status)}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}