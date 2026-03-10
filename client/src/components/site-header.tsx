import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  navItems?: NavItem[];
  currentPath?: string;
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Expert Witness", href: "/expert-witness" },
  { label: "Services", href: "/#services" },
  { label: "Knowledge Hub", href: "/knowledge-hub" },
  { label: "Case Studies", href: "/#case-studies" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader({ navItems = DEFAULT_NAV }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
            <Link href="/" className="flex-shrink-0" data-testid="link-home">
              <img
                src="/images/logo.png"
                alt="Psychology Direct"
                className="h-10 sm:h-12 w-auto"
                data-testid="img-logo"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:01306879075"
                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                data-testid="link-phone-header"
              >
                <Phone className="w-4 h-4 text-[#066aab]" />
                01306 879 075
              </a>
              <Button size="default" asChild data-testid="button-get-in-touch-header">
                <a href="/#contact">Get in Touch</a>
              </Button>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              data-testid="mobile-overlay"
            />

            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-72 sm:w-80 bg-background shadow-xl flex flex-col lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              data-testid="nav-mobile-slideout"
            >
              <div className="flex items-center justify-between px-5 h-16 sm:h-20 border-b">
                <img src="/images/logo.png" alt="Psychology Direct" className="h-8 w-auto" />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  data-testid="button-close-mobile"
                >
                  <X />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1" data-testid="nav-mobile">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-foreground rounded-md transition-colors hover:bg-muted"
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="border-t px-5 py-5 space-y-3">
                <a
                  href="tel:01306879075"
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  data-testid="link-phone-mobile"
                >
                  <Phone className="w-4 h-4 text-[#066aab]" />
                  01306 879 075
                </a>
                <Button className="w-full" asChild data-testid="button-get-in-touch-mobile">
                  <a href="/#contact" onClick={() => setOpen(false)}>Get in Touch</a>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
