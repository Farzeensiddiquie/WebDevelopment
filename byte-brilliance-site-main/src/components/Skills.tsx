
const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Technologies",
      skills: [
        { name: "React.js", level: 95, color: "bg-blue-500" },
        { name: "Next.js", level: 90, color: "bg-gray-700" },
        { name: "React Native", level: 85, color: "bg-blue-400" },
        { name: "JavaScript/TypeScript", level: 92, color: "bg-yellow-500" },
        { name: "HTML/CSS", level: 95, color: "bg-orange-500" },
      ]
    },
    {
      title: "Backend & Database",
      skills: [
        { name: "Node.js", level: 88, color: "bg-green-600" },
        { name: "Express.js", level: 85, color: "bg-gray-600" },
        { name: "MongoDB", level: 80, color: "bg-green-500" },
        { name: "REST APIs", level: 90, color: "bg-purple-600" },
        { name: "Backend as a Service", level: 75, color: "bg-indigo-600" },
      ]
    },
    {
      title: "Frameworks & Tools",
      skills: [
        { name: "Tailwind CSS", level: 95, color: "bg-cyan-500" },
        { name: "Bootstrap", level: 90, color: "bg-purple-500" },
        { name: "Material-UI", level: 85, color: "bg-blue-600" },
        { name: "Expo", level: 80, color: "bg-black" },
        { name: "Git/GitHub", level: 90, color: "bg-orange-600" },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Skills & Technologies
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here are the technologies and frameworks I use to build modern, scalable applications
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.title}
              </h3>
              <div className="space-y-6">
                {category.skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm font-semibold text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
