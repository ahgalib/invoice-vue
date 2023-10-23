<script setup>
const props = defineProps({
  
  bussinessData: Object,

})
</script>

<template>
    <div class="invoice-body p-sm text-black">
	<!-- begin invoice-company -->
	<div class="row">
		<div class="col-sm-12 col-md-6 mb-3 mb-md-0">
			<img src="@/assets/ds-logo.png" class="business-logo" width="125" height="125">
			
			<strong> {{ bussinessData.business_name }}</strong>
		</div>
		<div class="col-sm-12 col-md-6 text-md-end">
			<h2 class="h5">Invoice</h2>
			<div class="text-inverse mb-2">
				<strong>{{ bussinessData.business_name }}</strong>
			</div>
			<address class="m-t-5 mb-5 text-sm">
				<div class="mb-2"> {{ bussinessData.address1 || null }}</div>
				<div class="mb-2">{{ bussinessData.address3 || null }}</div>
				<div class="mb-2">{{ bussinessData.address3 || null }}</div>
				<div class="mb-2"> {{ bussinessData.business_city || null }}</div>
				<div class="mb-2">{{ bussinessData.business_country || null }}</div>
			</address>
		</div>
	</div>
</div>
</template>