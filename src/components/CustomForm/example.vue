<!-- <script setup>
import { shallowRef, ref } from 'vue'

const itemList = shallowRef([
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    formItemProps: {},
    componentProps: {
      placeholder: '请输入姓名',
      clearable: true,
    },
  },
  {
    label: '自定义插槽',
    prop: 'custom',
    formItemProps: {},
  },
  {
    label: '性别',
    prop: 'sex',
    type: 'radio',
    options: () => [
      { label: '男', value: '男' },
      { label: '女', value: '女', disabled: true },
    ],
    formItemProps: {},
    componentProps: {
      size: 'default',
    },
  },
  {
    label: '国家',
    prop: 'country',
    type: 'checkboxGroup',

    options: () => [
      { label: '中国', value: '中国' },
      { label: '美国', value: '美国' },
      { label: '英国', value: '英国', disabled: true },
    ],
    formItemProps: {},
    componentProps: {},
  },
  {
    label: '下拉选项',
    prop: 'type',
    type: 'select',
    options: () => [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3', disabled: true },
    ],
    formItemProps: {},

    componentProps: {
      clearable: true,
    },
  },
  {
    label: '时间',
    prop: 'date',
    type: 'datetime',
    formItemProps: {},
    componentProps: {
      type: 'datetimerange',
      valueFormat: 'yyyy-MM-dd',
      placeholder: '选择日期',
      clearable: true,
    },
  },
])

const rules = shallowRef({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
  ],
  custom: [{ required: true, message: '请输入自定义插槽', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  country: [{ required: true, message: '请选择国家', trigger: 'change' }],
  type: [{ required: true, message: '请选择下拉选项', trigger: 'change' }],
  date: [{ required: true, message: '请选择时间', trigger: 'change', type: 'array' }],
})

const customFormRef = shallowRef(null)

const formData = ref({
  name: '张三',
  custom: '自定义插槽',
  sex: '男',
  country: ['中国'],
  type: '1',
  date: ['2024-01-01 00:00:00', '2024-01-01 00:00:00'],
})

const validateForm = async () => {
  const res = await customFormRef.value?.instance?.validate?.()
  console.log(res)
  console.log('formData', formData.value)
}
</script>

<template>
  <div>
    <CustomForm ref="customFormRef" :itemList="itemList" :rules="rules" :formData="formData" label-position="right">
      <template #custom>
        <el-input placeholder="自定义插槽" v-model="formData.custom" />
      </template>
    </CustomForm>

    <el-button type="primary" @click="validateForm">验证表单</el-button>
  </div>
</template> -->
