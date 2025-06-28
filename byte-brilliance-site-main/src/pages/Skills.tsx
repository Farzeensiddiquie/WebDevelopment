
import Navigation from "@/components/Navigation";
import { Code, Database, Smartphone, Cloud, Wrench, Palette } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Code,
      color: "from-cyan-500 to-blue-600",
      skills: [
        { name: "React.js", level: 95, experience: "3+ years" },
        { name: "Next.js", level: 90, experience: "2+ years" },
        { name: "TypeScript", level: 88, experience: "2+ years" },
        { name: "Tailwind CSS", level: 92, experience: "2+ years" },
        { name: "HTML/CSS", level: 95, experience: "3+ years" },
      ]
    },
    {
      title: "Backend Development",
      icon: Database,
      color: "from-green-500 to-emerald-600",
      skills: [
        { name: "Node.js", level: 85, experience: "2+ years" },
        { name: "Express.js", level: 82, experience: "2+ years" },
        { name: "MongoDB", level: 78, experience: "1+ years" },
        { name: "PostgreSQL", level: 75, experience: "1+ years" },
        { name: "REST APIs", level: 88, experience: "2+ years" },
      ]
    },
    {
      title: "Mobile Development",
      icon: Smartphone,
      color: "from-purple-500 to-violet-600",
      skills: [
        { name: "React Native", level: 80, experience: "1+ years" },
        { name: "Expo", level: 78, experience: "1+ years" },
        { name: "Flutter", level: 65, experience: "6 months" },
        { name: "PWA", level: 85, experience: "1+ years" },
        { name: "Mobile UI/UX", level: 82, experience: "1+ years" },
      ]
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      color: "from-orange-500 to-red-600",
      skills: [
        { name: "AWS", level: 70, experience: "1+ years" },
        { name: "Vercel", level: 88, experience: "2+ years" },
        { name: "Docker", level: 65, experience: "6 months" },
        { name: "GitHub Actions", level: 75, experience: "1+ years" },
        { name: "Netlify", level: 85, experience: "1+ years" },
      ]
    },
    {
      title: "Tools & Workflow",
      icon: Wrench,
      color: "from-indigo-500 to-blue-600",
      skills: [
        { name: "Git/GitHub", level: 92, experience: "3+ years" },
        { name: "Vite", level: 88, experience: "1+ years" },
        { name: "Webpack", level: 75, experience: "1+ years" },
        { name: "Jest", level: 70, experience: "1+ years" },
        { name: "ESLint/Prettier", level: 85, experience: "2+ years" },
      ]
    },
    {
      title: "Design & UI/UX",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      skills: [
        { name: "Figma", level: 78, experience: "2+ years" },
        { name: "Adobe XD", level: 72, experience: "1+ years" },
        { name: "Responsive Design", level: 92, experience: "3+ years" },
        { name: "Material-UI", level: 85, experience: "2+ years" },
        { name: "Framer Motion", level: 80, experience: "1+ years" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="lg:ml-80 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Skills & Expertise
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-8"></div>
            <p className="text-xl text-slate-300 max-w-3xl">
              A comprehensive overview of the technologies and tools I use to build 
              modern, scalable, and user-friendly applications.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={category.title}
                className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-105"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-2"></div>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-6">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{skill.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-400">{skill.experience}</span>
                          <span className="text-sm font-bold text-cyan-400">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                            style={{ width: `${skill.level}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">Always Learning</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Technology evolves rapidly, and I'm committed to staying current with the latest 
                trends and best practices. I regularly explore new frameworks, attend developer 
                conferences, and contribute to open-source projects to continuously improve my skills.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Skills;
