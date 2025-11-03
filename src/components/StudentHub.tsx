import { useState, useEffect, FormEvent } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  Code,
  Calendar,
  Zap,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function StudentHub() {
  const features = [
    {
      icon: BookOpen,
      title: "Curated Learning Paths",
      description:
        "Structured paths from basics to advanced topics in AI, web development, and emerging tech.",
    },
    {
      icon: Users,
      title: "Peer Learning",
      description:
        "Connect with fellow students, share resources, and collaborate on projects.",
    },
    {
      icon: Code,
      title: "Hands-on Projects",
      description:
        "Real-world projects with industry mentors to build your portfolio.",
    },
    {
      icon: Calendar,
      title: "Live Workshops",
      description:
        "Weekly interactive sessions with industry experts and tech leaders.",
    },
  ];

  const stats = [
    { number: "500+", label: "Learning Resources" },
    { number: "50+", label: "Live Workshops" },
    { number: "1000+", label: "Active Students" },
    { number: "100+", label: "Success Stories" },
  ];

  // Interactive card / payment state
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [formState, setFormState] = useState<Record<string, unknown>>({});
  const [processingPay, setProcessingPay] = useState(false);
  const [paidConfirmed, setPaidConfirmed] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form validation functions
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formState.email || typeof formState.email !== "string") {
      errors.email = "Email is required";
    } else if (!isEmailValid(formState.email)) {
      errors.email = "Please enter a valid email";
    }

    // Validate other required fields based on form type
    if (activeCard === "resume") {
      if (!formState.name) errors.name = "Name is required";
      if (!formState.role) errors.role = "Job role is required";
    } else if (activeCard === "project") {
      if (!formState.title) errors.title = "Project title is required";
      if (!formState.description)
        errors.description = "Project description is required";
    } else if (activeCard === "ppt") {
      if (!formState.topic) errors.topic = "Topic is required";
      if (!formState.brief) errors.brief = "Brief description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCard = (key: string) => {
    setActiveCard(key);
    setFormState({});
    setPaidConfirmed(false);
  };

  const closeModal = () => {
    setActiveCard(null);
    setFormState({});
    setProcessingPay(false);
    setPaidConfirmed(false);
  };

  const modalTitle = (key: string | null) => {
    if (key === "resume") return "Resume Maker";
    if (key === "project") return "Project Builder";
    if (key === "ppt") return "PPT Creator";
    return "";
  };

  // Handle payment confirmation and form state restoration
  useEffect(() => {
    // Check for stored form state
    const storedState = localStorage.getItem("pendingFormState");
    if (storedState) {
      const { formState: savedState, activeCard: savedCard } =
        JSON.parse(storedState);
      setFormState(savedState);
      setActiveCard(savedCard);
    }

    // Handle payment confirmation
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");
    const request_id = params.get("request_id");

    if (session_id) {
      const confirm = async () => {
        try {
          const resp = await fetch(
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/functions/v1/confirm-payment?session_id=${encodeURIComponent(
              session_id
            )}&request_id=${encodeURIComponent(request_id || "")}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  import.meta.env.VITE_SUPABASE_ANON_KEY
                }`,
              },
            }
          );
          const json = await resp.json();
          if (json.success && json.paid) {
            toast.success("Payment confirmed — you can now submit the form.");
            setPaidConfirmed(true);
            // Clear URL parameters after successful confirmation
            window.history.replaceState({}, "", window.location.pathname);
          } else {
            toast.error("Payment not confirmed yet.");
          }
        } catch (e) {
          console.error("Confirm payment error", e);
          toast.error("Error confirming payment.");
        }
      };
      confirm();
    }
  }, []);

  const handleStartPayment = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setProcessingPay(true);
      const payload = {
        request_type: activeCard,
        email: String(formState.email),
        data: formState,
      };

      const resp = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await resp.json();
      if (json.success && json.url) {
        // Save form state to local storage before redirect
        localStorage.setItem(
          "pendingFormState",
          JSON.stringify({
            formState,
            activeCard,
          })
        );
        // Redirect to Stripe Checkout
        window.location.href = json.url;
      } else {
        console.error("Create checkout failed", json);
        toast.error("Unable to start payment. Try again later.");
      }
    } catch (e) {
      console.error("Start payment error", e);
      toast.error("Payment initiation failed");
    } finally {
      setProcessingPay(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!paidConfirmed) {
      toast.error("Please complete the payment first.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Final submission acknowledgement (server-side processing already handled in confirm-payment)
    toast.success("Thank you! Our team will contact you shortly.");
    // Remove stored form state
    localStorage.removeItem("pendingFormState");
    closeModal();
  };

  return (
    <section
      id="student-hub"
      className="relative py-24 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 backdrop-blur-sm">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">
              Student Hub
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Learn{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Future-Ready Skills
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your gateway to cutting-edge tech education. Access curated
            resources, join live workshops, and build real-world projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- New Student Hub interactive cards (Resume / Project / PPT) --- */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Student Hub — Built for Every Learner
          </h3>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                key: "resume",
                title: "Resume Maker",
                desc: "Get a professional resume tailored to your target role.",
              },
              {
                key: "project",
                title: "Project Builder",
                desc: "Outline and structure a portfolio-grade project.",
              },
              {
                key: "ppt",
                title: "PPT Creator",
                desc: "A concise, well-designed presentation for your topic.",
              },
            ].map((card) => (
              <button
                key={card.key}
                onClick={() => openCard(card.key)}
                className="group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl hover:border-emerald-500/50 transition-all duration-200 text-left"
              >
                <div className="text-white font-semibold text-lg mb-2">
                  {card.title}
                </div>
                <div className="text-sm text-gray-400">{card.desc}</div>
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/60 text-sm text-gray-300">
                  Start
                </div>
              </button>
            ))}
          </div>

          {/* Modals for each service card */}
          {activeCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => closeModal()}
              />
              <div className="relative z-10 w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-bold text-white">
                    {modalTitle(activeCard)}
                  </h4>
                  <button
                    onClick={() => closeModal()}
                    className="text-gray-400"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                  {activeCard === "resume" && (
                    <>
                      <div>
                        <label className="text-sm text-gray-300">
                          Full Name
                        </label>
                        <input
                          value={formState.name || ""}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">
                          Job Description / Role
                        </label>
                        <input
                          value={formState.role || ""}
                          onChange={(e) =>
                            setFormState({ ...formState, role: e.target.value })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">
                          Email ID
                        </label>
                        <input
                          value={formState.email || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        Enter your details — our team will create a personalized
                        resume for you!
                      </p>
                    </>
                  )}

                  {activeCard === "project" && (
                    <>
                      <div>
                        <label className="text-sm text-gray-300">
                          Project Title / Aim
                        </label>
                        <input
                          value={formState.title || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              title: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">
                          Vision / Description
                        </label>
                        <textarea
                          value={formState.description || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              description: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">
                          Email ID
                        </label>
                        <input
                          value={formState.email || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeCard === "ppt" && (
                    <>
                      <div>
                        <label className="text-sm text-gray-300">Topic</label>
                        <input
                          value={formState.topic || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              topic: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">
                          Brief Idea
                        </label>
                        <textarea
                          value={formState.brief || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              brief: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">
                          Email ID
                        </label>
                        <input
                          value={formState.email || ""}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full mt-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleStartPayment()}
                      className="px-5 py-3 bg-emerald-600 text-white rounded-lg"
                      disabled={processingPay}
                    >
                      {processingPay ? "Processing..." : "Pay (Test $2)"}
                    </button>
                    <button
                      type="submit"
                      disabled={!paidConfirmed}
                      className={`px-5 py-3 rounded-lg ${
                        paidConfirmed
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      Submit
                    </button>
                    <div className="text-sm text-gray-400">
                      {paidConfirmed
                        ? "Payment received"
                        : "Submit enabled after payment"}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:border-emerald-500/50 transition-all duration-300"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-block bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 sm:p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our student community and get access to all learning resources,
            live workshops, and mentorship opportunities.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
          >
            Get Started Today
            <Zap className="w-5 h-5" />
          </a>
        </div>
      </div>

      <Toaster position="top-center" />
    </section>
  );
}
