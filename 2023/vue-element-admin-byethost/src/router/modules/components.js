/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: 'Components',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/components-demo/index'),
      name: 'Index',
      meta: { title: 'Index' }
    },
  ]
}

export default componentsRouter
