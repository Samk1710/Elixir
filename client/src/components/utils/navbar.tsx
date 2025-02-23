'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/utils/mode-toggle"
import { Droplet, Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/* Logo - Always visible */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Droplet className="h-6 w-6 text-primary" />
            <span className="font-rubik text-xl font-bold">Elixir</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex md:ml-4">
          <Link href="/camps" className="transition-colors hover:text-primary duration-200">
            Blood Camps
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-primary duration-200">
            Dashboard
          </Link>
          
          <Link href="/community" className="transition-colors hover:text-primary duration-200">
            Community
          </Link>
          <Link href="/hospital-dashboard" className="transition-colors hover:text-primary duration-200">
            Hospital Dashboard
          </Link>
          <Link href="/upload" className="transition-colors hover:text-primary duration-200">
            Upload
          </Link>
          <Link href="/createcamp" className="transition-colors hover:text-primary duration-200">
            Create Camp
          </Link>
          <Link href="/organ" className="transition-colors hover:text-primary duration-200">
            Organ
          </Link>
          <Link href="/org-donor" className="transition-colors hover:text-primary duration-200">
            Organ Donor
          </Link>
          <Link href="/org-hos-reg" className="transition-colors hover:text-primary duration-200">
            Organ Host Register
          </Link>
          <Link href="/mint-nft" className="transition-colors hover:text-primary duration-200">
            Mint Nft
          </Link>
          
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 top-14 w-full bg-background md:hidden border-b">
            <div className="container py-4 space-y-4">
              <Link href="/camps" className="block transition-colors hover:text-primary duration-200">
                Blood Camps
              </Link>
              <Link href="/dashboard" className="block transition-colors hover:text-primary duration-200">
                Dashboard
              </Link>
              
              <Link href="/community" className="block transition-colors hover:text-primary duration-200">
                Community
              </Link>
              <Link href="/hospital-dashboard" className="block transition-colors hover:text-primary duration-200">
                Hospital Dashboard
              </Link>
              <Link href="/upload" className="block transition-colors hover:text-primary duration-200">
                Upload
              </Link>
              
            </div>
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          
          <ConnectButton
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'avatar',
            }}
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  )
}