import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail, CheckCircle, AlertCircle, Send } from "lucide-react";
import { sendEmail } from "../lib/supabase";
import toast, { Toaster } from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email, frequency }]);

      if (error) {
        if (error.code === "23505") {
          toast.error("You are already subscribed to our newsletter!");
          setMessage("You are already subscribed to our newsletter!");
        } else {
          throw error;
        }
        setStatus("error");
      } else {
        await sendEmail("newsletter_welcome", email);
        toast.success("Successfully subscribed! Check your inbox.");
        setMessage(
          "Successfully subscribed! Check your inbox for confirmation."
        );
        setStatus("success");
        setEmail("");
        setFrequency("weekly");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong. Please try again.");
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section
      id="newsletter"
      className="relative py-24 bg-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Join the{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Innovation
              </span>{" "}
              Community
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get the latest tech updates, AI breakthroughs, and exclusive
              opportunities delivered straight to your inbox at
              hello@innovbridge.tech
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Newsletter Frequency
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFrequency("daily")}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    frequency === "daily"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <div className="font-semibold mb-1">Daily</div>
                  <div className="text-sm opacity-80">
                    Get updates every day
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("weekly")}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    frequency === "weekly"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <div className="font-semibold mb-1">Weekly</div>
                  <div className="text-sm opacity-80">
                    Curated weekly digest
                  </div>
                </button>
              </div>
            </div>

            {status === "success" && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Subscribe Now
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  10k+
                </div>
                <div className="text-sm text-gray-400">Active Subscribers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  Daily
                </div>
                <div className="text-sm text-gray-400">Fresh Content</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  100%
                </div>
                <div className="text-sm text-gray-400">Free Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  <Toaster position="top-center" />;
}
