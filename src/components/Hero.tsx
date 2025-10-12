import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300 font-medium">
            Welcome to the Future
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 animate-slide-up">
          <span className="block mb-2">InnovBridge</span>
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Building the Bridge
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4">
            to the Next Era of Technology
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-delay leading-relaxed">
          Your global platform connecting people with cutting-edge tech
          innovations, AI tools, digital services, and real-world opportunities.
          Making technology accessible for everyone.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
          <a
            href="#updates"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Updates
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="#newsletter"
            className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Join the Future
            </span>
          </a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in-delay-3">
            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
              1000+
            </div>
            <div className="text-sm text-gray-400">Tech Updates</div>
          </div>
          <div className="animate-fade-in-delay-3">
            <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
              50+
            </div>
            <div className="text-sm text-gray-400">Opportunities</div>
          </div>
          <div className="animate-fade-in-delay-3">
            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-400">Innovation</div>
          </div>
          <div className="animate-fade-in-delay-3">
            <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
              Global
            </div>
            <div className="text-sm text-gray-400">Community</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
