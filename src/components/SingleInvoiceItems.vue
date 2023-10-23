<script setup>
const props = defineProps({
	invoiceItem: Object
})
</script>

<template>
    <div class="row">
	<div class="col-12">
		<div class="table-responsive">
			<table class="table table-invoice">
				<thead>
					<tr class="table table-invoice">
						<th class="text-start">Item</th>
						<th class="text-center d-none d-md-table-cell" width="15%">Quantity
						</th>
						<th class="text-end d-none d-md-table-cell" width="15%">Price</th>

						<th class="text-end item-last">Amount</th>
					</tr>
				</thead>
				<tbody>
					
						<tr v-for="item in invoiceItem">
							<td>
								<span class="text-inverse">{{item.service_title}}</span>
								<div></div>
								<div class="d-block d-md-none mt-1">
									{{item.price}} X {{ item.quantity }}
									
								</div>
							</td>
							<td class="text-center d-none d-md-table-cell">{{ item.quantity }}</td>
							<td class="text-end d-none d-md-table-cell">
								{{ item.price }}
							</td>

							<td class="text-end"> {{ item.total_price }}</td>
						</tr>
					
				</tbody>
			</table>
		</div>
	</div>
</div>
</template>