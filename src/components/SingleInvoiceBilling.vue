<script setup>
const props = defineProps({
	userData:Object,
	invoiceData:Object
})
</script>

<template>
    <div class="invoice-header p-4 rounded-3">
	<div class="row text-black">
		<div class="invoice-to col-sm-12 col-md-6">
			<strong class="text-dark">BILL TO</strong>
			<div class="text-inverse mb-1">
				<small class="text-dark">{{ userData.first_name }} {{ userData.last_name }}</small>
			</div>
			<address class="m-t-5 m-b-5">
				
				<div>{{ invoiceData.note ?? null }}</div>
			</address>
		</div>


		<div class="invoice-date col-sm-12 col-md-6">
			<div class="row text-md-end">
				<div class="col-6 col-md">
					<strong>Invoice #</strong>
				</div>
				<div class="col-6 col-md invoice-detail-end">{{invoiceData.invoice_no}}</div>
			</div>

			<div class="row text-md-end">
				<div class="col-6 col-md">
					<strong>Date</strong>
				</div>
				<div class="col-6 col-md invoice-detail-end">{{invoiceData.issue_date}}</div>
			</div>
			<div class="row text-md-end">
				<div class="col-6 col-md">
					<strong>Due date</strong>
				</div>
				<div class="col-6 col-md invoice-detail-end">
					{{invoiceData.due_date}}
				</div>
			</div>
		</div>
	</div>
</div>
</template>