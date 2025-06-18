'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <Button onClick={handleLogout} className="px-4 py-2 rounded-full" variant={"secondary"}>
      <LogOutIcon/>
    </Button>
  )
}
