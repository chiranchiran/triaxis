self.onmessage = async function (e) {
  const { file, fileName } = e.data;

  try {
    const hash = await calculateFileHash(file, fileName);
    self.postMessage({ hash });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
//计算采样hash，内容+文件名结合，防止内容相同文件名不同无法上传
//采样规则取开头、中间、结果个部分，总大小约 2MB
async function calculateFileHash(file, fileName) {
  const sampleSize = 2 * 1024 * 1024;
  const chunkSize = 64 * 1024;

  const encoder = new TextEncoder();
  const fileNameData = encoder.encode(fileName);

  const samples = [];

  samples.push(file.slice(0, Math.min(sampleSize / 3, file.size)));

  if (file.size > sampleSize) {
    const midStart = Math.floor(file.size / 2 - sampleSize / 6);
    samples.push(file.slice(midStart, midStart + sampleSize / 3));
  }

  if (file.size > sampleSize / 3) {
    const endStart = Math.max(0, file.size - sampleSize / 3);
    samples.push(file.slice(endStart, file.size));
  }

  const sampleBlob = new Blob([...samples, fileNameData]);
  const sampleBuffer = await sampleBlob.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest('SHA-256', sampleBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}