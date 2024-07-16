import React from 'react';

const SideMenu = ({ setActiveSection }) => {
  const sections = ['General Information', 'Content Information', 'Address', 'Custom Field 1', 'Custom Field 2', 'Custom Field 3', 'Custom Field 4', 'Custom Field 5'];

  return (
    <nav className="side-menu">
      <ul>
        {sections.map((section, index) => (
          <li key={index} onClick={() => setActiveSection(section)}>
            {section}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideMenu;
