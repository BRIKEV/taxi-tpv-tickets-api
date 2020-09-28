const vision = require('@google-cloud/vision');

module.exports = () => {
  const start = async () => {
    const client = new vision.ImageAnnotatorClient();

    const textDetection = async buffer => {
      const [detections] = await client.textDetection(buffer);
      return detections.textAnnotations;
    };

    return { textDetection };
  };

  return { start };
};
