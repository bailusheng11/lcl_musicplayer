<template>
	<view class="mysearch-container" :style="{'background-color': bgColor}" >
		<view class="mysearch-box"  :style="{'border-radius': radius + 'px'}" @click="mySearch">
			<uni-icons type="search"  size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"mysearch",
		data() {
			return {
				
			};
		},
		props:{
			bgColor:{
				type:String,
				default:'#c00000'
			},
			radius:{
				type:Number,
				default:18
			}
		},
		methods:{
			mySearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
.mysearch-container{
	height: 50px;
	display: flex;
	align-items: center;
	.mysearch-box{
		width: 100%;
		background-color: #efefef;
		height: 36px;
		margin: 0 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		.placeholder{
			font-size: 15px;
		}
	}
}
</style>
