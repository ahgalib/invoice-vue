<script setup>
import { useRoute } from 'vue-router';
import MainSection from '../components/SingleInvoiceMainSection.vue';
import SideBar from '../components/SideBar.vue'
import {onMounted, ref, provide, watch, reactive,defineEmits} from 'vue'
import axios from 'axios'
 
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const route = useRoute();
let id = route.params.uid



let singleData = ref({});
let invoiceData = ref({});
let bussinessData = ref({});
let userData = ref({});
let invoiceItem = ref([]);
// let transaction = ref([]);
//let depositRequest = ref({});
let fetchData = ref(false);


let singleTransaction = ref();

const storeDueAmount = ref()

let state = reactive({
    tranData : [],
    depositData : {},
})



const passDueAmounttoSidebar = (dueAmount) => {
    storeDueAmount.value = dueAmount;
    
}

const deleteTransaction = async (id) => {

    state.tranData = state.tranData.filter((transaction) => transaction.id !== id)
   

    let deleteData = await axios.post('http://127.0.0.1:8000/api/delete-transaction',{
        'id' : id,
        'invoiceId' : invoiceData.value.id
    })
   

    if(deleteData){
        toast.success("Transaction Deleted successfully", {
        autoClose: 3000,
        });

        fetchDepositInfo()
       
    }

}

    const fetchData2 = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/transactions-list/' + id);
        state.tranData = response.data.data;
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      //invoiceInfo()
      const singelInvoice3 = await axios.get('http://127.0.0.1:8000/api/invoice/'+id);
        singleData.value = singelInvoice3.data;
        invoiceData.value = singleData.value.invoice;
      console.log('invoice call after paid model is submit from  parent here', invoiceData.value)
      
    };

    const fetchDepositInfo = async () => {
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/invoice/deposit/show/' + id);
            state.depositData = response.data.data;
        }catch (error) {
            console.error('Error fetching data:', error);
      }
      
    }

const invoiceInfo = async() => {
    try{
        

        const singelInvoice = await axios.get('http://127.0.0.1:8000/api/invoice/'+id);
        singleData.value = singelInvoice.data;
        fetchData.value = true

        invoiceData.value = singleData.value.invoice;
        bussinessData.value =  singleData.value.business_setting;
        userData.value = singleData.value.invoice.user;
        invoiceItem.value = singleData.value.invoice.invoice_items;
        //transaction.value = singleData.value.transactions;
        
            
    }
    catch (error) {
    console.error('Error fetching data:', error)
  }
}



watch(()=>{
    fetchData2()
    fetchDepositInfo()
    invoiceInfo()

})


onMounted( async () => {
    fetchData2()
    invoiceInfo()
})


</script>

<template>
    <div class="invoice-wrapper">
        <div class="wrapper-main ">
            <div class="row gy-4">
                <div class="col-12">
                
                </div>
                <div class="col-lg-8">
                    <div class="print invoice p-3 p-sm-4 card" v-if="fetchData">

                        <MainSection :bussinessData="bussinessData" :userData="userData" :invoiceData = "invoiceData" :invoiceItem="invoiceItem" :depositRequest="state.depositData" :transaction="state.tranData" @get-due-amount="passDueAmounttoSidebar" />
                    </div>
                </div>
                
                    <SideBar v-if="fetchData" :invoiceData = "invoiceData" :depositRequest="state.depositData" :transaction="state.tranData"  @passInvoiceTransactionDeleteId="deleteTransaction" @paidModalSubmit="fetchData2" :storeDueAmount="storeDueAmount" @depositModalSubmit="fetchDepositInfo"/>
                
            </div>
        </div>
    </div>
</template>