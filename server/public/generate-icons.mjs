import fs from 'fs';
import { createCanvas } from 'canvas';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#FF4E6A');
  grad.addColorStop(1, '#8B5CF6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  
  // Draw heart
  ctx.fillStyle = 'white';
  ctx.font = `${size * 0.5}px "Segoe UI Emoji"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('??', size/2, size/2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon-${size}x${size}.png`, buffer);
  console.log(`Generated icon-${size}x${size}.png`);
});

console.log('All icons generated!');
