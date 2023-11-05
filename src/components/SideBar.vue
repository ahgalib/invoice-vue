<script setup>
import PaidModal from './modal/PaidModal.vue';
import DepositModal from './modal/DepositModal.vue';
import EditDepositModal from './modal/EditDepositModal.vue';
import TransactionModal from './modal/TransactionModal.vue';
import axios from 'axios'

import {ref, onMounted, computed, defineEmits,watch} from 'vue'
const props = defineProps({
    invoiceData : Object,
    depositRequest:Object,
    transaction : Array,
    storeDueAmount: String,
    

})


//let checkDepoAmount = ref(props.depositRequest)

const emit = defineEmits(['pass-payment','updatedDueAmount','passInvoiceTransactionDeleteId','paidModalSubmit','checkMainAmountShow'])


let editModal = ref(false)

let paidAmount = ref(props.invoiceData.paid_amount)


let invoiceDueAmount = ref(props.invoiceData.due_amount);
const showModal = () => {
    editModal.value = true
    
}


const depositRequestCheckWithAmount = () => {
    emit('depositModalSubmit')
}



let id = props.invoiceData.id;
let transactionDataShow = ref({})
const openTransactionModal = async () => {
    let data = await axios.get('http://127.0.0.1:8000/api/transactions-list/'+id)
    //emit('add-payment',data)
    
    transactionDataShow.value = data.data.data
    
}


let fetchData = ref(false);
onMounted(() => {
    fetchData.value = true
})

const passTransactionDeleteId = (deleteId) => {
    emit('passInvoiceTransactionDeleteId',deleteId)
   
}

const getUpdatedAmount = (updatedAmount) => {
    paidAmount.value = updatedAmount;
}

const submitConf = () => {
    emit('paidModalSubmit')
}
const shouldShowEditModal = computed(() => {
    return fetchData.value && editModal.value
})

</script>

<template>
    <div class="col-lg-4">
    <div class="invoice-right">
        <div class="manage-payment card p-3 p-sm-4">

            
            <table class="mb-2 text-black">
                <tbody>
                    <tr>
                        <td class="text-dark">Total</td>
                        <td class="text-end">{{invoiceData.currency_symbol}} {{invoiceData.total}}</td>
                    </tr>
                    <tr>
                        <td class="text-dark">Paid</td>
                        <td class="text-end totalPaid">{{invoiceData.currency_symbol}} {{paidAmount}}</td>
                    </tr>
                </tbody>
            </table>

        
            <table class="mb-2">
                <tbody class="font-bold">
                    <tr>
                        <div id="editDipositButton" v-if="depositRequest !== null && depositRequest.diposit_amount > 0.00 && invoiceData.total > paidAmount">
                           
                            <td class="text-dark dipositAmount py-2">
                                <div>
                                    Deposit Request (
                                    <span><span></span><span> {{ parseFloat(depositRequest.diposit_amount) < parseFloat(storeDueAmount) ? parseFloat(depositRequest.diposit_amount).toFixed(2) : parseFloat(storeDueAmount).toFixed(2) }}</span><span></span></span>
                                    )
                                </div>
                            </td>
                            <td class="text-end dipositAmount px-3"> <a href="javascript:void(0)" role="button"
                                    class="text-warning editDepositButton" 
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit-deposit-request" @click="showModal">Edit</a>
                            </td>                            
                        </div>

                        <div id="addDipositButton" v-else>
                            <td class="request_deposit py-2">
                                <!-- <a href="javascript:void(0)" id="ajaxDisabled" role="button"
                                class="text-warning createDepositModalShow" :disabled = "invoiceData.total < paidAmount"  data-bs-toggle="modal"
                                data-bs-target="#deposit-request">Request a deposit</a>                              -->

                                <a href="javascript:void(0)" id="ajaxDisabled" role="button"
                                    class="text-warning createDepositModalShow"
                                    :disabled="invoiceData.total <= paidAmount"
                                    v-bind:data-bs-toggle="invoiceData.total > paidAmount ? 'modal' : null"
                                    v-bind:data-bs-target="invoiceData.total > paidAmount ? '#deposit-request' : null">Request a deposit</a>
                            </td>
                        </div>
                    </tr>

                    <tr>
                        <td class="text-dark">
                            <a href="javascript:void(0)" role="button" class="text-warning text-decoration-underline" @click="openTransactionModal" data-bs-toggle="modal"
                                data-bs-target="#view-transaction">
                                View Transactions
                            </a>
                        </td>
                    </tr>


                    <tr v-if="invoiceData.total > paidAmount">
                        <td class="text-dark py-2">
                            <a href="#" role="button"
                                class="text-warning text-decoration-underline" data-bs-toggle="modal"
                                data-bs-target="#paid-modal">Mark Paid</a>
                        </td>
                    </tr>

                </tbody>
            </table>

        </div>
            

        <!-- <div class="activity card p-3 p-sm-4 mt-4">
            <h5 class="mb-3">Activity</h5>
            {{-- activity-list  --
            <div class="activity-list">

                {{-- activity-list-item  --
                @foreach($invoice_history as $history)
                <div class="activity-list-item mb-3">

                    @php
                        //get activity type
                        $activity = $history->activity;
                        $convert_activity_to_string = Str::of($activity);
                        $words = $convert_activity_to_string->explode(' ');
                        $activity_type = $words->last();
                    @endphp

                    @if($activity_type == "paid")
                        <img width="45" src="{{ asset('assets/img/icons/2.png') " alt="icon">

                    @elseif($activity_type == "created")
                        <img width="45" src="{{ asset('assets/img/icons/1.png') " alt="icon">

                    @elseif($activity_type == "sent")
                        <img width="45" src="{{ asset('assets/img/icons/5.png') " alt="icon">
                    @endif
                    <div class="activity-list-dis">
                        <p class="mb-0 fs-sm">history->activity</p>
                        <small class="fs-xsm">{{Carbon::parse($history->dateTime)->format('d M Y \a\t h:i A')</small>
                    </div>
                </div>
                @endforeach

            </div>
        </div> -->
        <DepositModal :invoiceData="invoiceData" :invoiceDueAmount="invoiceDueAmount" @create-deposit="depositRequestCheckWithAmount" :storeDueAmount="storeDueAmount"/>

        <EditDepositModal :invoiceData="invoiceData" :depositRequest="depositRequest" v-show="shouldShowEditModal" :invoiceDueAmount="invoiceDueAmount" :storeDueAmount="storeDueAmount" @create-deposit="depositRequestCheckWithAmount"/>
        
        <TransactionModal :invoiceData="invoiceData" :transactionDataShow="transactionDataShow" :openTransactionModal = "openTransactionModal" @passDeleteId="passTransactionDeleteId" :transaction="transaction" @passUpdatedAmount="getUpdatedAmount"/>

        <PaidModal :invoiceData="invoiceData"  @paidFormSubmit="submitConf"/>
    </div>
</div>
</template>


<style scoped>
/* Style for modal */

</style>