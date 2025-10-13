import {
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb,
  Linkedin,
  Instagram,
  Twitter,
  Github,
} from "lucide-react";

export default function FoundersMessage() {
  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://linkedin.com/in/adlavijwal",
      color: "hover:text-blue-500",
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://instagram.com/innovbridge",
      color: "hover:text-pink-500",
    },
    {
      icon: Twitter,
      label: "Twitter",
      url: "https://twitter.com/innovbridge",
      color: "hover:text-blue-400",
    },
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/innovbridge",
      color: "hover:text-gray-300",
    },
  ];

  return (
    <section
      id="founders"
      className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300 font-medium">
              From Our Founder
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Founder's{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Message
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />

            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 group-hover:border-cyan-500/50 transition-all duration-500">
              <div className="relative w-full max-w-[300px] mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-opacity animate-pulse" />

                <div className="relative aspect-square rounded-full overflow-hidden border-4 border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-500 shadow-2xl shadow-cyan-500/20">
                  <img
                    src="/founder-photo.jpg"
                    alt="Adla Vijwal - Founder of InnovBridge"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 hidden items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                        <Target className="w-16 h-16 text-cyan-400" />
                      </div>
                      <p className="text-white font-bold text-xl">
                        Adla Vijwal
                      </p>
                      <p className="text-cyan-400 text-sm">
                        Founder & Visionary
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Adla Vijwal
                </h3>
                <p className="text-cyan-400 text-lg mb-4">
                  Founder & Visionary Leader
                </p>

                <div className="flex justify-center gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500 group">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    Our Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To democratize access to technology and innovation, creating
                    a bridge between cutting-edge advancements and those who
                    seek to understand, learn, and leverage them. We believe
                    that technology should empower everyone, not just a select
                    few.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500 group">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    Our Vision
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    InnovBridge was born from a simple observation: while
                    technology evolves at an unprecedented pace, many people
                    struggle to keep up or find relevant opportunities. We
                    envision a world where innovation is accessible,
                    understandable, and actionable for students, professionals,
                    and businesses alike.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500">
              <p className="text-gray-200 leading-relaxed italic mb-6">
                "We're not just building a platform—we're cultivating a
                community of innovators, dreamers, and doers who will shape the
                future. Every update we share, every opportunity we post, and
                every service we offer is designed to empower you to be part of
                the next technological revolution."
              </p>
              <p className="text-cyan-400 font-semibold">
                — Adla Vijwal, Founder of InnovBridge
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#about"
                className="group flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="mailto:hello@innovbridge.tech"
                className="group flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
