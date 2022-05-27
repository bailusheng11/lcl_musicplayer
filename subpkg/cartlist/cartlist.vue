<template>
	<!-- 歌单内部 -->
	<view>
		<nav-bar><view class="nav-bar-left" slot="left">歌单</view></nav-bar>
		<view class="cartlist-top" >
			<view class="cover" >
				<image class="bg-img" :class="[isFixed?'bg-img-fixed':'']" :src="cartlistDetail.playlist.coverImgUrl" mode="center"></image>
				<view class="bg-cover" :class="[isFixed?'bg-img-fixed':'']"></view>
			</view>
			<view class="cartlist-box">
				<image :src="cartlistDetail.playlist.coverImgUrl" mode=""></image>
				<text>{{cartlistDetail.playlist.name}}</text>
			</view>
			<view class="">
				<view class=""></view>
				<view class=""></view>
				<view class=""></view>
			</view>
		</view>
		<view class="songs-list" :class="[isFixed?'songs-list-padding':'']">
			<view class="songs-title" :class="[isFixed?'is-fixed':'']">
					<text>播放全部({{playListSongs.length}})</text>
			</view>
			<view class="song-item" v-for="(item,index) in cartlistAll.songs" :key=index
				  @click="gotoPlayPage({item,index})">
				<view class="left">
					<view class="index">{{index+1}}.</view>
					<view class="goods-name">
						<view class="">{{item.name}}</view>
						<view class="artists">
							<view class="artist" v-for="(item2, index2) in item.ar" :key="index2">
								<view class="">{{item2.name}}</view>
							</view>
							<view class="gang">-</view>
							<view class="album">{{item.al.name}}</view>
						</view>
					</view>
				</view>
				<view class="icons">
					<uni-icons type="arrowright" size="16"></uni-icons>
					<uni-icons type="plusempty" size="16"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from "vuex"
	export default {
		computed:{
			...mapState('m_player', ['name','currentSong','isPlaying',
						'durationTime','currentTime','lyric','currentLyricIndex',
						'playListSongs','playListIndex','playModeIndex','isShowSongsList']),
		},
		data() {
			return {
				id:'',
				cartlistDetail:[],
				cartlistAll:[],
				currentHeight:0,
				isFixed:false
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getCartlistDetail()
			this.getCartlistAll()
			this.getScreenHeight()
		},
		onPageScroll(e) {
			console.log(e.scrollTop)
			this.isFixed = e.scrollTop > 135? true : false
		},
		methods: {
			...mapActions('m_player',['getSongDetail']),
			...mapMutations('m_player',['changePlayListSongs','changePlayListIndex']),
			// 网络请求
			getCartlistDetail(){
				uni.$http.get('/playlist/detail?id=' + this.id).then(({data:res}) => {
					// console.log(res)
					this.cartlistDetail = res
				})
			},
			getCartlistAll(){
				uni.$http.get('/playlist/track/all?id=' + this.id).then(({data:res}) => {
					console.log(res)
					// console.log(1)
					this.cartlistAll = res
					this.changePlayListSongs(this.cartlistAll.songs)
				})
			},
			// 页面跳转
			gotoPlayPage({item,index}){
				console.log(index)
				this.changePlayListIndex(index)
				uni.navigateTo({
					url:'../play_page/play_page?id=' + item.id
				})
				this.getSongDetail({id:item.id})
			},
			
			getScreenHeight(){
					uni.getSystemInfo({
						success:(res) =>{
							console.log(res)
							// console.log(this)
							const statusBarHeight = res.statusBarHeight
							const screenHeight = res.screenHeight
							this.currentHeight =   statusBarHeight + 44
						}	
				})
			},
			
		}
	}
</script>

<style lang="scss">
.is-fixed{
	position: fixed;
	top: 128rpx;
	left: 0;
	padding: 0 40rpx;
	width: 100%;
	background-color: #fff;
	padding-top: 40rpx;
	padding-bottom: 20rpx;
}
.songs-list-padding{
	margin-top: 48rpx;
}
.cartlist-top .cover .bg-img-fixed{
	position: fixed ;
	top:  calc( -100% + 130rpx) ;
	left: 0 ;
	z-index: 99 ;
}
.nav-bar-left{
	display: flex;
	align-items: center;
	justify-content: center;
}
.cartlist-top{
	padding-top: 60px;
	position: relative;
	font-size: 12px;
	overflow: hidden;
		
		.bg-img,.bg-cover{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		.bg-cover{
			background-color: rgba(0,0,0,.5);
			backdrop-filter:blur(10px);
		}
	.cartlist-box{
		display:flex;
		margin: 40rpx;
		image{
			width: 200rpx;
			height: 200rpx;
			border-radius: 15rpx;
		}
		text{
			margin-left: 20rpx;
		}
	}
}

.songs-list{
	position: relative;
	padding: 40rpx;
	.songs-title{
		height: 60rpx;
		line-height: 60rpx;
		// border: 1px solid #e00000;
	}
	.song-item{
		display: flex;
		justify-content: space-between;
		margin: 20rpx 0;
		border-top: 1px solid #efefef;
		.left{
			display: flex;
			align-items: center;
			.index{
				margin-right: 20rpx;
				color: gray;
			}
			.goods-name{
				display: flex;
				flex-direction: column;
				// 单行文本
				white-space: nowrap;
				overflow: hidden;
				// 文字溢出用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
				font-size: 14px;
				.artists{
					display: flex;
					align-items: center;
					color: gray;
					font-size: 10px;
					margin-top: 5px;
					.artist{
						margin-left: 5px;
					}
					.gang{
						margin: 10rpx;
					}
				}
			}
		}
	}
	
}
	
</style>
