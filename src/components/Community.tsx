import { useState } from "react";
import { supabase } from "../lib/supabase";
import { sendEmail } from "../lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import {
  Users,
  Zap,
  Send,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Globe,
  TrendingUp,
  Heart,
} from "lucide-react";

export default function Community() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://linkedin.com/company/innovbridge",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:shadow-blue-500/50",
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://instagram.com/innovbridge",
      color: "from-pink-600 to-purple-600",
      hoverColor: "hover:shadow-pink-500/50",
    },
    {
      icon: Twitter,
      label: "Twitter",
      url: "https://twitter.com/innovbridge",
      color: "from-blue-400 to-blue-500",
      hoverColor: "hover:shadow-blue-400/50",
    },
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/innovbridge",
      color: "from-gray-600 to-gray-700",
      hoverColor: "hover:shadow-gray-500/50",
    },
  ];

  const benefits = [
    { icon: TrendingUp, text: "Daily tech updates & AI insights" },
    { icon: Zap, text: "Exclusive opportunities & early access" },
    { icon: Users, text: "Connect with innovators worldwide" },
    { icon: Heart, text: "Free resources & learning materials" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // First, try to insert into database
      const { error: dbError } = await supabase
        .from("community_members")
        .insert([
          {
            email,
            frequency: "weekly",
            active: true,
          },
        ]);

      if (dbError) {
        if (dbError.code === "23505") {
          toast.error("You are already part of our community!");
          setMessage("You are already part of our community!");
          setStatus("error");
          return;
        }
        throw dbError;
      }

      // Then send the welcome email
      const emailResult = await sendEmail("community_welcome", email, {
        requestData: {
          name: email.split("@")[0],
          frequency: "weekly",
        },
      });

      if (!emailResult) {
        throw new Error("Failed to send welcome email");
      }

      toast.success("Welcome to the InnovBridge community!");
      setMessage(
        "Welcome to the InnovBridge community! Check your inbox for a welcome message."
      );
      setStatus("success");
      setEmail("");
    } catch (error: any) {
      console.error("Error subscribing:", error);

      // More specific error messages based on the error type
      if (error?.message?.includes("Failed to send welcome email")) {
        toast.error(
          "Joined community but couldn't send welcome email. You'll still receive our updates!"
        );
        setMessage(
          "Welcome! You're in, but we couldn't send the welcome email. Don't worry, you're still subscribed!"
        );
      } else {
        toast.error("Something went wrong. Please try again.");
        setMessage(
          "Something went wrong. Please try again or contact support."
        );
      }

      setStatus("error");

      // If this was a database error, try to rollback
      if (error?.message?.includes("send welcome email")) {
        try {
          await supabase.from("community_members").delete().match({ email });
        } catch (rollbackError) {
          console.error("Error rolling back subscription:", rollbackError);
        }
      }
    }
  }
  return (
    <section id="community" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-cyan-900/10" />

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border-2 border-cyan-500/20 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl shadow-cyan-500/10 hover:border-cyan-500/40 transition-all duration-500">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
              <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-300 font-medium">
                Join the Movement
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Join the </span>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Innovators
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Be part of a global community shaping the future of technology.
              Get exclusive updates, opportunities, and insights delivered to{" "}
              <span className="text-cyan-400 font-semibold">
                hello@innovbridge.tech
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">
                      {benefit.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to join the community"
                required
                className="w-full px-6 py-5 pr-40 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </>
                )}
              </button>
            </div>

            {status === "success" && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 animate-fade-in">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{message}</p>
              </div>
            )}
          </form>

          <div className="border-t border-gray-700/50 pt-10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-3">
                Connect With Us
              </h3>
              <p className="text-gray-400">
                Follow our journey across social platforms
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative px-6 py-4 bg-gradient-to-r ${social.color} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-110 ${social.hoverColor} hover:shadow-xl flex items-center gap-3`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{social.label}</span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300" />
                  </a>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-10">
              <div className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  15K+
                </div>
                <div className="text-sm text-gray-400">Community Members</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm text-gray-400">Tech Updates Shared</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-400">Countries Reached</div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            By subscribing, you agree to receive updates from InnovBridge at
            hello@innovbridge.tech. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
  <Toaster position="top-center" />;
}
