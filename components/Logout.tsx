'use client'
import { supabaseBrowser } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Button onClick={handleLogout} className="px-4 py-2 rounded-full" variant={"secondary"}>
      <LogOutIcon/>
    </Button>
  )
}
