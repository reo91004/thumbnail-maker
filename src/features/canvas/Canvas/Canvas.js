// src/components/Canvas/Canvas.js
import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';
import './Canvas.scss';

function Canvas({ size, background, assets, selectedAsset, onSelectAsset, onUpdateAsset, zoom }) {
  const canvasRef = useRef(null);

  const canvasStyle = {
    width: size.width,
    height: size.height,
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top left',
    background:
      background.type === 'image' && background.value
        ? background.value
        : background.type === 'gradient'
          ? background.value
          : background.value,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const handleDragStop = (assetId, d) => {
    onUpdateAsset(assetId, {
      position: { x: d.x, y: d.y },
    });
  };

  const handleResizeStop = (assetId, ref, position) => {
    onUpdateAsset(assetId, {
      size: {
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height),
      },
      position: { x: position.x, y: position.y },
    });
  };

  const renderAssetContent = (asset) => {
    switch (asset.type) {
      case 'text':
        return (
          <div
            className="asset-text"
            style={{
              fontFamily: asset.fontFamily || 'Pretendard',
              fontSize: `${asset.fontSize || 48}px`,
              fontWeight: asset.fontWeight || 'bold',
              color: asset.color || '#ffffff',
              textAlign: asset.textAlign || 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                asset.textAlign === 'left'
                  ? 'flex-start'
                  : asset.textAlign === 'right'
                    ? 'flex-end'
                    : 'center',
              padding: '10px',
              wordBreak: 'break-word',
            }}
          >
            {asset.content || 'New Text'}
          </div>
        );

      case 'shape':
        const shapeStyle = {
          width: '100%',
          height: '100%',
          backgroundColor: asset.backgroundColor || '#6366f1',
          borderRadius: `${asset.borderRadius || 8}px`,
          opacity: asset.opacity || 1,
        };

        if (asset.shapeType === 'circle') {
          shapeStyle.borderRadius = '50%';
        } else if (asset.shapeType === 'triangle') {
          shapeStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
          shapeStyle.borderRadius = 0;
        } else if (asset.shapeType === 'hexagon') {
          shapeStyle.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
          shapeStyle.borderRadius = 0;
        }

        return <div className="asset-shape" style={shapeStyle} />;

      case 'image':
        return (
          <img
            src={asset.src}
            alt={asset.alt || 'Image'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: `${asset.borderRadius || 0}px`,
              opacity: asset.opacity || 1,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas" ref={canvasRef} style={canvasStyle}>
        {assets.map((asset) => (
          <Rnd
            key={asset.id}
            default={{
              x: asset.position.x,
              y: asset.position.y,
              width: asset.size.width,
              height: asset.size.height,
            }}
            position={{
              x: asset.position.x,
              y: asset.position.y,
            }}
            size={{
              width: asset.size.width,
              height: asset.size.height,
            }}
            onDragStop={(e, d) => handleDragStop(asset.id, d)}
            onResizeStop={(e, direction, ref, delta, position) =>
              handleResizeStop(asset.id, ref, position)
            }
            onClick={() => onSelectAsset(asset.id)}
            className={`canvas-asset ${selectedAsset === asset.id ? 'selected' : ''}`}
            disableDragging={asset.locked}
            enableResizing={!asset.locked}
            bounds="parent"
            style={{
              zIndex: asset.zIndex || 1,
              display: asset.visible === false ? 'none' : 'block',
            }}
          >
            {renderAssetContent(asset)}
          </Rnd>
        ))}
      </div>
    </div>
  );
}

export default Canvas;
