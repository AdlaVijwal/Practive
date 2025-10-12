import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: "Tech Updates", href: "#updates" },
      { label: "Opportunities", href: "#opportunities" },
      { label: "Services", href: "#services" },
      { label: "About Us", href: "#about" },
    ],
    Resources: [
      { label: "Blog", href: "#" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "Community", href: "#" },
      { label: "Documentation", href: "#" },
    ],
    Company: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Careers", href: "#opportunities" },
      { label: "Partners", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, label: "Twitter", url: "https://twitter.com/innovbridge" },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://linkedin.com/company/innovbridge",
    },
    { icon: Github, label: "GitHub", url: "https://github.com/innovbridge" },
    { icon: Mail, label: "Email", url: "mailto:hello@innovbridge.tech" },
  ];

  return (
    <footer className="relative bg-black border-t border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                InnovBridge
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Building the bridge to the next era of technology. Your global
                platform for innovation, opportunities, and digital
                transformation.
              </p>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} InnovBridge.tech. All rights reserved.
            </p>

            <p className="flex items-center gap-2 text-gray-400 text-sm">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />{" "}
              for innovators worldwide
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              InnovBridge is a digital platform dedicated to democratizing
              access to technology and innovation.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </footer>
  );
}
