import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const { id } = await params;

  try {
    const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).eq("verification_status", "verified").single();
    if (error) return NextResponse.json({ error: "Peluang tidak ditemukan" }, { status: 404 });

    const currentViews = data.view_count || 0;
    await supabase.from("opportunities").update({ view_count: currentViews + 1 }).eq("id", id);

    return NextResponse.json({ ...data, view_count: currentViews + 1 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal memuat detail" }, { status: 500 });
  }
}