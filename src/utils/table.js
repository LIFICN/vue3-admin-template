export function addRowSpan(data, groupkey) {
  if (!Array.isArray(data) || data.length == 0) return []

  let start = 0
  let textVal = ''
  let count = 0
  const rowSpanKey = `${groupkey}RowSpan`

  data.forEach((el, index) => {
    if (!textVal) textVal = el[groupkey]
    el[rowSpanKey] = 0

    //值相同增一
    if (textVal == el[groupkey]) count++

    //值不相同，赋值给起始分组对象，重置计数
    if (textVal != el[groupkey]) {
      data[start][rowSpanKey] = count
      start = index
      textVal = el[groupkey]
      count = 1
    }

    if (index + 1 == data.length) {
      data[start][rowSpanKey] = count
      if (textVal != el[groupkey]) el[rowSpanKey] = 1
    }
  })

  return data
}
