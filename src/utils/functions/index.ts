export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export function extractFileName(text: string) {
  const regex = /fileName=([^"]*)/
  const match = text.match(regex)
  if (match) {
    return match[1]
  } else {
    return "文件名称获取失败"
  } 
}

export function extractFileUrl(text: string) {
  const regex = /<img[^>]+src="([^"]+)"[^>]*>/
  const match = text.match(regex)
  if (match) {
    return match[1]
  } else {
    return "文件链接获取失败"
  } 
}

