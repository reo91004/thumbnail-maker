// src/components/ToolPanel/ToolPanel.js
import React from 'react';
import './ToolPanel.scss';

function ToolPanel({ tools, selectedTool, onToolSelect, onAddAsset }) {
  return (
    <div className="tool-panel">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
          onClick={() => onToolSelect(tool.id)}
          title={tool.name}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}

export default ToolPanel;
