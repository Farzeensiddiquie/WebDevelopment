
import Navigation from "@/components/Navigation";
import { ExternalLink, Github, Star, Clock, Users } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with advanced features including real-time inventory management, payment processing, and admin dashboard. Built with modern technologies for optimal performance.",
      longDescription: "Complete e-commerce platform featuring user authentication, shopping cart, payment integration with Stripe, order management, and comprehensive admin panel. Includes real-time notifications and analytics dashboard.",
      technologies: ["React.js", "Node.js", "MongoDB", "Express.js", "Stripe API", "Socket.io"],
      image: "/placeholder.svg",
      liveUrl: "#",
      githubUrl: "#",
      status: "Completed",
      duration: "3 months",
      team: "Solo",
      highlights: ["Real-time inventory", "Payment integration", "Admin dashboard", "Mobile responsive"],
      category: "Full Stack"
    },
    {
      title: "Task Management SaaS",
      description: "A collaborative task management application with team features, real-time updates, and advanced project tracking. Designed for modern teams and remote collaboration.",
      longDescription: "Professional task management platform with team collaboration features, real-time updates, file sharing, time tracking, and comprehensive reporting. Includes mobile app for iOS and Android.",
      technologies: ["Next.js", "PostgreSQL", "Prisma", "React Native", "Pusher", "Tailwind CSS"],
      image: "/placeholder.svg",
      liveUrl: "#",
      githubUrl: "#",
      status: "In Progress",
      duration: "4 months",
      team: "2 developers",
      highlights: ["Real-time collaboration", "Mobile app", "Time tracking", "Team management"],
      category: "SaaS"
    },
    {
      title: "AI-Powered Analytics Dashboard",
      description: "An intelligent analytics dashboard that uses machine learning to provide insights and predictions. Features beautiful data visualizations and automated reporting.",
      longDescription: "Advanced analytics platform with AI-powered insights, predictive analytics, customizable dashboards, and automated report generation. Integrates with multiple data sources and provides real-time monitoring.",
      technologies: ["React.js", "Python", "TensorFlow", "D3.js", "FastAPI", "Redis"],
      image: "/placeholder.svg",
      liveUrl: "#",
      githubUrl: "#",
      status: "Completed",
      duration: "5 months",
      team: "3 developers",
      highlights: ["AI predictions", "Real-time data", "Custom visualizations", "API integration"],
      category: "AI/ML"
    },
    {
      title: "Social Media Mobile App",
      description: "A modern social media application built with React Native. Features include real-time messaging, photo sharing, and social interactions with a focus on user experience.",
      longDescription: "Full-featured social media platform with photo/video sharing, real-time messaging, stories, live streaming, and advanced privacy controls. Cross-platform mobile application with web admin panel.",
      technologies: ["React Native", "Expo", "Firebase", "Node.js", "WebRTC", "CloudFlare"],
      image: "/placeholder.svg",
      liveUrl: "#",
      githubUrl: "#",
      status: "Completed",
      duration: "6 months",
      team: "4 developers",
      highlights: ["Real-time messaging", "Live streaming", "Cross-platform", "Cloud storage"],
      category: "Mobile"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "from-green-500 to-emerald-600";
      case "In Progress":
        return "from-yellow-500 to-orange-600";
      default:
        return "from-blue-500 to-cyan-600";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Full Stack":
        return "from-cyan-500 to-blue-600";
      case "SaaS":
        return "from-purple-500 to-violet-600";
      case "AI/ML":
        return "from-green-500 to-emerald-600";
      case "Mobile":
        return "from-pink-500 to-rose-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="lg:ml-80 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                My Projects
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-8"></div>
            <p className="text-xl text-slate-300 max-w-3xl">
              A showcase of my recent work, featuring full-stack applications, mobile apps, 
              and innovative solutions built with modern technologies.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid xl:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Project Image */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-2 bg-gradient-to-r ${getStatusColor(project.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {project.status}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`bg-gradient-to-r ${getCategoryColor(project.category)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{project.description}</p>

                  {/* Project Details */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>{project.team}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm"
                        >
                          <Star className="w-3 h-3" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-slate-700/50 border border-slate-600/50 text-slate-300 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <a
                      href={project.liveUrl}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      className="flex-1 flex items-center justify-center gap-2 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-cyan-500/10"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">Interested in Working Together?</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                I'm always open to discussing new opportunities and exciting projects. 
                Let's create something amazing together!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Start a Project
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;
