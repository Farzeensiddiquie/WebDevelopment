import React, { useState } from 'react';
import PortfolioCard from '../../components/cards/PortfolioCard';
import img1 from '../../assets/images/project-1.jpg';
import img2 from '../../assets/images/project-2.png';
import img3 from '../../assets/images/project-3.jpg';
import img4 from '../../assets/images/project-4.png';
import img5 from '../../assets/images/project-5.png';
import img6 from '../../assets/images/project-6.png';
import img7 from '../../assets/images/project-7.png';
import img9 from '../../assets/images/project-8.jpg';
import img8 from '../../assets/images/project-9.png';

export default function Portfolio() {
  // State to manage the active category
  const [activeCategory, setActiveCategory] = useState('All');

  // Projects array
  const projects = [
    { img: img1, title: 'Finance', category: 'Web development' },
    { img: img2, title: 'Orizon', category: 'Web development' },
    { img: img3, title: 'Fundo', category: 'Web design' },
    { img: img4, title: 'Brawlhalla', category: 'Applications' },
    { img: img5, title: 'DSM.', category: 'Web design' },
    { img: img6, title: 'MetaSpark', category: 'Web design' },
    { img: img7, title: 'Summary', category: 'Web development' },
    { img: img8, title: 'Task Manager', category: 'Applications' },
    { img: img9, title: 'Arrival', category: 'Web development' },
  ];

  // Filter projects based on the active category
  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <article className="portfolio active" data-page="portfolio">
      {/* Header Section */}
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      {/* Projects Section */}
      <section className="projects">
        {/* Filter Buttons */}
        <ul className="filter-list">
          {['All', 'Web design', 'Applications', 'Web development'].map((category) => (
            <li className="filter-item" key={category}>
              <button
                className={activeCategory === category ? 'active' : ''}
                data-filter-btn
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>

        {/* Filter Dropdown for Small Screens */}
        <div className="filter-select-box">
          <button className="filter-select" data-select>
            <div className="select-value" data-select-value>
              {activeCategory}
            </div>
            <div className="select-icon">
              <ion-icon name="chevron-down"></ion-icon>
            </div>
          </button>

          <ul className="select-list">
            {['All', 'Web design', 'Applications', 'Web development'].map((category) => (
              <li className="select-item" key={category}>
                <button
                  data-select-item
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Project List */}
        <ul className="project-list">
          {filteredProjects.map((project, index) => (
            <PortfolioCard
              key={index}
              image={project.img}
              title={project.title}
              category={project.category}
            />
          ))}
        </ul>

       
      </section>
    </article>
  );
}
