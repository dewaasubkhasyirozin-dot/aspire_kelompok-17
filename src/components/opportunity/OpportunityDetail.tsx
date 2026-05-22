"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn, formatDate, getRelativeTime, getRegistrationStatus } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSaved } from "@/hooks/useSaved";
import type { Opportunity, SavedStatus } from "@/types";
import {
  Building2, Calendar, Clock, ExternalLink, Share2, Bookmark, BookmarkCheck,
  Bell, CheckCircle2, Users, GraduationCap, Globe, Instagram, Mail, MapPin, Award, FileText,
} from "lucide-react";
import toast from "react-hot-toast";

interface OpportunityDetailProps {
  opportunity: Opportunity;
}

export function OpportunityDetail({ opportunity }: OpportunityDetailProps) {
  const { isAuthenticated } = useAuth();
  const { isOpportunitySaved, getSavedItem, saveOpportunity, updateSavedItem, removeSavedItem } = useSaved();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderDate, setReminderDate] = useState("");

  const isSaved = isOpportunitySaved(opportunity.id);
  const savedItem = getSavedItem(opportunity.id);
  const isOpen = getRegistrationStatus(opportunity.registration_close_date) === "open";

  const handleSave = (status: SavedStatus = "interested") => {
    if (!isAuthenticated) { toast.error("Silakan login terlebih dahulu"); return; }
    saveOpportunity(opportunity.id, status);
  };

  const handleStatusChange = (status: SavedStatus) => {
    if (savedItem) updateSavedItem(savedItem.id, { status });
  };

  const handleSetReminder = () => {
    if (!reminderDate) { toast.error("Pilih tanggal pengingat"); return; }
    if (savedItem) { updateSavedItem(savedItem.id, { reminder_date: reminderDate }); setShowReminderModal(false); toast.success("Pengingat berhasil disimpan!"); }
    else { toast.error("Simpan peluang terlebih dahulu"); }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: opportunity.title, text: `Lihat peluang ini di Langkah.id: ${opportunity.title}`, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link disalin ke clipboard!");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={opportunity.category === "Lomba" ? "blue" : opportunity.category === "Beasiswa" ? "green" : opportunity.category === "Magang" ? "purple" : "amber"} size="md">{opportunity.category}</Badge>
              <Badge variant={isOpen ? "success" : "danger"} size="md">{isOpen ? "Pendaftaran Buka" : "Pendaftaran Tutup"}</Badge>
              <Badge variant="info" size="md"><CheckCircle2 size={12} className="mr-1" /> Terverifikasi</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{opportunity.title}</h1>
            <div className="flex items-center gap-2 text-gray-500"><Building2 size={18} /><span className="font-medium">{opportunity.organizer}</span></div>
          </div>

          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Calendar size={18} className="text-primary-600" /> Timeline</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {opportunity.registration_open_date && <div><p className="text-gray-500">Pendaftaran Dibuka</p><p className="font-semibold text-gray-900">{formatDate(opportunity.registration_open_date)}</p></div>}
              <div><p className="text-gray-500">Pendaftaran Ditutup</p><p className="font-semibold text-red-600">{formatDate(opportunity.registration_close_date)}</p><p className="text-xs text-red-500 mt-0.5">({getRelativeTime(opportunity.registration_close_date)})</p></div>
              {opportunity.event_date && <div><p className="text-gray-500">Tanggal Acara</p><p className="font-semibold text-gray-900">{formatDate(opportunity.event_date)}</p></div>}
            </div>
          </Card>

          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText size={18} className="text-primary-600" /> Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
          </Card>

          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <Card padding="md">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle2 size={18} className="text-secondary-500" /> Persyaratan</h3>
              <ul className="space-y-2">
                {opportunity.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700"><span className="mt-1.5 w-1.5 h-1.5 bg-secondary-400 rounded-full flex-shrink-0" />{req}</li>
                ))}
              </ul>
            </Card>
          )}

          {opportunity.rewards && (
            <Card padding="md">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Award size={18} className="text-amber-500" /> Reward / Hadiah</h3>
              <p className="text-gray-700 leading-relaxed">{opportunity.rewards}</p>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Card padding="md" className="sticky top-20">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Informasi</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><Users size={16} /><span>Tipe: {opportunity.type}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><GraduationCap size={16} /><span>Jenjang: {opportunity.target_levels.join(", ")}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} /><span>Bidang: {opportunity.field}</span></div>
                </div>
              </div>
              <hr className="border-gray-100" />

              <a href={opportunity.registration_link} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="primary" fullWidth rightIcon={<ExternalLink size={16} />} disabled={!isOpen}>
                  {isOpen ? "Daftar Sekarang" : "Pendaftaran Tutup"}
                </Button>
              </a>

              {isSaved ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {(["interested", "applying", "applied"] as SavedStatus[]).map((s) => (
                      <button key={s} onClick={() => handleStatusChange(s)}
                        className={cn("flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                          savedItem?.status === s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        {s === "interested" ? "Tertarik" : s === "applying" ? "Mendaftar" : "Selesai"}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => savedItem && removeSavedItem(savedItem.id)} className="w-full text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer">Hapus dari simpanan</button>
                </div>
              ) : (
                <Button variant="outline" fullWidth leftIcon={<Bookmark size={16} />} onClick={() => handleSave("interested")}>Simpan Peluang</Button>
              )}

              {isSaved && (
                <Button variant="ghost" fullWidth leftIcon={<Bell size={16} />} onClick={() => setShowReminderModal(true)}>
                  {savedItem?.reminder_date ? `Pengingat: ${formatDate(savedItem.reminder_date)}` : "Atur Pengingat"}
                </Button>
              )}

              <Button variant="ghost" fullWidth leftIcon={<Share2 size={16} />} onClick={handleShare}>Bagikan</Button>

              {(opportunity.guidebook_link || opportunity.organizer_socials) && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Link Terkait</p>
                    {opportunity.guidebook_link && <a href={opportunity.guidebook_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"><FileText size={14} /> Guidebook</a>}
                    {opportunity.organizer_socials?.website && <a href={opportunity.organizer_socials.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"><Globe size={14} /> Website Resmi</a>}
                    {opportunity.organizer_socials?.instagram && <a href={opportunity.organizer_socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"><Instagram size={14} /> Instagram</a>}
                    {opportunity.organizer_socials?.email && <a href={`mailto:${opportunity.organizer_socials.email}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"><Mail size={14} /> Email</a>}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Reminder Modal */}
      <Modal isOpen={showReminderModal} onClose={() => setShowReminderModal(false)} title="Atur Pengingat Deadline">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Pilih tanggal untuk mendapatkan pengingat sebelum pendaftaran ditutup.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Pengingat</label>
            <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)}
              max={opportunity.registration_close_date}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <Button onClick={handleSetReminder} fullWidth>Simpan Pengingat</Button>
        </div>
      </Modal>
    </>
  );
}