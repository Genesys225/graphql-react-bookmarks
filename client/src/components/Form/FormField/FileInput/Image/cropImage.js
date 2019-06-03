const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url.toString();
    image.onload = () => resolve(image);
    image.onerror = error => reject(error);
    // image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
  });

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 */
export default async function getCroppedImg(imageSrc, pixelCrop, round = false) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  console.log(round);
  if (round) {
    ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y);
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(pixelCrop.width / 2, pixelCrop.height / 2, pixelCrop.width / 2, 0, Math.PI * 2);
    // ctx.closePath();
    ctx.fill();
    // ctx.globalCompositeOperation = "xor";
    // ctx.fillStyle = "rgba(255,255,255,0)"; // or 'transparent'
    // ctx.fillRect(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  } else
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      const file = new File([blob], "blobfile.jpeg");
      resolve({ blobUrl: URL.createObjectURL(blob), file });
    }, "image/jpeg");
  });
}
