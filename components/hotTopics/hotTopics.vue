<template>
	<view class="hot-topic">
		<view class="hot-title">热门话题</view>
		<view class="hot-keywords">
			<view class="kwywords-item" v-for="(item,index) in hotTopics" :key=index>
				<view class="kwyword">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'HotTopics',
		data() {
			return {
				
			};
		},
		props:{
			hotTopics:{
				type:Array,
				default(){
					return []
				}
			},
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">

</style>
