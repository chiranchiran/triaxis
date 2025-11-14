import HashWorker from '../../workers/hash-woker?worker';

//计算文件hash的worker
export class HashCalculator {
  constructor() {
    this.worker = null;
  }

  calculateHash(file, fileName) {
    return new Promise((resolve, reject) => {
      this.worker = new HashWorker;

      this.worker.onmessage = (e) => {
        if (e.data.hash) {
          resolve(e.data.hash);
        } else if (e.data.error) {
          reject(new Error(e.data.error));
        }
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }
      };

      this.worker.onerror = (error) => {
        reject(error);
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }
      };

      this.worker.postMessage({ file, fileName });
    });
  }

  //中断上传的时候暂停hash计算
  cancel() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}