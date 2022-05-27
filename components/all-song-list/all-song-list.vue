<template>
	<view class="container">
		<view class="top" @click="close"></view>
		
		<view class="center">
			<view class="topSetter">
				<view class="placeholder">顺序播放({{playListSongs.length}}首)</view>
				<view class="icons">
					<uni-icons type="download" size="18" color="gray"></uni-icons>
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<uni-icons type="trash-filled" size="18" color="gray"></uni-icons>
				</view>
			</view>
			<scroll-view class="scroll-list" scroll-y="true" >
				<block v-for="(item, index) in songsList">
					<view class="song-item"
						  :class="[index === playListIndex ? 'active' : '']"
						  @click="getCurrentSongIndex({item,index})">
						<view class="">{{item.name}}</view>
						<uni-icons type="closeempty" size="16" color="gray"></uni-icons>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="bottom" @click="close">关闭</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from "vuex"
	export default {
		name:"allSongList",
		data() {
			return {
				
			};
		},
		props:{
			songsList:{
				type:Array,
				default(){
					return []
				}
			}
		},
		computed:{
			...mapState('m_player', ['playListSongs','playListIndex']),
			},
		methods:{
			...mapActions('m_player',['getSongDetail','changeMusicSongs']),
			...mapMutations('m_player',['changePlayStatus','changeCurrentTime',
			'changeCurrentLyricIndex','changePlayModeIndex','changeIsShowSongsList','changePlayListIndex']),
			close(){
				this.changeIsShowSongsList()
			},
			getCurrentSongIndex({item,index}){
				console.log(item)
				this.getSongDetail({id:item.id,isRefresh:true})
				this.changePlayListIndex(index)
			}
		}
	}
</script>

<style lang="scss">
.container{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position:fixed ;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	.top{
		width: 100%;
		height: 30%;
		// background-color: #e00;
		background-color: rgba(0,0,0,.1);
		z-index: 999;
	}
	.center{
		width: 100%;
		padding:0 20rpx;
		height: 65%;
		background-color: #273444;
		color: #fff;
		z-index: 999;
		box-sizing: border-box;
		.topSetter{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			.placeholder{
				
			}
			.icons{
				width: 200rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
		.scroll-list{
			width: 100%;
			height: calc(100% - 100rpx);
			.song-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88rpx;
				border-top:1px solid #3A3A3A;
			}
		}
	}
	.bottom{
		width: 100%;
		height: 5%;
		display: flex;
		justify-content: center;
		align-items: center;
		// margin: 10rpx;
		border: 3px solid gray;
		background-color: #273444;
		color: #000;
		box-sizing: border-box;
	}
}	
.active{
	color: #18BC37;
}
</style>
