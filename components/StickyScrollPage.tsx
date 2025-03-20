"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "Collaborative Coding",
    description:
      "Debug Programming Club encourages collaborative coding, where members work together on challenging problems, share insights, and learn from each other. Foster a team spirit and build innovative solutions together.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Collaborative Coding
      </div>
    ),
  },
  {
    title: "Competitive Programming",
    description:
      "Join regular coding contests and test your skills against fellow programmers. Improve your problem-solving ability and coding speed by participating in real-time competitive programming challenges.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=640&q=75"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Competitive Programming"
        />
      </div>
    ),
  },
  {
    title: "Version Control Workshops",
    description:
      "Learn the importance of version control through hands-on workshops. Master Git and GitHub to track your code changes, collaborate with others, and manage large projects effectively.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Version Control Workshops
      </div>
    ),
  },
  {
    title: "Hackathons & Projects",
    description:
      "Participate in club-hosted hackathons and projects. Build real-world applications, explore new technologies, and showcase your coding skills through impactful projects.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Hackathons & Projects
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
