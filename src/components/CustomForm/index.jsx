// import { defineComponent, shallowRef } from 'vue'
// import {
//   ElForm,
//   ElFormItem,
//   ElInput,
//   ElSelect,
//   ElOption,
//   ElRadioGroup,
//   ElRadio,
//   ElCheckboxGroup,
//   ElCheckbox,
//   ElDatePicker,
// } from 'element-plus'

// export default defineComponent({
//   name: 'CustomForm',
//   props: {
//     itemList: { type: Array, default: () => [] },
//     rules: { type: Object, default: () => ({}) },
//     formData: {
//       type: Object,
//       default: () => ({}),
//     },
//     itemStyle: { type: Object, default: () => ({}) },
//   },
//   setup(props, { emit, attrs, expose, slots }) {
//     // console.log(expose, slots, attrs)

//     const $slotList = slots
//     const formRef = shallowRef(null)

//     function renderItem(it) {
//       if (it.type === 'input') {
//         return <ElInput v-model={props.formData[it.prop]} {...it.componentProps} />
//       } else if (it.type === 'select') {
//         return (
//           <ElSelect v-model={props.formData[it.prop]} {...it.componentProps}>
//             {it.options?.()?.map?.((item) => {
//               return <ElOption {...item} key={item.label}></ElOption>
//             })}
//           </ElSelect>
//         )
//       } else if (it.type === 'radio') {
//         return (
//           <ElRadioGroup v-model={props.formData[it.prop]} {...it.componentProps}>
//             {it.options?.()?.map?.((item, index) => {
//               return (
//                 <ElRadio {...item} key={index}>
//                   {item.label || item.name || ''}
//                 </ElRadio>
//               )
//             })}
//           </ElRadioGroup>
//         )
//       } else if (it.type === 'checkboxGroup') {
//         return (
//           <ElCheckboxGroup v-model={props.formData[it.prop]} {...it.componentProps}>
//             {it.options?.()?.map?.((item, index) => {
//               return <ElCheckbox {...item} key={index}></ElCheckbox>
//             })}
//           </ElCheckboxGroup>
//         )
//       } else if (it.type == 'checkbox') {
//         return it.options?.()?.map?.((item, index) => {
//           return <ElCheckbox v-model={item.prop} {...item} key={index}></ElCheckbox>
//         })
//       } else if (it.type === 'datetime') {
//         return <ElDatePicker v-model={props.formData[it.prop]} {...it.componentProps}></ElDatePicker>
//       }

//       const PropSlot = $slotList[it.prop] || (() => '')
//       return <PropSlot />
//     }

//     expose({
//       instance: formRef,
//     })

//     return () => {
//       return (
//         <ElForm {...attrs} ref={formRef} model={props.formData} rules={props.rules}>
//           {props.itemList.map((item) => {
//             return !item.hideFormItem ? (
//               <ElFormItem
//                 {...item.formItemProps}
//                 prop={item.prop}
//                 label={item.label}
//                 key={item.label}
//                 style={props.itemStyle}
//               >
//                 {renderItem(item)}
//                 {$slotList['common']?.({ data: item })}
//               </ElFormItem>
//             ) : (
//               ''
//             )
//           })}
//         </ElForm>
//       )
//     }
//   },
// })
