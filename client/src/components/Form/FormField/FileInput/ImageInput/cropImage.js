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
  const { width, height, x, y } = pixelCrop;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  console.log(round);
  if (round) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, -x, -y);
  } else ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      const file = new File([blob], "blobfile.jpeg", { type: "image/jpeg" });
      resolve({ blobUrl: URL.createObjectURL(blob), file });
    }, "image/jpeg");
  });
}
