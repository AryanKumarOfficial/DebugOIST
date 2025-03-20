import { AnimatedTooltipPreview } from '@/components/MembersProfilePage'
import { StickyScrollRevealDemo } from '@/components/StickyScrollPage';

export default function About() {
  return (
    <div className="relative z-20 mt-10 px-6 lg:px-16 xl:px-24 bg-gray-50 text-gray-800">
      {/* Meet the Team Section */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
        <p className="text-gray-600">
          Get to know the talented individuals behind our success.
        </p>
      </div>

      {/* Team Members Preview */}
      <AnimatedTooltipPreview />

      {/* Sticky Scroll Section */}
      <div className="mt-16">
        <StickyScrollRevealDemo />
      </div>
    </div>
  );
}
