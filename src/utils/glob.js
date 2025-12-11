import { defineAsyncComponent } from 'vue'

export function globComponents(app) {
  const components = []
  const modulesObjArr = [
    import.meta.glob('/src/components/*.vue'),
    import.meta.glob('/src/components/*.jsx'),
    import.meta.glob('/src/components/**/index.vue'),
    import.meta.glob('/src/components/**/index.jsx'),
  ]

  modulesObjArr.forEach((module) => {
    Object.keys(module).forEach((path) => {
      let name = ''

      if (path.includes('/index')) {
        const replacePath = path.replace('/index.vue', '').replace('/index.jsx', '')
        name = replacePath.slice(replacePath.lastIndexOf('/') + 1)
      } else {
        name = path
          .slice(path.lastIndexOf('/') + 1)
          .replace('.vue', '')
          .replace('.jsx', '')
      }

      name && components.push({ key: name, value: defineAsyncComponent(module[path]) })
    })
  })

  components.forEach((el) => app.component(el.key, el.value))
}
