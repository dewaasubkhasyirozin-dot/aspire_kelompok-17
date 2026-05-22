"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Input";
import { formatDate, getRelativeTime, getRegistrationStatus } from "@/lib/utils";
import { SAVED_STATUS_COLORS, type UserSavedOpportunity, type SavedStatus } from "@/types";
import { Bookmark, Trash2, Edit3, Clock, Building2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function SavedPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [savedItems, setSavedItems] = useState<UserSavedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [editItem, setEditItem] = useState<UserSavedOpportunity | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchSaved = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase.from("user_saved_opportunities").select("*, opportunity:opportunities(*)").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setSavedItems(data as UserSavedOpportunity[]);
    setIsLoading(false);
  };

  useEffect(() => { fetchSaved(); }, [user]);

  const filtered = savedItems.filter((item) => activeTab === "semua" ? true : item.status === activeTab);

  const tabs = [
    { id: "semua", label: "Semua", count: savedItems.length },
    { id: "interested", label: "Tertarik", count: savedItems.filter((i) => i.status === "interested").length },
    { id: "applying", label: "Sedang Daftar", count: savedItems.filter((i) => i.status === "applying").length },
    { id: "applied", label: "Selesai Daftar", count: savedItems.filter((i) => i.status === "applied").length },
  ];

  const handleUpdateStatus = async (item: UserSavedOpportunity, newStatus: SavedStatus) => {
    await supabase.from("user_saved_opportunities").update({ status: newStatus }).eq("id", item.id);
    setSavedItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)));
    toast.success("Status diupdate!");
  };

  const handleEditNotes = (item: UserSavedOpportunity) => { setEditItem(item); setEditNotes(item.notes || ""); setShowEditModal(true); };
  const handleSaveNotes = async () => {
    if (!editItem) return;
    await supabase.from("user_saved_opportunities").update({ notes: editNotes }).eq("id", editItem.id);
    setSavedItems((prev) => prev.map((i) => (i.id === editItem.id ? { ...i, notes: editNotes } : i)));
    toast.success("Catatan disimpan!"); setShowEditModal(false);
  };
  const handleDelete = async (id: string) => {
    await supabase.from("user_saved_opportunities").delete().eq("id", id);
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Dihapus dari simpanan");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><Bookmark size={24} className="text-primary-600" /> Simpan Saya</h1>
        <p className="text-gray-500 mt-1">Kelola peluang yang sudah kamu simpan</p>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Bookmark size={48} />} title="Belum ada peluang tersimpan"
          description={activeTab === "semua" ? "Simpan peluang yang kamu minati dari halaman Jelajahi." : `Tidak ada peluang dengan status ini.`}
          actionLabel="Jelajahi Peluang" onAction={() => window.location.href = "/dashboard/opportunities"} />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const opp = item.opportunity;
            const statusColor = SAVED_STATUS_COLORS[item.status];
            const isOpen = opp ? getRegistrationStatus(opp.registration_close_date) === "open" : false;
            return (
              <Card key={item.id} padding="md" className="group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={statusColor.bg.includes("yellow") ? "warning" : statusColor.bg.includes("blue") ? "info" : "success"} size="sm">{statusColor.label}</Badge>
                      {opp && <Badge variant="gray" size="sm">{opp.category}</Badge>}
                      {opp && !isOpen && <Badge variant="danger" size="sm">Ditutup</Badge>}
                    </div>
                    {opp ? (
                      <Link href={`/dashboard/opportunities/${opp.id}`} className="text-base font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">{opp.title}</Link>
                    ) : <p className="text-base font-bold text-gray-400">Peluang tidak tersedia</p>}
                    {opp && (
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Building2 size={12} /> {opp.organizer}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {getRelativeTime(opp.registration_close_date)}</span>
                      </div>
                    )}
                    {item.notes && <p className="text-sm text-gray-600 mt-1.5 bg-gray-50 px-3 py-1.5 rounded-lg italic">"{item.notes}"</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select value={item.status} onChange={(e) => handleUpdateStatus(item, e.target.value as SavedStatus)}
                      className="text-xs px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400 cursor-pointer">
                      <option value="interested">Tertarik</option>
                      <option value="applying">Sedang Daftar</option>
                      <option value="applied">Selesai Daftar</option>
                    </select>
                    <button onClick={() => handleEditNotes(item)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" title="Edit catatan"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus"><Trash2 size={16} /></button>
                    {opp && <Link href={`/dashboard/opportunities/${opp.id}`}><ChevronRight size={18} className="text-gray-300 group-hover:text-primary-600 transition-colors" /></Link>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Catatan">
        <div className="space-y-4">
          <Textarea label="Catatan pribadi" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Tulis catatan..." rows={4} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Batal</Button>
            <Button onClick={handleSaveNotes}>Simpan Catatan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}