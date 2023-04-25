// 图像处理函数，文件名后加随机哈希值，防止同名冲突
const imageProcess = (file, folder) => {
  return new Promise(async (resolve) => {
    const orginal_base64: any = await fileByBase64(file)
    resolve({
      name: `${file.name.substring(0, file.name.lastIndexOf('.'))}_${createHash(4)}`,
      orginal_size: file.size,
      orginal_base64data: orginal_base64.replace(/^data:image\/\w+;base64,/,''),
      orginal_base64: orginal_base64,
      folder: folder,
      ext: getFileExtendingName(file.name),
    })
  })
}

// 图像转base64
const fileByBase64 = (file) => {
  return new Promise(async (resolve) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e: any) {
    resolve(e.target.result)
    }
  })
}

// 获取文件扩展名
function getFileExtendingName(filename) {
  var reg = /\.[^\.]+$/
  var matches = reg.exec(filename)
  if (matches) {
    return matches[0]
  }
  return ''
}

// 生成随机哈希值
function createHash(hashLength) {
  return Array.from(Array(Number(hashLength) || 24), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
}

export { imageProcess, fileByBase64 }
