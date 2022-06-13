import path from 'path';
import imageToBase64 from '../../../Utils/imageToBase64';
import getConfig from '../../../config';
import UploadModel from './upload.model';

const { publicPath, serverUrl } = getConfig;

export const uploadAsset = async (req, res) => {
  const { file, user } = req;

  try {
    const thumbnail = await imageToBase64(file);
    const data = await UploadModel.create({
      thumbnail,
      mimetype: file?.mimetype,
      pathname: file?.destination,
      filename: file?.filename,
      created_by: user?.id,
    });

    return res.status(200).json({
      id: data.id,
      filename: file.originalname,
      mimetype: file.mimetype,
      thumbnail,
      url: `${serverUrl}/v1/public/${file.filename}`,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};

export const getImage = (req, res) => {
  const { fileName } = req.params;
  return res.sendFile(path.join(publicPath, fileName));
};
