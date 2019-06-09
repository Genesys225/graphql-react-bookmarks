const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url.toString();
    image.onload = () => resolve(image);
    image.onerror = error => reject(error);
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
  });

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 */
export default async function getCroppedImg(
  image,
  pixelCrop,
  round = false,
  mimeType = "image/jpeg"
) {
  if (round) mimeType = "image/bmp";
  const fileExt = mimeType.split("/")[1];
  const imageEl = await createImage(image.img);
  const canvas = document.createElement("canvas");
  const { width, height, x, y } = pixelCrop;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (round) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imageEl, -x, -y);
  } else ctx.drawImage(imageEl, x, y, width, height, 0, 0, width, height);
  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    const fileName = fileNamer(image, fileExt);
    canvas.toBlob(blob => {
      const file = new File([blob], fileName, {
        type: mimeType
      });
      resolve({ blobUrl: URL.createObjectURL(blob), file });
    }, mimeType);
  });
}

const fileNamer = ({ fileName }, fileExt) => {
  return `cropped_${fileName.split(".")[0]}_0.${fileExt}`;
};
