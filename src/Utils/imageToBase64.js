import fs from 'fs';
import path from 'path';
import config from '../../src/config';
import sharp from 'sharp';

const { publicPath } = config;

export default async function imageToBase64(file) {
  if (file.mimetype.includes('image')) {
    const bitmap = fs.readFileSync(path.join(publicPath, file.filename));

    const resize = sharp(bitmap).resize(320, 240);

    try {
      const bufferFile = await resize.toBuffer();

      return bufferFile.toString('base64');
    } catch (e) {
      console.log(e);
    }
  }
  return undefined;
}
