<template>

<div class="modal fade edit-deposit-request" id="edit-deposit-request" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered text-black" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit Request a deposit</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="row" id="editDepositRequestForm" @submit.prevent="updateDeposit">
                 
                    <div class="d-flex mb-4">
                        <strong>Total Amount</strong> <input
                            class="total-amount-field d-inline-block badge border-0 bg-secondary ms-auto" type="hidden"
                            v-model="dueAmount">
                            <p class="d-inline-block badge border-0 bg-secondary ms-auto p-2 total_amount_p"> Total
                            {{storeDueAmount}} {{invoiceData.currency}}
                          </p>
                    </div>

                    
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="percentange" class="col-form-label">Percentange:</label>
                            <input type="number" class="form-control percentage-field" v-model="percentage" min="0" step=".01"
                                placeholder="%" v-on:keyup="calculateAmount">
                        </div>
                    </div>

                 
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="amount" class="col-form-label">Amount:</label>
                            <input type="number" class="form-control amount-field" min=0 step=".01" name="diposit_amount" 
                            v-model="currentDepositAmount"
                                placeholder="Enter amount here"  v-on:keyup="calculatePercentage">
                        </div>
                    </div>

                   
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="amount" class="col-form-label">Due Date:</label>
                            <input type="date" class="form-control dueDate" id="dueDate" name="due_date" v-model="currentDepositDueDate" data-id={{invoiceData.id}}>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="modal-footer px-0">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn bg-gradient-warning" @click="$emit('close')" data-bs-toggle="modal" data-bs-target=".send-deposit-request"> Save</button>
                            <button type="submit" class="btn bg-gradient-success saveAndSendButton" data-bs-toggle="modal" data-bs-target=".send-deposit-request"> Save & Send</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    </div>
</div>




</template>

<script setup>
import {ref, onMounted, defineEmits, watch, toRef } from 'vue'

import axios from 'axios'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
    invoiceData : Object,
    depositRequest: Object,
   
    //invoiceDueAmount: Number,
    storeDueAmount : String
    
})

let currentDepositAmount = ref();
let currentDepositDueDate = ref();
if(props.depositRequest != null){
    currentDepositAmount.value = props.depositRequest.diposit_amount;
    currentDepositDueDate.value = props.depositRequest.due_date;
}

//set initial deposit amount value
watch(toRef(props, 'depositRequest'), (updatedDepoReq) => {
    console.log('got changes depositRequest', updatedDepoReq);
    currentDepositAmount.value = updatedDepoReq.diposit_amount
    console.log('deposit amount should be this ', updatedDepoReq.diposit_amount)
    calculatePercentage()
});

//set initial date value
watch(toRef(props, 'depositRequest'),(updatedDueDate) => {
    console.log('got changes depositDueDate', updatedDueDate);
    currentDepositDueDate.value = updatedDueDate.due_date
    console.log('deposit amount should be this ', updatedDueDate.due_date)
})

const emit = defineEmits(['edit-deposit','create-deposit'])

let percentage = ref();
let depositAmountRef = ref(props.depositRequest)



let copydepositRequest = ref({ ...props.depositAmountRef });

let depositRequestAmount = ref(true);


let dueAmount = ref(props.storeDueAmount)


function success () {
    return toast.success("My toast content", {
        autoClose: 3000, // Duration in milliseconds
    });
}

 emits:['close'];

// Set the initial value of copydepositRequest.diposit_amount
if(props.depositRequest != null){

    copydepositRequest.value.diposit_amount = props.depositRequest.diposit_amount;
    copydepositRequest.value.due_date = props.depositRequest.due_date;
}

 function calculatePercentage() {
   
    let totalAmount = dueAmount.value;
    //let depositAmount = copydepositRequest.value.diposit_amount;
    let depositAmount = currentDepositAmount.value;

  // Calculate percentage only if both totalAmount and paidAmount are numbers
    if (!isNaN(totalAmount) && !isNaN(depositAmount)) {
        if (depositAmount > totalAmount) {
            alert("Amount should not be bigger than total amount");
            percentage.value = 0;
            copydepositRequest.value.diposit_amount = 0
            
        } else {
            percentage.value = ((depositAmount / totalAmount) * 100).toFixed(2);
        } 
    }

}



function calculateAmount (){
    
    let totalAmount = props.invoiceData.due_amount;
    //let depositAmount = copydepositRequest.value.diposit_amount;
    let calculateDepositAmount = currentDepositAmount.value;
   

    if(percentage.value > 100){
        alert("Percentage should not bigger then 100");
        calculateDepositAmount = 0
        percentage.value = 0;
    }else{
        calculateDepositAmount = ((totalAmount * percentage.value) / 100).toFixed(2)
        //console.log(depositAmount)
        currentDepositAmount.value = calculateDepositAmount;
        
    }
}

const updateDeposit = async () => {
   
    let id = props.invoiceData.id;
    //let copyDeposit = copydepositRequest.value.diposit_amount;
    let copyDeposit = currentDepositAmount.value;

    props.depositRequest.diposit_amount = copyDeposit
    let date = copydepositRequest.value.due_date;
    props.depositRequest.due_date = date
   
    try{

        let response = await axios.post('http://127.0.0.1:8000/api/invoice/deposit/update/'+id,{
            'diposit_amount' : props.depositRequest.diposit_amount,
            'due_date' : props.depositRequest.due_date
        })
        success();
               
        
    }catch(err){
        console.log(err)
        toast.error("Error found", {
            autoClose: 1000, // Duration in milliseconds
        });
    }
    
}


onMounted(()=>{
    calculatePercentage();
    calculateAmount()
})


</script>