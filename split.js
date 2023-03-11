#!/usr/bin/env node
const decode = require('image-decode');
const encode = require('image-encode');
const fs = require('fs');

function getPart(data, width, height, partWidth, partHeight, x, y) {
  const pixels = [];
  const bytePerPixel = 4;

  for (let i = 0; i < partHeight; i++) {
    const rowOff = y * partHeight * width + i * width;
    const colOff = x * partWidth;
    const row = data.slice((rowOff + colOff) * bytePerPixel, (rowOff + colOff) * bytePerPixel + partWidth * bytePerPixel);
    pixels.push(...row);
  }

  return pixels;
}

const [ imgPath, partWidth, partHeight ] = process.argv.slice(2);
if (imgPath == null || partWidth == null || partHeight == null) {
  console.log('Invalid params!\n\nsplit.js [image-path] [part-width] [part-height]');
  process.exit(1);
}

const { data, width, height } = decode(fs.readFileSync('./app_images.png'));
console.log(`Image size: ${width}x${height}`);

if (width % partWidth !== 0 || height % partHeight !== 0) {
  console.log('Invalid part size!');
  process.exit(1);
}

let counter = 0;
for (let i = 0; i < width / partWidth; i++) {
  for (let j = 0; j < height / partHeight; j++) {
    const partPixels = getPart(data, width, height, partWidth, partHeight, i, j);
    const buf = Buffer.from(encode(partPixels, [ partWidth, partHeight ], 'png'));
    fs.writeFileSync(`${i}x${j}.png`, buf);
  }
}
