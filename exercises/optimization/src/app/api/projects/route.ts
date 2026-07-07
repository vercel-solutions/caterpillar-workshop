import { NextResponse } from "next/server"

import { getProjectCategories, getProjects } from "@/api"

export async function GET() {
  const [projects, categories] = await Promise.all([getProjects(), getProjectCategories()])

  return NextResponse.json({ projects, categories })
}
