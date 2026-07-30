import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import {ArrowRight,Bell,CircleDollarSign,CirclePile,House,NotebookText,Users,Share2,Sparkles} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHouse } from '../context/HouseContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { houses, getAllHouses, loading } = useHouse();
  const howItWorksRef = useRef();

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (user) getAllHouses();
  }, [user, getAllHouses]);

  useEffect(() => {
    if (!user || loading) return;
    if (houses.length > 0) {
      navigate(`/house/${houses[0]._id}/dashboard`, { replace: true });
    } else {
      navigate('/welcome', { replace: true });
    }
  }, [user, houses, loading, navigate]);

  const features = [
    {
      icon: <CircleDollarSign className="w-5 h-5" />,
      title: 'Smart Splits',
      desc: 'We simplify debts so you only make a handful of payments - no more spreadsheets.',
    },
    {
      icon: <NotebookText className="w-5 h-5" />,
      title: 'Shared Notes',
      desc: 'WiFi password, chore roster, grocery list - everything lives here, always accessible.',
    },
    {
      icon: <CirclePile className="w-5 h-5" />,
      title: 'Inventory Watch',
      desc: 'Track whats running low and get alerts before its gone.',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Gentle Reminders',
      desc: 'Rent, bills, chores - everyone gets a nudge. No more nagging.',
    },
    {
      icon: <House className="w-5 h-5" />,
      title: 'One Roof',
      desc: 'Manage members, lease info, and even assign chores - all under one digital roof.',
    },
  ];

  const steps = [
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Create your house',
      desc: 'Takes 10 seconds. Give a name to your house, get a unique code.',
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: 'Invite your roommates',
      desc: 'Share the code. They join in one tap - no complicated sign-ups.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Start using features',
      desc: 'The app handles all the math, notes, and reminders automatically.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1c1c] text-white overflow-x-hidden relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">
          Roomies <span className="text-violet-700">Hub</span>
        </div>
        <nav className="flex items-center gap-3 sm:gap-4 text-sm">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition text-white/80 hover:text-white"
          >
            Log in
          </button>
          <button
            onClick={() => navigate(user ? '/welcome' : '/login')}
            className="px-5 py-2 rounded-full bg-violet-500 hover:bg-violet-600 transition shadow-lg shadow-violet-500/25 text-white font-medium"
          >
            Get Started
          </button>
          <a
            href="#how-it-works"
            className="hidden md:inline text-white/60 hover:text-white transition"
            onClick={(e) => { e.preventDefault(); scrollToHowItWorks(); }}
          >
            How it works
          </a>
        </nav>
      </header>

      <main>
        <section className="relative flex flex-col items-center text-center px-4 sm:px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/30 text-xs text-white/50 mb-6">
              {/* <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> */}
              No more awkward roommate talks
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="block text-white">Living together</span>
              <span className="block bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                without the awkward talks
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Split expenses, manage chores, track shared stuff – all in one place.
              <span className="block sm:inline"> No more spreadsheets, no more nagging.</span>
            </p>

            <div className="mt-10 flex flex-col flex-wrap justify-center gap-3 sm:gap-4 sm:flex-row md:flex-row mx-14 gap-4">
              <button
                onClick={() => navigate(user ? '/welcome' : '/login')}
                className="group inline-flex justify-center items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-violet-500 hover:bg-violet-600 transition shadow-lg shadow-violet-500/25 text-sm font-medium text-white"
              >
                Start your house
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 hover:bg-white/10 transition text-sm text-white/80 hover:text-white"
              >
                Explore features
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-white/40 uppercase">What you get</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Everything your house needs</h2>
            <p className="text-white/40 mt-2 text-sm">No spreadsheets. No nagging. Just peace of mind.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
              >
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-violet-400 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </span>
                  <span className="font-medium text-white">{feature.title}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={howItWorksRef}
          id="how-it-works"
          className="py-16 px-4 sm:px-6 max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Simple steps</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">How it works</h2>
            <p className="text-white/50 mt-2 text-sm">Get your house organised in three easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-400/20 text-violet-300">
                    {step.icon}
                  </div>
                  <span className="text-sm font-mono text-white/30">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-white/60 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to sort out your house?</h2>
            <p className="mt-2 text-white/50">Free to use. No credit card required.</p>
            <button
              onClick={() => navigate(user ? (houses.length ? '/houses' : '/welcome') : '/login')}
              className="mt-8 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-violet-500 hover:bg-violet-600 transition shadow-lg shadow-violet-500/25 text-base font-medium text-white"
            >
              {user ? 'Go to your house' : 'Join for free'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-sm text-white/30">No commitment. Just a better house.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;