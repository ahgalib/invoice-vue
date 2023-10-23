<script setup>
import {defineEmits} from 'vue'
import InvoiceHeader from './SingleInvoiceHeader.vue';

import InvoiceItems from './SingleInvoiceItems.vue';
import AmountDetails from './SingleInvoiceAmoutDetails.vue';


const emit = defineEmits(['get-due-amount'])

const getDueDate = (dueAmount) => {
    emit('get-due-amount',dueAmount)

}

const props = defineProps({
  
    bussinessData: Object,
    userData:Object,
    invoiceData:Object,
    invoiceItem:Object,
   
    depositRequest:Object,
    updateDueAmount: String,
    transaction: Array,
   
   
})


</script>

<template>
    <InvoiceHeader :bussinessData = "bussinessData"/>
   
    <InvoiceItems :invoiceItem="invoiceItem"/>
    <AmountDetails :invoiceData = "invoiceData" :depositRequest="depositRequest" :updateDueAmount="updateDueAmount" :transaction="transaction" @pass-updated-due-amount="getDueDate"/>
    
    

</template>