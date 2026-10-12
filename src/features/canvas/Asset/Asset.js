import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import './_Asset.scss';
import { RiCloseCircleFill } from 'react-icons/ri';

const SNAP_THRESHOLD = 10;

// 요소의 시작·중앙·끝이 캔버스의 시작·중앙·끝에 가까우면 그 선에 붙인다.
function snap(pos, size, canvasLength, type, guides) {
  for (const [line, offset] of [
    [0, 0],
    [canvasLength / 2, size / 2],
    [canvasLength, size],
  ]) {
    if (Math.abs(pos + offset - line) < SNAP_THRESHOLD) {
      guides.push({ type, position: line });
      return line - offset;
    }
  }
  return pos;
}

// asset.style의 x, y는 캔버스 대비 요소 중심의 퍼센트('50%')라서 캔버스 크기가 바뀌어도 상대 위치가 유지된다.
function Asset({
  asset,
  canvasSize,
  isSelected,
  setSelectedId,
  updateAsset,
  removeAsset,
  setGuides,
}) {
  const { id, name, locked } = asset;
  const { x, y, ...textStyle } = asset.style;
  const assetRef = useRef(null);
  const textRef = useRef(null);
  const [height, setHeight] = useState(0);
  const width = canvasSize.width * 0.9;
  const left = (canvasSize.width * parseFloat(x)) / 100 - width / 2;
  const top = (canvasSize.height * parseFloat(y)) / 100 - height / 2;

  // contentEditable은 비제어로 두고 바깥(사이드바 등)에서 바뀐 내용만 DOM에 반영해야 커서가 맨 앞으로 튀지 않는다.
  useLayoutEffect(() => {
    if (textRef.current.innerText !== name) textRef.current.innerText = name;
  }, [name]);

  // 글꼴·내용에 따라 높이가 바뀌므로 중심 좌표 계산에 실제 높이를 쓴다.
  useLayoutEffect(() => {
    const node = assetRef.current;
    setHeight(node.offsetHeight);
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isSelected) return;
    function handleMouseDown(e) {
      if (!assetRef.current.contains(e.target) && !e.target.closest('.sidebar')) {
        // 다른 요소를 눌러 선택이 이미 넘어갔다면 그대로 둔다.
        setSelectedId((current) => (current === id ? null : current));
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isSelected, id, setSelectedId]);

  function snapPosition(d) {
    const guides = [];
    const snappedX = snap(d.x, width, canvasSize.width, 'vertical', guides);
    const snappedY = snap(d.y, height, canvasSize.height, 'horizontal', guides);
    return { x: snappedX, y: snappedY, guides };
  }

  function handleDragStop(e, d) {
    const snapped = snapPosition(d);
    setGuides([]);
    updateAsset(id, {
      style: {
        ...asset.style,
        x: `${((snapped.x + width / 2) / canvasSize.width) * 100}%`,
        y: `${((snapped.y + height / 2) / canvasSize.height) * 100}%`,
      },
    });
  }

  return (
    <Rnd
      size={{ width, height: 'auto' }}
      position={{ x: left, y: top }}
      enableResizing={false}
      disableDragging={locked}
      onDrag={(e, d) => setGuides(snapPosition(d).guides)}
      onDragStop={handleDragStop}
    >
      <div
        ref={assetRef}
        className={`asset asset-text${isSelected ? ' current' : ''}${locked ? ' locked' : ''}`}
        onMouseDown={() => setSelectedId(id)}
      >
        <button className="btn-remove" onClick={() => removeAsset(id)}>
          <RiCloseCircleFill />
        </button>
        <div
          ref={textRef}
          style={{
            fontFamily: 'Pretendard',
            fontSize: '48px',
            color: '#ffffff',
            ...textStyle,
            pointerEvents: isSelected ? 'auto' : 'none',
            cursor: isSelected ? 'default' : 'inherit',
          }}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={(e) => updateAsset(id, { name: e.currentTarget.innerText })}
        />
      </div>
    </Rnd>
  );
}

export default Asset;
