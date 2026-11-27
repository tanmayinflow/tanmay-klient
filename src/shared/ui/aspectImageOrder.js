// The private account stores IDs only. Unarranged galleries keep the source
// order. New uploads and newly published board entries join an arranged gallery at the end.
export function orderedAspectImages(data, board) {
  const hidden = new Set(data.hiddenBoardImages || []);
  const images = [...(data.imgs || []), ...board.filter(image => !hidden.has(image.id))];
  const saved = data.imageOrder;
  if (!Array.isArray(saved) || !saved.length) return images;
  const available = new Map(images.map(image => [image.id, image]));
  const ordered = [];
  for (const id of saved) {
    const image = available.get(id);
    if (image) { ordered.push(image); available.delete(id); }
  }
  return [...ordered, ...available.values()];
}

export function movedAspectImageOrder(saved, images, source, target) {
  const ids = images.map(image => image.id);
  if (source === target || !ids.includes(source) || !ids.includes(target)) return null;
  // Keep IDs belonging to a temporarily unavailable board when moving uploads offline.
  const order = [...new Set([...(Array.isArray(saved) ? saved : []), ...ids])];
  const destination = order.indexOf(target);
  order.splice(order.indexOf(source), 1);
  order.splice(destination, 0, source);
  return order;
}
