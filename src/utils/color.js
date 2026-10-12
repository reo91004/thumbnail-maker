function getRgba({ r, g, b, a }) {
  return `rgba(${r},${g},${b},${a})`;
}

function getGradient({ form, direction, from, to }) {
  return `${form}-gradient(${form === 'linear' ? `${direction}deg,` : ''} ${getRgba(from)}, ${getRgba(to)})`;
}

export { getRgba, getGradient };
