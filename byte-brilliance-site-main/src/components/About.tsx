
import { CheckCircle } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate developer with a love for creating digital experiences that make a difference
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">My Journey</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I'm a dedicated full-stack developer with expertise in modern web and mobile technologies. 
              My passion lies in creating seamless, user-friendly applications that solve real-world problems 
              and provide exceptional user experiences.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              With a strong foundation in both frontend and backend development, I enjoy working on 
              projects that challenge me to learn new technologies and implement innovative solutions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              When I'm not coding, I'm exploring the latest tech trends, contributing to open-source 
              projects, or sharing knowledge with fellow developers in the community.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">What I Bring</h3>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Frontend Excellence</h4>
                <p className="text-gray-600">Expert in React.js, Next.js, and React Native with modern UI frameworks like Tailwind CSS, Bootstrap, and Material-UI</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Backend Development</h4>
                <p className="text-gray-600">Proficient in Node.js with Express.js, MongoDB, and Backend as a Service solutions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="text-purple-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile Development</h4>
                <p className="text-gray-600">Cross-platform mobile app development using React Native with Expo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="text-orange-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Modern Workflows</h4>
                <p className="text-gray-600">Git version control, agile development practices, and continuous integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
