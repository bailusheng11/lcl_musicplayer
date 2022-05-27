<template>
	<view>
		<view class="allcartlist">
			<scroll-view class="scroll-view_H" scroll-x="true"  scroll-left="0">
				<view class="scroll-view-item_H">推荐</view>
				<view class="scroll-view-item_H">官方</view>
				<view class="scroll-view-item_H">共享歌单</view>
				<view class="scroll-view-item_H">精品</view>
				<view v-for="(item,index) in hotTags" :key=index class="scroll-view-item_H uni-bg-red">
					<view >{{item.name}}</view>
				</view>		
			</scroll-view>
			<uni-icons type="bars"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hotTags:[]
			};
		},
		onLoad() {
			this.getPlaylist()
		},
		methods:{
			async getPlaylist(){
				await uni.$http.get('/playlist/hot').then(({data:res}) => {
					console.log(res)
					console.log(2)
					this.hotTags = res.tags
				})
			},

		}
	}
</script>

<style lang="scss">
	.allcartlist{
		position: relative;
		.scroll-view_H{
			white-space: nowrap;
			width: 100%;
			.scroll-view-item_H{
				display: inline-block;
				height: 40rpx;
				padding: 0 20rpx;
				line-height: 40rpx;
				text-align: center;
				font-size: 24rpx;
			}
		}
		.uniui-bars{
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 0;
			box-shadow: 1px 1px 1px ;
			background-color: #fff;
		}
	}
	

</style>