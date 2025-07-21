"use client"

import { Menu, Mic, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/createNotes", label: "Create-Notes" },
  { href: "/myNotes", label: "My-Notes" },
]

export const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <nav className="sticky top-0 flex h-16 justify-between w-full z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Mic className="h-6 w-6 text-purple-500" />
        <span className="text-xl font-bold text-purple-800">VoiceNotes</span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="text-sm text-gray-700 hover:text-purple-600 transition-colors">
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex gap-2 items-center">
      <Button
  className="w-full text-white bg-purple-600 hover:bg-purple-700"
  onClick={async () => {
    await signOut({ redirect: false });
    router.push("/signin"); // Force redirect
    setIsMenuOpen(false);
  }}
>
  Logout
</Button>
      </div>

      <div className="md:hidden flex items-center">
        <Button
          className="text-white bg-purple-500 hover:bg-purple-600"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute left-0 right-0 top-16 bg-white/95 backdrop-blur-lg border-t border-purple-100 z-50 shadow-md"
          >
            <nav className="flex flex-col items-center gap-4 p-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="w-full text-center py-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Button
  className="w-full text-white bg-purple-600 hover:bg-purple-700"
  onClick={async () => {
    await signOut({ redirect: false });
    router.push("/signin"); // Force redirect
    setIsMenuOpen(false);
  }}
>
  Logout
</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
