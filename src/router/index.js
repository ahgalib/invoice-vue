import { createRouter, createWebHistory } from 'vue-router'
import InvoiceView from '../views/InvoiceView.vue'
import SingleInvoiceView from '../views/SingleInvoiceView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'InvoiceView',
      component: InvoiceView
    },
    {
      path: '/single-invoice/:uid',
      name: 'SingleInvoiceView',
      //component: SingleInvoiceView
      component: () => import('../views/SingleInvoiceView.vue')
    },
    
    
  ]
})

export default router
