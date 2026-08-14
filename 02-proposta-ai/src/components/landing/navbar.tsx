'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-[#0B1A2E]' : 'text-white'}`}>
            PropostaAI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-block">
            <Button variant={scrolled ? 'ghost' : 'link'} className={scrolled ? 'text-gray-600' : 'text-white/80 hover:text-white'}>
              Entrar
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
