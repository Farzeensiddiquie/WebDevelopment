
import { useState } from "react";
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Code2, 
  FolderOpen, 
  Mail, 
  Download,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: User },
    { name: "Skills", href: "/skills", icon: Code2 },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden bg-slate-800/90 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50 text-white hover:bg-slate-700/90 transition-all duration-300"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full p-8">
          {/* Logo/Brand */}
          <div className="mb-12">
            <Link to="/" className="block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Farzeen Siddiquie
              </h1>
              <p className="text-slate-400 text-sm mt-1">Full Stack Developer</p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <item.icon size={20} className={`transition-transform duration-300 ${
                  isActive(item.href) ? "scale-110" : "group-hover:scale-110"
                }`} />
                <span className="font-medium">{item.name}</span>
                {isActive(item.href) && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full ml-auto animate-pulse"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Download CV Button */}
          <div className="mb-8">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2">
              <Download size={18} />
              Download CV
            </button>
          </div>

          {/* Social Links */}
          <div className="border-t border-slate-700/50 pt-6">
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
