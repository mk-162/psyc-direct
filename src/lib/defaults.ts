import type { NavigationData, GlobalSettings } from "@/lib/types";

export const defaultNavigation: NavigationData = {
  mainNav: [
    {
      label: "Services",
      url: "/services",
      children: [
        { label: "All Services", url: "/services" },
        { label: "Male Health Screening", url: "/services/male-health-screening" },
        { label: "Women's Health Screening", url: "/services/womens-health-screening" },
        { label: "60+ Health Screening", url: "/services/60-plus-health-screening" },
        { label: "Cancer Screening", url: "/services/cancer-screening" },
        { label: "Targeted Cancer Screening", url: "/services/targeted-cancer-screening" },
        { label: "Menopause Specialist", url: "/services/menopause-specialist" },
        { label: "Sports Performance", url: "/services/sports-performance" },
        { label: "Weight Clinic", url: "/services/weight-clinic" },
        { label: "Liver Health Package", url: "/services/liver-health-package" },
        { label: "Brain & Cognitive Health", url: "/services/brain-cognitive-health-package" },
        { label: "Fertility Health", url: "/services/fertility-health-screening" },
        { label: "Sexual Health", url: "/services/sexual-health-screening" },
        { label: "Tired All The Time", url: "/services/tired-all-the-time" },
      ],
    },
    {
      label: "About",
      url: "/our-story",
      children: [
        { label: "Our Story", url: "/our-story" },
        { label: "The Cocoon Difference", url: "/our-story/the-cocoon-difference" },
        { label: "Meet Your Care Team", url: "/our-story/meet-your-care-team" },
        { label: "Our Spaces", url: "/our-story/our-spaces" },
        { label: "Founder's Letter", url: "/our-story/founders-letter" },
        { label: "Careers", url: "/our-story/careers" },
        { label: "Press & Media", url: "/our-story/press-media" },
      ],
    },
    {
      label: "Membership",
      url: "/membership",
      children: [
        { label: "Membership Overview", url: "/membership" },
        { label: "Essential", url: "/membership/essential" },
        { label: "Complete", url: "/membership/complete" },
        { label: "Premier", url: "/membership/premier" },
        { label: "My Cocoon Portal", url: "/my-cocoon" },
      ],
    },
    {
      label: "Resources",
      url: "/knowledge-hub",
      children: [
        { label: "Knowledge Hub", url: "/knowledge-hub" },
        { label: "Wellness Library", url: "/knowledge-hub/wellness-library" },
        { label: "Guides & Resources", url: "/knowledge-hub/guides-resources" },
        { label: "Member Stories", url: "/knowledge-hub/member-stories" },
        { label: "FAQ", url: "/knowledge-hub/faq" },
        { label: "Contact Us", url: "/utility/contact" },
        { label: "Book a Visit", url: "/utility/book-visit" },
      ],
    },
  ],
  footerNav: [
    {
      title: "Services",
      links: [
        { label: "All Services", url: "/services" },
        { label: "Male Health Screening", url: "/services/male-health-screening" },
        { label: "Women's Health Screening", url: "/services/womens-health-screening" },
        { label: "60+ Health Screening", url: "/services/60-plus-health-screening" },
        { label: "Cancer Screening", url: "/services/cancer-screening" },
        { label: "Weight Clinic", url: "/services/weight-clinic" },
        { label: "Menopause Specialist", url: "/services/menopause-specialist" },
      ],
    },
    {
      title: "About Cocoon",
      links: [
        { label: "Our Story", url: "/our-story" },
        { label: "The Cocoon Difference", url: "/our-story/the-cocoon-difference" },
        { label: "Our Team", url: "/our-story/meet-your-care-team" },
        { label: "Our Spaces", url: "/our-story/our-spaces" },
        { label: "Careers", url: "/our-story/careers" },
        { label: "Press & Media", url: "/our-story/press-media" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Knowledge Hub", url: "/knowledge-hub" },
        { label: "Wellness Library", url: "/knowledge-hub/wellness-library" },
        { label: "FAQ", url: "/knowledge-hub/faq" },
        { label: "Financial Policy", url: "/utility/financial-policy" },
        { label: "Book a Visit", url: "/utility/book-visit" },
        { label: "My Cocoon", url: "/my-cocoon" },
      ],
    },
  ],
};

export const defaultSettings: GlobalSettings = {
  site: {
    name: "Cocoon Wellness",
    tagline: "Healthcare designed for life",
    logo: "/cocoon-logo-black.svg",
  },
  social: {
    instagram: "https://instagram.com/cocoonwellness",
    linkedin: "https://linkedin.com/cocoonwellness",
    twitter: "https://twitter.com/cocoonwellness",
  },
};
