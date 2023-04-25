import Clipboard from 'clipboard'
import { Alert } from './alert'

// 获取文件大小（开源代码）
function GetFileSize(size) {
  if (!size) return ''
  var num = 1024.0 //byte
  if (size < num) return size + ' b'
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + ' KB' //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + ' M' //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + ' G' //G
  return (size / Math.pow(num, 4)).toFixed(2) + ' T' //T
}

// 复制文本到剪贴板
function CopyText() {
  var clipboard = new Clipboard('.copy-btn')
  clipboard.on('success', (e) => {
    Alert({
      type: 'success',
      text: '复制成功',
    })
    clipboard.destroy()
  })
  clipboard.on('error', (e) => {
    Alert({
      type: 'danger',
      text: '复制失败',
    })
    clipboard.destroy()
  })
}

// 根据错误信息返回提示
function FormatMessage(text) {
  switch (true) {
    case text == 'Bad credentials': {
      return 'access token错误'
    }
    case text.indexOf("wasn't supplied") >= 0: {
      return '已有同名文件夹'
    }
    case text == 'This repository is empty.': {
      return '当前仓库为空，请新建文件夹'
    }
    case text == 'path cannot start with a slash': {
      return '名称不能为空'
    }
    case text == 'Requires authentication': {
      return 'access token错误'
    }
    case text == 'Resource not accessible by personal access token': {
      return '该仓库未授权'
    }
    default:
      return '未知错误'
  }
}

export {
  GetFileSize,
  CopyText,
  FormatMessage,
}
