<!-- <template>
  <CustomSearchTable
    :tableProps="state.tableProps"
    :columns="state.columns"
    :searchFormProps="state.searchFormProps"
    v-model:pageNum="state.pageNum"
    v-model:pageSize="state.pageSize"
    :total="state.total"
    @loadData="loadData"
    @reset="reset"
    :loading="state.loading"
  >
    <template #customHeader="{ column }">
      <span style="color: skyblue">{{ column.label }}</span>
    </template>

    <template #customColumn="{ row, column }">
      <span style="color: skyblue">{{ row[column.property] }}</span>
    </template>

    <template #toolBar>
      <div>
        <el-button type="primary">添加</el-button>
      </div>
    </template>

    <template #searchBar="{ data }">
      <div v-if="data.prop == 'customSearchField'">自定义搜索内容</div>
    </template>
  </CustomSearchTable>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  pageNum: 1,
  pageSize: 10,
  loading: false,
  tableProps: {
    data: [
      {
        name: '张三',
        sex: '男',
        custom: '自定义插槽',
      },
      {
        name: '李四',
        sex: '女',
        custom: '自定义插槽',
      },
      {
        name: '王五',
        sex: '男',
        custom: '自定义插槽',
      },
      {
        name: '赵六',
        sex: '女',
        custom: '自定义插槽',
      },
    ],
  },
  columns: [
    {
      label: '姓名',
      prop: 'name',
    },
    {
      label: '性别',
      prop: 'sex',
    },
    {
      label: '自定义插槽头部',
      prop: 'custom',
      slotName: 'customColumn',
      slotHeaderName: 'customHeader',
      width: '600px',
    },
    {
      label: '固定列',
      prop: 'fixedColumn',
      fixed: 'right',
    },
  ],
  searchFormProps: {
    itemStyle: {
      minWidth: '30%',
      maxWidth: '30%',
    },
    itemList: [
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        componentProps: {},
      },
      {
        prop: 'time',
        type: 'datetime',
        label: '交易时间',
        componentProps: { type: 'daterange', format: 'DD/MM/YYYY' },
      },
      {
        prop: 'type',
        type: 'select',
        label: '交易类型',
        options: () => {
          return [
            { value: '', label: '全部' },
            { value: 'offline', label: '线下充值' },
            { value: 'pay', label: '出行消费' },
          ]
        },
      },
      {
        prop: 'customSearchField',
        label: '自定义搜索',
      },
    ],
    formData: {
      name: '',
      time: '',
      type: '',
    },
  },
})

const loadData = async () => {
  console.log('loadData', state.searchFormProps.formData)
  state.loading = true
  setTimeout(() => {
    state.loading = false
  }, 1000)
}

function reset() {
  state.searchFormProps.formData = { name: '', time: '', type: '' }
  console.log('重置后', state.searchFormProps.formData)
}
</script>

<style lang="scss" scoped></style> -->
