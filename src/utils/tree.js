// const arr = [
//     { id: 1, name: '部门1', pid: 0 },
//     { id: 2, name: '部门2', pid: 1 },
//     { id: 3, name: '部门3', pid: 1 },
//     { id: 4, name: '部门4', pid: 3 },
//     { id: 5, name: '部门5', pid: 4 },
//   ]
//   console.log(toTree(arr, 'id', 'pid'))
//   console.log(toTree2(arr, 'id', 'pid'))

const isArray = (arr) => Array.isArray(arr)

export function toTree(arr = [], idKey = 'id', parentKey = 'pid', childKey = 'children') {
  if (!isArray(arr) || !idKey || !parentKey || !childKey) return []

  const arrMap = {}
  const res = []

  arr.forEach((item) => (arrMap[item[idKey]] = { ...item, [childKey]: [] })) //create template
  arr.forEach((item) => {
    const id = item[idKey]
    const pid = item[parentKey]

    if (arrMap[pid]) arrMap[pid][childKey].push(arrMap[id]) //find children
    if (!pid) res.push(arrMap[id]) //top item
  })

  return res
}

export function toTree2(arr = [], idKey = 'id', parentKey = 'pid', childKey = 'children') {
  if (!isArray(arr) || !idKey || !parentKe || !childKey) return []

  const res = []
  arr.forEach((item) => {
    item[childKey] = arr.filter((el) => item[idKey] == el[parentKey]) //find children
    if (!item[parentKey]) res.push(item) //top item
  })

  return res
}
