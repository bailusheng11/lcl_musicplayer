<template>
	<view class="container" :style="{'height':navBarHeight + 'px',
									 'padding-top':mTop + 'px'}">
		<view class="left" @click="goBack()">
			<uni-icons type="back" color="white" size="18"></uni-icons>
			<slot name="left"></slot>
		</view>
		
		<view class="center">
			<slot name="center"></slot>
		</view>
		<view class="right">
			
		</view>
	</view>
</template>

<script>
	export default {
		name:"nav-bar",
		data() {
			return {
				navBarHeight: 44
			};
		},
		props:{
			mTop:{
				type:Number,
				default(){
					return 20
				}
			}
		},
		methods:{
			goBack(){
				uni.navigateBack()
				console.log('goBack')
			}
			
		}
	}
</script>

<style lang="scss">
.container{
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	color: #fff;
	// background-color: rgba(0,0,0,.9);
	background-color: rgba(0,0,0,.1);
	z-index: 999;
	.left{
		display: flex;
		justify-content: center;
		align-items: center;
		// background-color: green;
		width: 120rpx;
		height: 88rpx;
	}
	.center{
		display: flex;
		flex: 1;
		justify-content: center;
		// background-color: red;
		align-items: center;
		height: 88rpx;
		font-size: 14px;
		.cCenter{
			margin:0 10rpx;
			// color: #000;
		}
	}
	.right{
		// background-color: blue;
		width: 120rpx;
		height: 88rpx;
	}
}
</style>
