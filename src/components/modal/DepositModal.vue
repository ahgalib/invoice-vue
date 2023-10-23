<script setup>
import {ref, defineEmits} from 'vue'
import axios from 'axios'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
    invoiceData :Object,
    storeDueAmount : String
})
const emit = defineEmits(['create-deposit']);

let percentage = ref();
let depAmount = ref();
let dueDate = ref();
let id = props.invoiceData.id

let depositRequestAmount = ref(null);
let dueAmount = ref(props.storeDueAmount)

const createDeposit = async () => {
 
    try{
        let apiCallData = await axios.post('http://127.0.0.1:8000/api/invoice/deposit/'+id,{
            'invoice_id' : id,
            'diposit_amount' : depAmount.value,
            'due_date' : dueDate.value
        })

        if(apiCallData){
            emit('create-deposit')
        }
        toast.success("Deposit Request Created Successfully", {
        autoClose: 3000,
        });

        // if(depAmount.value > 0){

        //     depositRequestAmount = true;
        // }else{
        //     depositRequestAmount = false;
        // }      

    }catch(err){
        console.log(err);
    }
}

function percentageCalculate(){
    let totalAmount = props.storeDueAmount
    let depositAmount = depAmount.value;
   
    if (!isNaN(totalAmount) && !isNaN(depositAmount)) {
        if (depositAmount > totalAmount) {
            alert("Amount should not be bigger than total amount");
            depAmount.value = 0;
            percentage.value = 0
            
        } else {
            percentage.value = ((depositAmount / totalAmount) * 100).toFixed(2);
            
        } 
    }
}

function percentageDepositAmount(){
    
    let totalAmount = props.storeDueAmount
  
    if (percentage.value > 100) {
        alert("percentage should not be bigger 100");
        depAmount.value = 0;
        percentage.value = 0
        
    } else {
        depAmount.value = ((totalAmount * percentage.value) / 100).toFixed(2);
       
    } 
    
}

//clear modal when click close button
const clearModal = () => {
    percentage.value = ''
    depAmount.value = ''
    dueDate.value = ''
}
</script>

<template>
    <div class="modal fade deposit-request" id="deposit-request" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content text-black">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Request a deposit</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="row" id="depositRequest" @submit.prevent="createDeposit">
                   
                   
                    <div class="d-flex mb-4">
                        <strong>Total Amount</strong> <input
                            class="total-amount-field d-inline-block badge border-0 bg-secondary ms-auto" type="hidden"
                            v-model="dueAmount">
                            <p class="d-inline-block badge border-0 bg-secondary ms-auto p-2 total_amount_p">Total {{invoiceData.currency_symbol }}         {{storeDueAmount}}
                            </p>
                    </div>

                   
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="percentange" class="col-form-label">Percentange:</label>
                            <input type="number" class="form-control percentage-field" min="0" step=".01"
                                 placeholder="%" v-model="percentage" v-on:keyup="percentageDepositAmount">
                        </div>
                    </div>

                   
                    <div class="col-md-6">
                        <div class="form-group">
                           {{ depAmount }}
                            <label for="amount" class="col-form-label">Amount:</label>
                            <input type="number" class="form-control amount-field" step=".01"  name="diposit_amount"
                                placeholder="0" v-model="depAmount" v-on:keyup="percentageCalculate">
                        </div>
                    </div>

                  
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="amount" class="col-form-label">Due Date:</label>
                            <input type="date" class="form-control dueDate" id="dueDate" name="due_date" v-model="dueDate">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="modal-footer px-0">
                            <button type="button" class="btn btn-light closeBtn" data-bs-dismiss="modal" @click="clearModal">Close</button>
                            <button type="submit" class="btn bg-gradient-warning" data-bs-toggle="modal" data-bs-target=".send-deposit-request"> Save</button>
                            <button type="submit" class="btn bg-gradient-success saveAndSendButton" data-bs-toggle="modal" data-bs-target=".send-deposit-request" disabled> Save & Send</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    </div>
</div>
</template>