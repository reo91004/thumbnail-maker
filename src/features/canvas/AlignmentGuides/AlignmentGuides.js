// src/components/AlignmentGuides/AlignmentGuides.js
import React from 'react';
import './_AlignmentGuides.scss';

function AlignmentGuides({ guides, distances, canvasSize }) {
  if ((!guides || guides.length === 0) && (!distances || distances.length === 0)) return null;

  return (
    <div className="alignment-guides">
      {/* 정렬 가이드 라인 */}
      {guides &&
        guides.map((guide, index) => (
          <div
            key={`guide-${index}`}
            className={`guide-line guide-${guide.type}`}
            style={
              guide.type === 'vertical'
                ? {
                    left: `${guide.position}px`,
                    height: `${canvasSize.height}px`,
                  }
                : {
                    top: `${guide.position}px`,
                    width: `${canvasSize.width}px`,
                  }
            }
          />
        ))}

      {/* 거리 표시 */}
      {distances &&
        distances.map((distance, index) => (
          <div
            key={`distance-${index}`}
            className={`distance-indicator distance-${distance.type}`}
            style={
              distance.type === 'horizontal'
                ? {
                    left: `${Math.min(distance.from, distance.to)}px`,
                    top: `${distance.y}px`,
                    width: `${Math.abs(distance.to - distance.from)}px`,
                  }
                : {
                    top: `${Math.min(distance.from, distance.to)}px`,
                    left: `${distance.x}px`,
                    height: `${Math.abs(distance.to - distance.from)}px`,
                  }
            }
          >
            <span className="distance-label">{Math.round(distance.distance)}px</span>
          </div>
        ))}
    </div>
  );
}

export default AlignmentGuides;
