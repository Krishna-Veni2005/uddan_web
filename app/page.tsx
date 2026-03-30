"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Users, Heart, Target, Sparkles, MoveRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-slate-900">EduBridge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link 
            href="/auth/register/student" 
            className="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden bg-white py-24 sm:py-32 lg:pb-32 xl:pb-36 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 animate-fade-in-up">
                <Sparkles className="w-4 h-4" /> Revolutionizing Peer-to-Peer Learning
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8 leading-[1.1]">
                Where every child finds a mentor, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">and every mentor finds a purpose.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto mb-10">
                A seamless platform connecting driven college students with underserved children to bridge the education gap through completely free, high-quality, continuous mentoring.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/auth/register/student" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  I'm a Student <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/auth/register/volunteer" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:ring-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300"
                >
                  Become a Volunteer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STATS BAR WITH 3 COUNTERS */}
        <div className="bg-slate-900 py-12 relative overflow-hidden hidden sm:block">
          <div className="absolute inset-0 bg-primary/10 opacity-50"></div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              <div className="mx-auto flex max-w-xs flex-col gap-y-2">
                <dt className="text-base leading-7 text-slate-400">Total Students Matched</dt>
                {/* Simulated animated counters */}
                <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">10,000+</dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-2">
                <dt className="text-base leading-7 text-slate-400">Hours Taught Mentoring</dt>
                <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">50,000+</dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-2">
                <dt className="text-base leading-7 text-slate-400">Active College Mentors</dt>
                <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">5,000+</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 4. PROBLEM STATEMENT SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-accent tracking-wide uppercase">The Challenge We Face</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Millions of bright students lack the guidance they deserve.
              </p>
            </div>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-slate-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <GraduationCap className="h-6 w-6" aria-hidden="true" />
                    </div>
                    60% Dropout Rate
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600">
                    Many students drop out of high school simply because they lack academic support during formative transitions.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-slate-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <Users className="h-6 w-6" aria-hidden="true" />
                    </div>
                    1:40 Teacher Ratio
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600">
                    Overcrowded classrooms mean individual struggles go unnoticed until it's too late for intervention.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-slate-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <Target className="h-6 w-6" aria-hidden="true" />
                    </div>
                    No Career Guidance
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600">
                    Students from underserved backgrounds lack exposure to college pathways and modern career opportunities.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-primary tracking-wide uppercase">The Solution</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How EduBridge Connects Worlds
              </p>
              <p className="mt-4 text-lg text-slate-600">
                Our algorithm effortlessly pairs eager students with verified college volunteers based on subjects, hobbies, and learning styles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-2 shadow-sm border-[4px] border-white">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sign Up & Setup</h3>
                <p className="text-slate-600">Students list what they are curious about. Mentors list their expertise and available hours.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-primary/5 rounded-2xl border border-primary/10 hover:shadow-lg transition-all hover:-translate-y-1 relative">
                <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 text-primary/30">
                  <MoveRight className="w-8 h-8" />
                </div>
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-2 shadow-sm border-[4px] border-white ring-4 ring-primary/20">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">Smart Matching</h3>
                <p className="text-slate-600">Our system finds the perfect overlap bridging academic needs with mentorship availability.</p>
                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-primary/30 z-10">
                  <MoveRight className="w-8 h-8" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl mb-2 shadow-sm border-[4px] border-white">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">Host Sessions</h3>
                <p className="text-slate-600">Connect securely via online links or verified offline centers, track goals, and build a lasting bond.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FEATURES SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                  A platform built securely for growth and safety.
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  We verify every college volunteer to ensure a completely safe, nurturing environment for every child. Our tools keep everyone accountable and moving forward.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Strict Verification</h4>
                      <p className="mt-1 text-slate-600">Every mentor passes background checks, ID verification, and brief pedagogical training.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Curriculum Tracking</h4>
                      <p className="mt-1 text-slate-600">Mentors get access to high-quality syllabi frameworks to know exactly what to teach and when.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200 aspect-video hidden lg:flex items-center justify-center">
                 {/* Decorative graphic replacing placeholder */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
                 <div className="relative text-center p-8 bg-white/80 backdrop-blur-md rounded-xl border border-white/50 shadow-lg">
                    <div className="flex -space-x-4 justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-blue-500 border-4 border-white flex justify-center items-center text-white font-bold text-lg">M</div>
                      <div className="w-16 h-16 rounded-full bg-accent border-4 border-white flex justify-center items-center text-white font-bold text-lg">S</div>
                    </div>
                    <div className="text-xl font-bold text-slate-800">100% Match Quality</div>
                    <p className="text-sm text-slate-500 mt-1">Sustaining impactful long-term mentorships.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-500">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-2">
             <BookOpen className="w-6 h-6 text-primary" />
             <span className="text-lg font-bold tracking-tight text-slate-900">EduBridge</span>
           </div>
           <p className="text-sm">
             &copy; {new Date().getFullYear()} EduBridge Foundation. Built to close the educational gap.
           </p>
           <div className="flex gap-4 text-sm font-medium text-slate-600">
             <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
             <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
