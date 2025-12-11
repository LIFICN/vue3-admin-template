// import { defineComponent, onMounted } from 'vue'
// import CustomForm from '../CustomForm/index.jsx'
// import { ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus'
// import styles from './index.module.scss'
// import useLang from '@/hooks/useLang.js'

// export default defineComponent({
//   name: 'CustomSearchTable',
//   emits: ['update:pageNum', 'update:pageSize', 'loadData', 'reset'],
//   props: {
//     columns: {
//       type: Array,
//       default: () => [],
//     },
//     searchFormProps: {
//       type: Object,
//       default: () => ({}),
//     },
//     tableProps: {
//       type: Object,
//       default: () => ({}),
//     },
//     pageNum: {
//       type: Number,
//       default: 1,
//     },
//     pageSize: {
//       type: Number,
//       default: 10,
//     },
//     total: {
//       type: Number,
//       default: 0,
//     },
//     loading: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   setup(props, { emit, slots }) {
//     const { t } = useLang('common')

//     onMounted(() => {
//       emit('loadData')
//     })

//     return () => {
//       return (
//         <div class={styles['custom-search-table']}>
//           <CustomForm inline={true} class="search-form" {...props.searchFormProps}>
//             {{
//               common: (data) => slots['searchBar']?.({ ...data }) || '',
//             }}
//           </CustomForm>

//           <div class={styles['search-bar']}>
//             <ElButton onClick={() => emit('reset')} loading={props.loading}>
//               {t('重置')}
//             </ElButton>

//             <ElButton
//               type="primary"
//               onClick={() => {
//                 emit('update:pageNum', 1)
//                 emit('loadData')
//               }}
//               loading={props.loading}
//             >
//               {t('搜索')}
//             </ElButton>
//           </div>

//           <div class={styles['tool-bar']}>{slots['toolBar']?.({})}</div>

//           <ElTable
//             border
//             style="width: 100%"
//             {...props.tableProps}
//             v-loading={props.loading}
//             header-cell-style={{ background: '#fafafa' }}
//           >
//             {props.columns.map((item) => (
//               <ElTableColumn {...item}>
//                 {{
//                   default: (options) =>
//                     item.slotName ? slots[item.slotName]?.({ ...options }) : options.row[item.prop],

//                   header: (options) =>
//                     item.slotHeaderName ? slots[item.slotHeaderName]?.({ ...options }) : item.label,
//                 }}
//               </ElTableColumn>
//             ))}
//           </ElTable>

//           <div class={styles['pagination']}>
//             <ElPagination
//               current-page={props.pageNum}
//               page-size={props.pageSize}
//               page-sizes={[10, 50, 100, 200]}
//               background={true}
//               layout="total, sizes, prev, pager, next"
//               onCurrentChange={(page) => {
//                 emit('update:pageNum', page)
//                 emit('loadData')
//               }}
//               onSizeChange={(size) => {
//                 emit('update:pageSize', size)
//                 emit('loadData')
//               }}
//               total={props.total}
//             />
//           </div>
//         </div>
//       )
//     }
//   },
// })
