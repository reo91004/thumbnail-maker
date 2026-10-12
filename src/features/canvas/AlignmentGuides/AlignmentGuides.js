import React from 'react';
import './_AlignmentGuides.scss';

function AlignmentGuides({ guides, canvasSize }) {
  if (guides.length === 0) return null;

  return (
    <div className="alignment-guides">
      {guides.map((guide) => (
        <div
          key={`${guide.type}-${guide.position}`}
          className={`guide-line guide-${guide.type}`}
          style={
            guide.type === 'vertical'
              ? { left: `${guide.position}px`, height: `${canvasSize.height}px` }
              : { top: `${guide.position}px`, width: `${canvasSize.width}px` }
          }
        />
      ))}
    </div>
  );
}

export default AlignmentGuides;
