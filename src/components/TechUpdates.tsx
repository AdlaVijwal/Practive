import { useEffect, useState } from "react";
import { supabase, TechUpdate } from "../lib/supabase";
import { Calendar, Tag, TrendingUp, Loader } from "lucide-react";

export default function TechUpdates() {
  const [updates, setUpdates] = useState<TechUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "AI",
    "Web3",
    "Tech News",
    "Innovation",
    "Platform News",
  ];

  useEffect(() => {
    fetchUpdates();
  }, []);

  async function fetchUpdates() {
    try {
      const { data, error } = await supabase
        .from("tech_updates")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUpdates =
    selectedCategory === "All"
      ? updates
      : updates.filter((update) => update.category === selectedCategory);

  return (
    <section id="updates" className="relative py-24 bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300 font-medium">
              Latest Insights
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tech{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Updates
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stay ahead with daily updates on AI, technology breakthroughs, and
            innovation stories
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUpdates.map((update) => (
              <article
                key={update.id}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300" />

                {update.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={update.image_url}
                      alt={update.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
                )}

                <div className="relative p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      {update.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(update.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {update.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {update.excerpt}
                  </p>

                  <button className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:gap-3 transition-all duration-300">
                    Read More
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredUpdates.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No updates found in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
