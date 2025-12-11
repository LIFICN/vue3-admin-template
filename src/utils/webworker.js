// webworker sample
// const workerTemplate = function () {
//   self.onmessage = (e) => {
//     self.postMessage('webworker已收到参数: ' + JSON.stringify(e.data || {}))

//     //抛异常
//     // throw new Error('webworker: 参数传递错误')
//   }
// }

// runWorker(workerTemplate, '你好，世界')
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.error(err)
//   })

export const runWorker = (workerTemplate, options) => {
  return new Promise((reslove, reject) => {
    try {
      if (typeof workerTemplate !== 'function') throw new Error('workerTemplate has to be function')
      const localJs = URL.createObjectURL(new Blob([`(${workerTemplate.toString()})()`], { type: 'text/javascript' }))
      const worker = new Worker(localJs)

      const closeAll = function () {
        worker.terminate()
        URL.revokeObjectURL(localJs)
      }

      options && worker.postMessage(options)

      worker.onmessage = (e) => {
        reslove(e.data)
        closeAll()
      }

      worker.onmessageerror = (err) => {
        reject(err)
        closeAll()
      }

      worker.onerror = (err) => {
        reject(err)
        closeAll()
      }
    } catch (err) {
      reject(err)
    }
  })
}
