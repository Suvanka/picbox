// 图片上传信息模板
export interface UploadImage {
  name: string                  // 文件名
  orginal_size: number          // 原始大小
  upload_type: number           // 上传类型
  ext: string                   // 文件扩展名
  orginal_base64data: string    // 原始base64数据
  orginal_base64: string        // 原始base64编码
  folder: string                // 文件夹
  status: string                // 状态
  download_url: string          // 下载地址
  git_url: string               // git地址
  html_url: string              // html地址
  sha: string                   // 图片的哈希值
  url: string                   // 原始url
  cdn_url: string               // cdn加速url
}
