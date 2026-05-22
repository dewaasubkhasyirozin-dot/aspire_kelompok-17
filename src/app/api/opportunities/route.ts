import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabase();
  const searchParams = request.nextUrl.searchParams;

  try {
    let query = supabase.from("opportunities").select("*", { count: "exact" }).eq("verification_status", "verified");
    const category = searchParams.get("category");
    const field = searchParams.get("field");
    const targetLevel = searchParams.get("target_level");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "deadline_terdekat";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    if (category) query = query.eq("category", category);
    if (field) query = query.eq("field", field);
    if (targetLevel) query = query.contains("target_levels", [targetLevel]);
    if (type) query = query.eq("type", type);
    if (status === "open") query = query.gte("registration_close_date", new Date().toISOString().split("T")[0]);
    else if (status === "closed") query = query.lt("registration_close_date", new Date().toISOString().split("T")[0]);
    if (search) query = query.or(`title.ilike.%${search}%,organizer.ilike.%${search}%`);

    switch (sort) {
      case "deadline_terdekat": query = query.order("registration_close_date", { ascending: true }); break;
      case "terbaru": query = query.order("created_at", { ascending: false }); break;
      case "terpopuler": query = query.order("view_count", { ascending: false }); break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data, count, page, totalPages: Math.ceil((count || 0) / limit) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal memuat peluang" }, { status: 500 });
  }
}