import { useEffect, useState } from "react";
import { supabase, Opportunity } from "../lib/supabase";
import {
  Briefcase,
  MapPin,
  Building2,
  ExternalLink,
  Loader,
  Clock,
} from "lucide-react";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("All");

  const types = ["All", "Internship", "Job", "Project", "Collaboration"];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOpportunities =
    selectedType === "All"
      ? opportunities
      : opportunities.filter(
          (opp) => opp.type.toLowerCase() === selectedType.toLowerCase()
        );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      internship: "from-blue-500 to-blue-600",
      job: "from-cyan-500 to-cyan-600",
      project: "from-green-500 to-green-600",
      collaboration: "from-purple-500 to-purple-600",
    };
    return colors[type.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  return (
    <section id="opportunities" className="relative py-24 bg-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300 font-medium">
              Career Opportunities
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover internships, jobs, projects, and collaborations in the tech
            industry
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === type
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`inline-block px-3 py-1 bg-gradient-to-r ${getTypeColor(
                        opportunity.type
                      )} text-white text-sm font-semibold rounded-full`}
                    >
                      {opportunity.type}
                    </span>
                    {opportunity.expires_at && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        Expires{" "}
                        {new Date(opportunity.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {opportunity.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      {opportunity.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {opportunity.location}
                    </span>
                  </div>

                  <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {opportunity.description}
                  </p>

                  {opportunity.apply_url && (
                    <a
                      href={opportunity.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:gap-3"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredOpportunities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No opportunities found in this category yet.
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for new listings!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
