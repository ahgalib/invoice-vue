<script setup>
import {ref, defineEmits} from 'vue'
import axios from 'axios'
import { uuid } from 'vue-uuid';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
    invoiceData:Object
})

const emit = defineEmits(['add-payment','passTotalPaidAmount','paidFormSubmit']);

let id = props.invoiceData.id;

let isFullyPaid = ref(false);
let paiderror = ref()

let paidAmount = ref()
let paidDate = ref()
let paymentMethod = ref()
let note = ref()
let totalPaidAmount = ref();

let rendomNumber = ref();

const checkPaid = () => {
    if(props.invoiceData.due_amount <= paidAmount.value){
        isFullyPaid.value = true
      
    }else{
        isFullyPaid.value = false
    }
   
}

const updatePaidAmount = () => {
  if (isFullyPaid.value) {
    paidAmount.value = props.invoiceData.due_amount;
   
  } else {
    paidAmount.value = 0;
  }
}


const addPayment = async () => {
    
    if(paidAmount.value <= 0 || paidAmount.value == ''){
        paiderror.value = 'Paid Amount Should be greater then 0'
    }else{
        paiderror.value = ''
        try{
            let getPaidInfo =  await axios.post('http://127.0.0.1:8000/api/add-transaction',{
                'invoice_id' : id,
                'paid_amount' : paidAmount.value,
                'paid_date' : paidDate.value,
                'payment_method' : paymentMethod.value,
                'note' : note.value,
                
            })

            if(getPaidInfo){
                emit('paidFormSubmit')
            }
            
            totalPaidAmount.value = getPaidInfo.data.total_paid_amount;
            console.log('try to get total paid amout ', totalPaidAmount.value)
            emit('passTotalPaidAmount',totalPaidAmount.value)

            toast.success("Transaction successfully done", {
                autoClose: 2000, // Duration in milliseconds
            });   

            paidAmount.value = ''
            paidDate.value = ''
            paymentMethod.value = ''
            note.value = ''
          
        }catch(err){
            console.log(err);
            
        }

    }
}


</script>

<template>
    <div class="modal fade text-black" id="paid-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalMessageTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Mark paid</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="invoicePaidForm" @submit.prevent="addPayment">

                    
                        <div class="form-check">
                            <input class="form-check-input paid-checkbox" type="checkbox" v-model="isFullyPaid" id="paid-checkbox" @change="updatePaidAmount">
                            <label class="custom-control-label" for="paid-checkbox">Fully paid</label>
                        </div>

                    
                        <div class="form-group">
                           
                            <label for="paid-amount-field" class="col-form-label">Amount Paid</label>
                            <input type="number" step="0.01" class="form-control paid-amount-field paid-amount-input" id="paid-amount-field" name="paid_amount" v-model="paidAmount" v-on:keyup="checkPaid">
                            <span class="text-danger error-msg">{{ paiderror }}</span>
                        </div>

                        
                        <div class="form-group">
                            
                            <label for="paid-date" class="col-form-label">Date:</label>
                            <input type="date" class="form-control" id="paid-date" name="paid_date" v-model="paidDate">
                        </div>

                        

                        <div class="form-group">
                            <label class="col-form-label" for="payment-method" >Method</label>
                            <select class="form-control paymentMethod" id="payment-method" name="payment_method" v-model="paymentMethod">
                                <option value="cash">Cash</option>
                                <option value="credit">Credit</option>
                                <option value="check">Check</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>
                    
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Note:</label>
                            <textarea class="form-control note" id="message-text" name="note" v-model="note"></textarea>
                        </div>

                        <div class="modal-footer px-0">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn bg-gradient-warning" data-bs-dismiss="modal">Add Payment</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
            
</template>