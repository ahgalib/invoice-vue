<script setup>
import {inject,computed, defineEmits, ref,watch} from 'vue'

const emit = defineEmits(['pass-updated-due-amount'])
const props = defineProps({
	invoiceData : Object,
	depositRequest:Object,
	updateDueAmount:String,
	transaction : Array,
})

const totalDueAmount = computed(() => { 
    return props.transaction.reduce((total, transaction) => {
        const paidAmount = parseFloat(transaction.paid_amount);

        if (!isNaN(paidAmount)) {
            // Parse total as float before performing arithmetic operations
            total = parseFloat(total);
            // Check if total is a valid number
            if (!isNaN(total)) {
                // Subtract paidAmount from total and round to 2 decimal places
                return (total - paidAmount).toFixed(2);
            }
            // If total is not a valid number, return 0
            return 0;
        }

        // If paidAmount is not a valid number, return total as is
        return total;
    }, props.invoiceData.total);

});

// Use a ref to store the latest due amount
 const dueAmount = ref(totalDueAmount.value);

// Emit initial dueAmount to child component
emit('pass-updated-due-amount', totalDueAmount.value);


 // Watch for changes in totalDueAmount and emit the updated value
 watch(totalDueAmount, (newDueAmount) => {
      if (newDueAmount !== dueAmount.value) {
        dueAmount.value = newDueAmount;
        emit('pass-updated-due-amount', newDueAmount);
      }
 });


</script>

<template>
    <div class="row">
	<div class="col-12">
		<div class="table-responsive">
			<table class="table table-borderless table-small table_append">
				<tbody>
					<tr>
						 <td class="d-none d-md-table-cell" ></td> 
						<td class="text-md-end" colspan="3">Subtotal</td>
						<td class="text-end" colspan="1">{{invoiceData.currency_symbol}}{{invoiceData.subtotal}}</td>
					</tr>

					
					<tr>
						 <td class="d-none d-md-table-cell" ></td> 
						<td class="text-md-end" colspan="3">Discount</td>
						<td class="text-end" colspan="1">{{invoiceData.currency_symbol}}{{invoiceData.discount}}</td>
					</tr>
					
					<tr>
						 <td class="d-none d-md-table-cell" ></td> 
						<td class="text-md-end" colspan="3">{{invoiceData.tax_title}}
							<p v-if="invoiceData.tax_type == 'inclusive'">included</p>
							
							{{invoiceData.tax_percentage}}</td>
						<td class="text-end" colspan="1">{{invoiceData.currency_symbol}}{{invoiceData.tax_amount}}</td>
					</tr>
				

					
					<tr v-if="invoiceData.second_tax_amount> 0">
						 <td class="d-none d-md-table-cell" ></td> 
						<td class="text-md-end" colspan="3">{{invoiceData.second_tax_title}}
							<p v-if="invoiceData.tax_type === 'inclusive'">included</p>
							
							{{invoiceData.second_tax_percentage}}</td>
						<td class="text-end" colspan="1">{{invoiceData.currency_symbol}}{{invoiceData.second_tax_amount}}</td>
					</tr>
					

					<tr>
						<td class="text-md-end" colspan="4"
							style="border-bottom: 1px solid #ddd;">
							Total:</td>
						<td class="text-end" colspan="3"
							style="border-bottom: 1px solid #ddd;">
							{{invoiceData.currency_symbol}}{{invoiceData.total}}</td>
					</tr>
					
					<tr v-for="transactions in transaction">
						<td class="text-md-end" colspan="4">Paid on {{transactions.paid_date}}</td>
						<td class="text-end " colspan="3"> {{invoiceData.currency_symbol}}  {{transactions.paid_amount}}</td>
					</tr>
					
					

					<tr>
						<td class="text-md-end" colspan="4"
							style="border-top: 1px solid #ddd;">
							Amount
							Due</td>
						<td class="text-end dueAmount" colspan="3" style="border-top: 1px solid #ddd;">
							{{invoiceData.currency_symbol}} {{ totalDueAmount }}
						</td>
					</tr>

				</tbody>
			</table>
		</div>
	</div>
</div>

<div class="invoice-price">
        <div class="row">
            <div class="col-12 text-end">
                <div
                    class="invoice-price-right d-inline-block border border-2 border-secondary rounded-1 px-2 fs-6">
                                     
                    <span class="fw-bold fs-4 text-warning mt-3 deposite_amount_show">
                         <!-- <span v-if="depositRequest !== null && depositRequest.diposit_amount > 0">
								Deposit Due | {{ depositRequest.due_date }} | {{ invoiceData.currency_symbol }}
									{{ depositRequest.diposit_amount < totalDueAmount ? depositRequest.diposit_amount : ''}}
						</span> -->

						<span v-if="depositRequest !== null && depositRequest.diposit_amount > 0 && totalDueAmount > 0">
								Deposit Due | {{ depositRequest.due_date }} | {{ invoiceData.currency_symbol }}
								{{ parseFloat(depositRequest.diposit_amount) < totalDueAmount ? parseFloat(depositRequest.diposit_amount).toFixed(2) : totalDueAmount }}
						</span>
						<span v-else>
							Invoice Due | {{ invoiceData.due_date }} | {{ invoiceData.currency_symbol }}{{ totalDueAmount }}
						</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>