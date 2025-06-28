import Navigation from "@/components/Navigation";
import { Award, Coffee, MapPin, Calendar } from "lucide-react";

const About = () => {
  const timeline = [
    {
      year: "2024",
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      description:
        "Leading development of enterprise-scale applications using React, Node.js, and cloud technologies.",
    },
    {
      year: "2022",
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      description:
        "Built responsive web applications and mobile apps for various clients across different industries.",
    },
    {
      year: "2021",
      title: "Frontend Developer",
      company: "Creative Agency",
      description:
        "Specialized in creating interactive user interfaces and optimizing user experience.",
    },
    {
      year: "2020",
      title: "Started Coding Journey",
      company: "Self-taught",
      description:
        "Began learning web development through online courses and building personal projects.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="lg:ml-80 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                About Me
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-8"></div>
          </div>

          {/* Introduction */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                Hi, I'm Farzeen Siddiquie
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                I'm a passionate full-stack developer with over 3 years of
                experience creating digital solutions that make a real impact.
                My journey began with curiosity about how websites work, and it
                has evolved into a career dedicated to crafting exceptional user
                experiences.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                I specialize in modern web technologies including React,
                Node.js, and cloud platforms. I believe in writing clean,
                maintainable code and creating applications that not only look
                great but perform exceptionally well.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Coffee className="w-4 h-4 text-cyan-400" />
                  <span>Coffee Enthusiast</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>Problem Solver</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm flex items-center justify-center">
                <div className="text-8xl">👨‍💻</div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 backdrop-blur-sm"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm"></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              My Journey
            </h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 hidden md:block"></div>
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className="relative flex gap-8 items-start"
                  >
                    <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500 rounded-full items-center justify-center flex-shrink-0 relative z-10">
                      <Calendar className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-cyan-400 font-bold text-lg">
                          {item.year}
                        </span>
                        <div className="h-px bg-slate-600 flex-1"></div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-cyan-400 font-medium mb-3">
                        {item.company}
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
