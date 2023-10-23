<script setup>
import {onMounted, ref} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
const invoiceData = ref([])
onMounted(async() => {
    try {
    const response = await axios.get('http://127.0.0.1:8000/api/invoices')
    invoiceData.value = response.data
    console.log(invoiceData.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
    
    <div class="row">       
        <div class="col-12">
            <div class="print invoice p-3 p-sm-4 card">    
                <div class="table-responsive mt-4">
                    <table class="table border border-2 rounded-3 py-3 table-hover table-striped" id="activeList">                                      
                        <thead>
                            <tr>
                                <th class="text-dark">Invoice</th>
                                <th class="text-dark">Status</th>
                                <th class="text-dark">Date</th>
                                <th class="text-dark">Amount</th>
                            </tr>
                        </thead>                       
                        <tbody>
                            <tr v-for = "datas in invoiceData" :key="datas.id">
                                <td>{{ datas.user.first_name }} {{ datas.user.last_name }}
                                    <RouterLink :to = "'/single-invoice/' + datas.id"><p>{{ datas.invoice_no }}</p></RouterLink>
                                </td>
                                <td>{{ datas.paid_status }}</td>
                                <td>{{ datas.issue_date }}</td>
                                <td>{{datas.currency_symbol}} {{ datas.total }}</td>
                            </tr>
                        
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
    </div>
       
</template>