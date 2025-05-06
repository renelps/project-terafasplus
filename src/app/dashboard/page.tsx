import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardClient from "../../components/DashboardClient/DashboardClient"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/")
  }

  return <DashboardClient user={{ email: session.user.email! }}/>
}
