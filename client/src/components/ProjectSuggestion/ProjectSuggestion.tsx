import { useState } from "react";
import "./ProjectSuggestion.scss";

export function ProjectSuggestion() {
  const projectIdeas = [
    "Build a Personal Portfolio Website",
    "Create a To-Do List",
    "Build a Weather App (using an external API)",
    "Design a Calculator",
    "Develop a Memory Game",
    "Create a Quiz App",
    "Build a Pomodoro Timer",
    "Design an Image Slider/Carousel",
    "Develop a Responsive Navigation Menu",
    "Create a Markdown Previewer",
    "Build a Tic-Tac-Toe Game",
    "Design a Digital Clock",
    "Create a Color Picker",
    "Develop a Unit Converter",
    "Build a Recipe Finder",
  ];

  const [suggestion] = useState(projectIdeas[Math.floor(Math.random() * projectIdeas.length)])

  return (
    <div className="project-suggestion">
      <h4>Need an idea?</h4>
      <p>Why not try to {suggestion}</p>
    </div>
  );
}
