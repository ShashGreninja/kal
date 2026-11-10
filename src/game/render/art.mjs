const sheets = {
  'railway-west': { width: 1671, height: 941, rows: [1, 314, 627, 939] },
  'railway-middle': { width: 1671, height: 941, rows: [1, 312, 627, 939] },
  'railway-east': { width: 1671, height: 941, rows: [1, 350, 650, 939] },
};

// A cropped viewport around a natural-ratio image. The bitmap is never stretched.
export function drawCrop(element, { src, width, height, x = 0, y = 0, cropWidth = width, cropHeight = height, alt = '', focus = .5 }) {
  element.replaceChildren();
  element.classList.add('art-view');
  element.style.setProperty('--art-ratio', cropWidth / cropHeight);
  element.style.setProperty('--art-focus', focus);
  const tile = document.createElement('div');
  tile.className = 'art-tile';
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.width = width;
  image.height = height;
  image.draggable = false;
  image.style.width = `${width / cropWidth * 100}%`;
  image.style.left = `${-x / cropWidth * 100}%`;
  image.style.top = `${-y / cropHeight * 100}%`;
  tile.append(image);
  element.append(tile);
}

export function drawRoom(element, room, year) {
  if (room.art === 'platform-eras') {
    drawCrop(element, { src: '/art/platform-eras.png', width: 1672, height: 941, cropHeight: 469, y: year === 1998 ? 0 : 472, alt: `${room.name}, ${year}` });
    return;
  }
  const { width, height, rows } = sheets[room.art];
  const top = rows[room.row] + 1;
  drawCrop(element, {
    src: `/art/${room.art}.png`, width, height,
    x: year === 1998 ? 0 : width / 2, y: top,
    cropWidth: width / 2, cropHeight: rows[room.row + 1] - top - 1,
    alt: `${room.name}, ${year}`,
  });
}

export function drawPortrait(element, id) {
  if (id === 'stationmaster') {
    drawCrop(element, { src: '/art/stationmaster.png', width: 1672, height: 941, focus: .65, alt: 'Mr Kulkarni in the station office' });
    return;
  }
  drawCrop(element, {
    src: '/art/railway-witnesses.png', width: 1448, height: 1086,
    x: id % 2 * 724, y: Math.floor(id / 2) * 362,
    cropWidth: 724, cropHeight: 362, focus: .68,
    alt: 'A witness at Devgarh station',
  });
}
