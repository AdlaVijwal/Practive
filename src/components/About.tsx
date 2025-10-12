import { Target, Users, Rocket, Globe } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To democratize access to technology and innovation, making cutting-edge tools and knowledge available to everyone.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building a global community of learners, creators, and innovators who shape the future together.",
    },
    {
      icon: Rocket,
      title: "Innovation Hub",
      description:
        "Curating and sharing the latest breakthroughs in AI, tech, and digital transformation daily.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Connecting opportunities across borders, from startups to enterprises, students to professionals.",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              InnovBridge
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            InnovBridge is more than a platform—it's a movement. We bridge the
            gap between today's technology and tomorrow's possibilities,
            connecting innovators, learners, and visionaries from around the
            world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 sm:p-12">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Our Story
          </h3>
          <div className="space-y-4 text-gray-300 leading-relaxed max-w-4xl mx-auto">
            <p>
              Founded with a vision to make technology accessible to everyone,
              InnovBridge was born from the belief that innovation should have
              no barriers. We recognized that while technology advances at
              lightning speed, access to quality information, tools, and
              opportunities remains fragmented.
            </p>
            <p>
              Today, we serve as a central hub where tech enthusiasts, students,
              professionals, and businesses discover the latest AI
              breakthroughs, find meaningful opportunities, and access services
              that transform their digital journey. From daily tech updates to
              career opportunities and cutting-edge services, we're building the
              infrastructure for tomorrow's innovators.
            </p>
            <p className="text-cyan-400 font-semibold text-center pt-4">
              Join us in shaping the future of technology, one innovation at a
              time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
