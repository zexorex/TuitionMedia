"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GraduationCap, BookOpen, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,211,238,0.15),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(20,184,166,0.08),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_20%_80%,rgba(16,185,129,0.08),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"
        animate={{ y: [0, -25, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 glass-card">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold tracking-tight">TuitionMedia</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="gradient" className="shadow-cyan-500/20">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      <main className="relative pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
            >
              <Sparkles className="h-4 w-4" />
              Connect. Learn. Grow.
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                TuitionMedia
              </span>
              <br />
              <span className="text-foreground">Where Students Meet Tutors</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Post your tuition needs, browse qualified tutors, and start learning. 
              A modern marketplace built for education.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/signup">
                <Button variant="gradient" size="lg" className="group">
                  Start Free <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="glass" size="lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: BookOpen,
                title: "Post Requests",
                desc: "Students post tuition needs with subject, budget, and location.",
                delay: 0,
              },
              {
                icon: Users,
                title: "Find Tutors",
                desc: "Tutors browse open requests and apply with a cover letter.",
                delay: 0.1,
              },
              {
                icon: GraduationCap,
                title: "Match & Learn",
                desc: "Students accept applications and start learning together.",
                delay: 0.2,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + item.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-2xl p-8 transition-shadow hover:shadow-cyan-500/10"
              >
                <div className="mb-4 rounded-xl bg-cyan-500/20 p-3 w-fit">
                  <item.icon className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
