<template>
  <div>
    <p>
      <button @click="edit(1)">添加</button>
      <button @click="edit(2)">删除</button>
      <button @click="edit(3)">重置</button>
      <button @click="scrollTo(9000)">滚动到指定位置</button>
    </p>

    <div class="test-scroll">
      <div class="test-content">
        <div v-for="item in sliceData" :key="item.key" class="test-content-item">
          <img
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            style="width: 47px; height: 47px; border-radius: 50%"
          />
          <p>{{ item?.el + '-----' + item?.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useVirtualList from '@/hooks/useVirtualList.js'

const dataSource = ref(
  Array(10000)
    .fill(1)
    .map((_, index) => ({
      el: index + 1,
      text: generateRandomText(),
      key: index + 1,
    })),
)

const { sliceData, scrollTo } = useVirtualList(dataSource, {
  scrollContainer: '.test-scroll',
  contentContainer: '.test-content',
  itemContainer: '.test-content-item',
  size: 20,
  bufferSize: 10,
  keyField: 'key',
  itemHeight: 50,
})

function generateRandomText() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = Math.floor(Math.random() * 141) + 60 // 随机生成60到200之间的长度
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}

function edit(type) {
  if (type == 1) {
    dataSource.value.push({
      el: dataSource.value.length + 1,
      text: generateRandomText(),
      key: dataSource.value.length + 1,
    })
  }

  if (type == 2) {
    dataSource.value.splice(dataSource.value.length - 1, 1)
  }

  if (type == 3) {
    dataSource.value = []
  }
}
</script>

<style lang="scss" scoped>
.test-scroll {
  width: 400px;
  height: 450px;
  overflow-y: auto;

  .test-content {
    will-change: transform;

    .test-content-item {
      background-color: #fff;
      width: 100%;
      white-space: normal;
      box-sizing: border-box;
      overflow: hidden;
      word-break: break-all;
      display: flex;
      color: #666;
      padding: 5px;
      font-size: 12px;
      align-items: center;

      > :nth-child(2) {
        margin: 0 0 0 10px;
      }
    }
  }
}
</style>
