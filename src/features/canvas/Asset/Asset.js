import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import './_Asset.scss';
import { RiCloseCircleFill } from 'react-icons/ri';

function Asset(props) {
  const {
    newAsset,
    id,
    currentAsset,
    setCurrentAsset,
    canvasSize,
    assetStyle,
    setAssetStyle,
    removeAsset,
    updateAssetContent,
  } = props;
  const SNAP_THRESHOLD = 10;
  const [alignmentGuides, setAlignmentGuides] = useState({ horizontal: [], vertical: [] });
  const sectionForm = document.querySelector('.sidebar');
  const assetBox = useRef(null);
  const [currentStyle, setCurrentStyle] = useState({
    ...newAsset.style,
    visibility: 'hidden',
    y: 0,
    x: 0,
  });
  const [localStyle, setLocalStyle] = useState(newAsset.style || {});
  const assetComponent = useRef(null);
  const isDragging = useRef(false);
  let isClicked = useRef(false);
  const isCurrentAsset = currentAsset.id === id;
  const [editing, setEditing] = useState({ pointerEvents: 'none', cursor: 'inherit' });
  const [isLocked, setIsLocked] = useState(newAsset.locked || false);
  const canvasElement = document.querySelector('#canvas');
  const canvasRect = canvasElement
    ? canvasElement.getBoundingClientRect()
    : { width: 0, height: 0 };
  const [prevCanvasSize, setPrevCanvasSize] = useState({ width: null, height: null });
  const [textContent, setTextContent] = useState(newAsset.name || '');

  // 스마트 정렬 기능
  const checkAlignment = useCallback(
    (x, y, width, height) => {
      const guides = { horizontal: [], vertical: [] };
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const rightX = x + width;
      const bottomY = y + height;

      // 캔버스 중앙 정렬
      const canvasCenterX = canvasSize.width / 2;
      const canvasCenterY = canvasSize.height / 2;

      // 수직 정렬 체크
      if (Math.abs(centerX - canvasCenterX) < SNAP_THRESHOLD) {
        guides.vertical.push(canvasCenterX);
        x = canvasCenterX - width / 2;
      }
      if (Math.abs(x) < SNAP_THRESHOLD) {
        guides.vertical.push(0);
        x = 0;
      }
      if (Math.abs(rightX - canvasSize.width) < SNAP_THRESHOLD) {
        guides.vertical.push(canvasSize.width);
        x = canvasSize.width - width;
      }

      // 수평 정렬 체크
      if (Math.abs(centerY - canvasCenterY) < SNAP_THRESHOLD) {
        guides.horizontal.push(canvasCenterY);
        y = canvasCenterY - height / 2;
      }
      if (Math.abs(y) < SNAP_THRESHOLD) {
        guides.horizontal.push(0);
        y = 0;
      }
      if (Math.abs(bottomY - canvasSize.height) < SNAP_THRESHOLD) {
        guides.horizontal.push(canvasSize.height);
        y = canvasSize.height - height;
      }

      setAlignmentGuides(guides);
      return { x, y };
    },
    [canvasSize]
  );

  useEffect(() => {
    if (canvasElement && assetComponent.current) {
      setPrevCanvasSize({ ...prevCanvasSize, width: canvasRect.width, height: canvasRect.height });
      const assetElement = assetComponent.current;
      let assetSize = assetElement.getBoundingClientRect();
      let topPercent = 0.5,
        leftPercent = 0.5;
      if (newAsset.type !== 'image') {
        if (newAsset.style.y) {
          topPercent = Number(newAsset.style.y.replace('%', '')) * 0.01;
          leftPercent = Number(newAsset.style.x.replace('%', '')) * 0.01;
        }
      }
      let width = newAsset.style.width || canvasRect.width * 0.9,
        height =
          newAsset.type === 'image'
            ? (width * assetSize.height) / assetSize.width
            : assetSize.height,
        x = canvasRect.width * leftPercent - width / 2,
        y = canvasRect.height * topPercent - height / 2;
      setCurrentStyle({ ...currentStyle, visibility: 'visible', x, y, width, height });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    function handleClickOutside(e) {
      if (
        assetComponent.current &&
        !assetComponent.current.contains(e.target) &&
        (!sectionForm || !sectionForm.contains(e.target))
      ) {
        isDragging.current = false;
        let obj = { ...currentStyle };
        obj.height = assetComponent.current.getBoundingClientRect().height;
        obj.visibility = 'visible';
        setEditing({ pointerEvents: 'none', cursor: 'inherit' });
        setCurrentStyle(obj);
        setCurrentAsset({ ...currentAsset, id: null });
      }
    }
  }, [currentStyle]);

  useEffect(() => {
    if (isCurrentAsset && assetBox.current) {
      let size = assetBox.current.getBoundingClientRect();
      let style = { ...currentStyle };
      if (style.height === 'auto') style.height = size.height;
      setAssetStyle(style);
    } else if (currentAsset.id === null) {
      setAssetStyle({ fontSize: '14px', height: 'auto', width: 'auto' });
    }
  }, [currentAsset]);

  // 부모로부터 style 변경이 있을 때 즉시 반영 (위치는 유지)
  useEffect(() => {
    if (newAsset.style) {
      const { x, y, width, height, ...styleWithoutPosition } = newAsset.style;
      setLocalStyle(newAsset.style);
      setCurrentStyle((prev) => ({
        ...prev,
        ...styleWithoutPosition,
        // 위치와 크기는 현재 값 유지
        x: prev.x,
        y: prev.y,
        width: prev.width,
        height: prev.height,
      }));
    }
  }, [newAsset.style]);

  // newAsset.locked 속성이 변경될 때 isLocked 상태 업데이트
  useEffect(() => {
    setIsLocked(newAsset.locked || false);
  }, [newAsset.locked]);

  // newAsset.name 속성이 변경될 때 textContent 상태 업데이트
  useEffect(() => {
    setTextContent(newAsset.name || '');
  }, [newAsset.name]);

  useEffect(() => {
    if (isCurrentAsset && assetBox.current) {
      // 위치 관련 속성 제외하고 스타일 적용
      const { x, y, width, height, ...styleToApply } = assetStyle;
      Object.keys(styleToApply).forEach((key) => {
        if (assetBox.current.style.hasOwnProperty(key)) {
          assetBox.current.style[key] = styleToApply[key];
        }
      });
      setLocalStyle({ ...localStyle, ...styleToApply });
      setCurrentStyle((prev) => ({ ...prev, ...styleToApply }));
    }
  }, [assetStyle]);

  useEffect(() => {
    if (prevCanvasSize.width) {
      const newX =
        ((currentStyle.x + currentStyle.width / 2) * canvasSize.width) / prevCanvasSize.width;
      const newY =
        ((currentStyle.y + currentStyle.height / 2) * canvasSize.height) / prevCanvasSize.height;
      setCurrentStyle({
        ...currentStyle,
        x: newX - currentStyle.width / 2,
        y: newY - currentStyle.height / 2,
      });
      setPrevCanvasSize({ ...prevCanvasSize, ...canvasSize });
    }
  }, [canvasSize]);

  function handleAssetClick(e, type) {
    e.stopPropagation();
    isClicked.current = true;
    if (isCurrentAsset) {
      setEditing({ cursor: 'default', pointerEvents: 'inherit' });
      setCurrentStyle({
        ...currentStyle,
        height: assetComponent.current.getBoundingClientRect().height,
      });
    } else {
      setCurrentAsset({
        ...currentAsset,
        id: id,
        type: newAsset.type,
        style: currentStyle,
      });
      setEditing({ cursor: 'default', pointerEvents: 'inherit' });
    }
  }

  function handleAssetResize(ref, position) {
    setAssetStyle({
      ...currentStyle,
      width: Number(ref.style.width.replace('px', '')),
      height: Number(ref.style.height.replace('px', '')),
      ...position,
    });
  }
  function handleAssetRemove() {
    removeAsset(id);
  }

  function handleTextChange(e) {
    if (editing.height !== 'auto') {
      setEditing({ ...editing, height: 'auto' });
    }
    const newContent = e.currentTarget.textContent;
    setTextContent(newContent);
    if (updateAssetContent) {
      updateAssetContent(id, newContent);
    }
  }

  return (
    <Rnd
      size={{
        width: currentStyle.width,
        height: editing.height || currentStyle.height,
      }}
      position={{
        x: currentStyle.x,
        y: currentStyle.y,
      }}
      noderef={assetComponent}
      lockAspectRatio={newAsset.shape === 'circle' || newAsset.type === 'image'}
      disableDragging={isLocked}
      enableResizing={!isLocked}
      onResizeStart={!isLocked ? handleAssetClick : undefined}
      onDragStart={!isLocked ? handleAssetClick : (e) => e.preventDefault()}
      onResize={(e, direction, ref, delta, position) => {
        if (!isLocked) handleAssetResize(ref, position);
      }}
      onDrag={(e, d) => {
        if (!isLocked) {
          const aligned = checkAlignment(d.x, d.y, currentStyle.width, currentStyle.height);
          return { x: aligned.x, y: aligned.y };
        }
      }}
      onDragStop={(e, d) => {
        if (!isLocked) {
          const aligned = checkAlignment(d.x, d.y, currentStyle.width, currentStyle.height);
          setAssetStyle({ ...assetStyle, x: aligned.x, y: aligned.y, height: d.node.clientHeight });
          setAlignmentGuides({ horizontal: [], vertical: [] });
          e.preventDefault();
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isLocked) handleAssetResize(ref, position);
      }}
    >
      <div
        id={id}
        ref={assetComponent}
        className={`asset${isCurrentAsset ? ' current' : ''} asset-${newAsset.type}${isLocked ? ' locked' : ''}`}
      >
        <button className="btn-remove" onClick={handleAssetRemove}>
          <RiCloseCircleFill />
        </button>
        {newAsset.type === 'text' ? (
          <div
            ref={assetBox}
            style={{
              ...currentStyle,
              ...localStyle,
              width: '100%',
              height: '100%',
              fontFamily: localStyle.fontFamily || newAsset.style?.fontFamily || 'Pretendard',
              fontSize: localStyle.fontSize || newAsset.style?.fontSize || '48px',
              fontWeight: localStyle.fontWeight || newAsset.style?.fontWeight || 'normal',
              color: localStyle.color || newAsset.style?.color || '#ffffff',
              textAlign: localStyle.textAlign || newAsset.style?.textAlign || 'center',
              textShadow: localStyle.textShadow || newAsset.style?.textShadow || '',
              textDecoration: localStyle.textDecoration || newAsset.style?.textDecoration || 'none',
              fontStyle: localStyle.fontStyle || newAsset.style?.fontStyle || 'normal',
              ...editing,
            }}
            contentEditable="true"
            suppressContentEditableWarning="true"
            spellCheck="false"
            onInput={handleTextChange}
            dangerouslySetInnerHTML={{ __html: textContent }}
          />
        ) : newAsset.type === 'figure' ? (
          <div
            ref={assetBox}
            style={{
              ...currentStyle,
              background: newAsset.shape === 'line' ? 'none' : currentStyle.background,
            }}
          >
            {newAsset.shape === 'line' ? (
              <p className="line" style={{ background: currentStyle.background }}></p>
            ) : (
              ''
            )}
          </div>
        ) : (
          <img ref={assetBox} crossOrigin="Anonymous" src={newAsset.url} alt={newAsset.name}></img>
        )}
      </div>
      {/* 정렬 가이드 라인 */}
      {alignmentGuides.horizontal.map((y, index) => (
        <div
          key={`h-${index}`}
          className="alignment-guide horizontal"
          style={{
            position: 'absolute',
            top: y,
            left: 0,
            right: 0,
            height: 1,
            background: '#667eea',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      ))}
      {alignmentGuides.vertical.map((x, index) => (
        <div
          key={`v-${index}`}
          className="alignment-guide vertical"
          style={{
            position: 'absolute',
            left: x,
            top: 0,
            bottom: 0,
            width: 1,
            background: '#667eea',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      ))}
    </Rnd>
  );
}

export default Asset;
