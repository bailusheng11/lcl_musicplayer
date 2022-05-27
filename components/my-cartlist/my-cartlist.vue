<template>
	<view class="sugPlaylist">
		<view class="sugg-title">
				<text>{{cartListTitle}}</text>
				<button size="mini" @click="gotoHotcartlist()">更多<uni-icons type="arrowright"></uni-icons></button>
		</view>
		<scroll-view class="sugg-box" scroll-x="true"   >
				<view class="sugg-list" v-for="(item,index) in anyCartlist" :key=index>
					<view class="sugg-item" @click="gotoCartlist(item)">
						<!-- <navigator :url=""> -->
							<image :src="item.coverImgUrl" mode="" aspectFit></image>
						<!-- </navigator> -->
						<text>{{item.name}}</text>
					</view>
				</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"my-cartlist",
		data() {
			return {
				
			};
		},
		props:{
			anyCartlist:{
				type:Array,
				default(){
					return []
				}
			},
			cartListTitle:{
				type:String,
				default(){
					return '推荐歌单'
				}
			}
		},
		methods:{
			// 页面跳转
			// 更多歌单
			gotoHotcartlist(){
				uni.navigateTo({
					url:'../../subpkg/hotcartlist/hotcartlist'
				})
			},
			// 歌单详情 `${id}`
			gotoCartlist(item){
				// console.log(item)
				const id = item.id 
				uni.navigateTo({
					url:'../../subpkg/cartlist/cartlist?id='+ id
				})
			},
		}
	}
</script>

<style lang="scss">
.sugPlaylist{
	position: relative;
	// border: 1px solid #ff55ff;
	.sugg-title{
		margin: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		// border: 1px solid #e00000;
		text{
			font-weight: bold;
		}
		button{
			margin: 0;
			padding: 0 5px;
			height: 50rpx;
			line-height: 50rpx;
		}
	}
	
	.sugg-box{
		white-space: nowrap;
		margin:0 20rpx;
		.sugg-list{
			display: inline-block;
			margin-right: 10rpx;
			.sugg-item{
				display: flex;
				flex-direction: column;
				width: 100px;
				font-size: 12px;
				// border: 1px solid #e00000;
				margin-right: 10rpx;
				image{
					width: 100px;
					height: 100px;
					border-radius: 10rpx;
				}
				text{
					white-space: pre-wrap;
					height: 34px;
					text-overflow: ellipsis;
					overflow: hidden;
				}
			}
		}
	}
}	
</style>
