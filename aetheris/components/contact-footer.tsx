"use client";

import { Mail, Linkedin, Instagram, User, Github } from "lucide-react";

export function ContactFooter() {
  const socialLinks = [
    {
      icon: Mail,
      label: "Email",
      href: "mailto:aaryannamboothiri@gmail.com",
      ariaLabel: "Send me an email",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/aaryannampoothiri",
      ariaLabel: "View my GitHub",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aaryannampoothiri",
      ariaLabel: "Connect on LinkedIn",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/aaryan_nampoothiri/",
      ariaLabel: "Follow on Instagram",
    },
    {
      icon: User,
      label: "Portfolio",
      href: "https://interactive-resume-website-yo7p.vercel.app/",
      ariaLabel: "View my portfolio",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-white/10">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Creator info */}
        <div className="mb-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Crafted by</p>
          <h3 className="text-base font-semibold text-slate-100">Aaryan Nampoothiri</h3>
          <p className="mt-0.5 text-xs text-slate-400">Developer • Designer • Creator</p>
        </div>

        {/* Social links */}
        <div className="mb-4 flex items-center justify-center gap-2.5">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
                aria-label={link.ariaLabel}
                title={link.label}
              >
                <Icon className="h-3.5 w-3.5 transition group-hover:scale-110" />
              </a>
            );
          })}
        </div>

        {/* Tagline */}
        <p className="mb-3 text-center text-[10px] italic text-slate-500">
          "Empowering productivity through intelligent design"
        </p>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-center gap-1.5 border-t border-white/5 pt-3 text-center sm:flex-row sm:justify-between">
          <p className="text-[10px] text-slate-500">
            © {currentYear} Aetheris. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-500">
            Built with passion and <span className="text-red-400">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
