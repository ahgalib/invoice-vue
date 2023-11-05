<script setup>
import { onMounted, watch } from 'vue';
import {ref, defineEmits, computed} from 'vue'
import axios from 'axios'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const props = defineProps({
    invoiceData : Object,
    //transaction : Array,
    //transactionDataShow: Array,
    openTransactionModal : Function,
    transaction:Array,
})

const emit = defineEmits(['updatedDueAmount','passDeleteId','passUpdatedAmount'])

const totalAmount = computed(() => { 
    return props.transaction.reduce((total, transaction) => {
        const paidAmount = parseFloat(transaction.paid_amount);

        if (!isNaN(paidAmount)) {
            // Parse total as float before performing arithmetic operations
            total = parseFloat(total);
            // Check if total is a valid number
            if (!isNaN(total)) {
                // Subtract paidAmount from total and round to 2 decimal places
                return (total + paidAmount).toFixed(2);
            }
            // If total is not a valid number, return 0
            return 0;
        }

        // If paidAmount is not a valid number, return total as is
        return total;
    }, 0);
    
});



watch(totalAmount,(updatedAmount)=>{
    emit('passUpdatedAmount',updatedAmount)
})




let fetchData = ref(false);
let id = props.invoiceData.id
onMounted(() => {
    fetchData.value = true
    props.openTransactionModal()
})

</script>


<template v-if="fetchData">
    <div class="modal fade view-transaction text-black" id="view-transaction" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">View Transaction</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body" >
                <div class="table-responsive-xl">
                    <table class="table table_append_modal">
                        <thead>
                            <tr>
                                <th scope="col">Transaction Id</th>
                                <th scope="col">Date</th>
                                <th scope="col">Note</th>
                                <th scope="col">Amount</th>
                                <th class="text-center" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody class="transactionDataAppend">
                            <tr v-for="transactionData  in transaction" :key="transactionData.id">
                                <td>{{ transactionData.id }}</td>
                                <td>{{ transactionData.paid_date }}</td>
                                <td>{{ invoiceData.note }}</td>
                                <td>{{ invoiceData.currency_symbol }} {{transactionData.paid_amount}}</td>
                                <!-- <td><button class="btn btn-danger" @click="deleteTransaction(transactionData.id)">Delete</button></td> -->
                                <td><button class="btn btn-danger" @click="$emit('passDeleteId',transactionData.id)">Delete</button></td>
                            </tr>
                            <tr>
                                <th>total</th>
                                <th>{{ totalAmount }}</th>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>

                    <button v-if="invoiceData.due_amount > 0 " type="submit" class="btn bg-gradient-warning add-payment-btn" data-bs-toggle="modal"
                    data-bs-target="#paid-modal"> Add Payment </button>

            </div>

        </div>
    </div>
</div>

</template>