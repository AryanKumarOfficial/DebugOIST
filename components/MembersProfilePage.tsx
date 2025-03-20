"use client";

import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

const people = [
  
  {
    id: 1,
    name: "Devashish",
    designation: "Tech Lead",
    image:
      "/assets/DevashishDebugTeam.jpg" //D:\DebugOIST\src\assets\DevashishDebugTeam.jpg
  },
  {
    id: 2,
    name: "Dhruv",
    designation: "Tech Lead",
    image:
      "/assets/DhruvDebugTeam.jpg",
  },
  {
    id: 3,
    name: "Akanksha",
    designation: "Event Head",
    image:
      "/assets/AkankshaDebugTeam.jpg",
  },
  {
    id: 4,
    name: "Muskan",
    designation: "Marketing Head",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Nalin",
    designation: "Open Source Maintainer",
    image:
      "/assets/NalinDebugTeam.jpg",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}

export { AnimatedTooltipPreview };
