'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
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
          <Link href="/rewards" className="transition-colors hover:text-primary duration-200">
            Rewards
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
            create camp
          </Link>
          <Link href="/update-inventory" className="transition-colors hover:text-primary duration-200">
            update inventory
          </Link>
          <Link href="/mint-nft" className="transition-colors hover:text-primary duration-200">
            mint nft
          </Link>
          <Link href="/user-create" className="transition-colors hover:text-primary duration-200">
           user create
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
              <Link href="/rewards" className="block transition-colors hover:text-primary duration-200">
                Rewards
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
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login" className="block text-center">
                  Login
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" asChild className="max-md:hidden">
            <Link href="/login" className="transition-colors hover:text-primary duration-200">
              Login
            </Link>
          </Button>
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