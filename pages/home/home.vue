<template>
	<view class="content">
		<mysearch bg-color="#fff"></mysearch>
		<!-- 轮播图 -->
		<swiper  :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key=index>
				<navigator class="swiper-item" :url="item.url" >
					<image :src="item.imageUrl" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 新歌速递  @click="gotoCartlist(item)"-->
		<view class="newSongs">
			<view class="newSongs-title">
					<text>新歌速递</text>
					<button size="mini" @click="changeNewSongs">更多<uni-icons type="loop"></uni-icons></button>
			</view>
			<view class="newSongs-list" v-for="(item,index) in sixNewSongs" :key=index>
				<view class="newSongs-item" @click="gotoNewPlayPage({item,index})">
					<image class="newSongs-img" :src="item.album.picUrl" mode="heightFix"></image>
					<view class="newSongs-placeholder">
						<text class="newSongs-name">{{item.name}}</text>
						<text class="gang">-</text>
						<text class="newSongs-artists">{{item.artists[0].name}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 歌单 -->
		<!-- 热门歌单 -->
		<my-cartlist :any-cartlist="hotcartlist"
					 :cart-list-title="'热门歌单'"></my-cartlist>
		<!-- 高质量歌单 -->
		<my-cartlist :any-cartlist="highqualityCartlist"
					 :cart-list-title="'高质量歌单'"></my-cartlist>
		<!-- 需要登录 -->
		<!-- <hotTopics :hot-topics=""></hotTopics> -->
		
		aaa
		
		<!-- 底部播放栏 -->
		<view class="play-bar-placeholder" v-if="currentSong[0].al.picUrl"></view>
		<view class="play-bar"  @click="gotoPlayPage" v-if="currentSong[0].al.picUrl">
		  <view class="left" >
		      <image class="album album-anim"
					 :src="currentSong[0].al.picUrl"
		             ></image>
		      <view class="name">{{currentSong[0].name}}.{{currentSong[0].ar[0].name}}</view>
		  </view>
		  <view class="right">
		  <!-- .stop不会发生事件冒泡 -->
		    <image class="icon play" :src="getPlayStatus" @click.stop="changeStatus"></image>
		    <image class="icon playlist" 
					@click.stop="songslist"
					src="../../static/music/list.png"></image>
		  </view>
		</view>
		<all-song-list class="" :songs-list="playListSongs"	v-show="isShowSongsList"></all-song-list>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from "vuex"
	export default {
		computed:{
			...mapState('m_player', ['currentSong','isPlaying',
						'playListSongs','playListIndex','playModeIndex','isShowSongsList']),
			getPlayStatus(){return this.playStatus = this.isPlaying?'../../static/music/pause.png':'../../static/music/resume.png'},
			sixNewSongs(){return this.newSongs.slice(this.newSongsArea,this.newSongsArea+6)}
		},
		data() {
			return {
				swiperList:[],
				hotcartlist:[],
				// id:1420295820
				highqualityCartlist:[],
				newSongs:[],
				newSongsArea:0
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNewSongs()
			// this.getPlaylist()
			this.gethotcartlist()
			// this.getSongDetail({id:this.currentSong[0].id})
			this.getHighqualityCartlist()
		},
		methods: {
			...mapActions('m_player',['getSongDetail','changeMusicSongs']),
			...mapMutations('m_player',['changePlayStatus','changeCurrentTime',
			'changeCurrentLyricIndex','changePlayModeIndex','changeIsShowSongsList','changePlayListSongs','changePlayListIndex']),
			// 网络请求
			async getSwiperList(){
				await uni.$http.get('/banner').then(res => {
					// console.log(res)
					this.swiperList = res.data.banners
				})
			},
			// 新歌速递
			async getNewSongs(){
				await uni.$http.get('/top/song?type=0').then(({data:res}) => {
					// console.log(res)
					this.newSongs = res.data
					// console.log(1)/top/playlist?limit=10&order=new  cat="华语"
				})
			},
			async gethotcartlist(){
				await uni.$http.get('/top/playlist?limit=10').then(({data:res}) => {
					// console.log(res)
					this.hotcartlist = res.playlists
				})
			},
			async getHighqualityCartlist(){
				await uni.$http.get('/top/playlist/highquality').then(({data:res}) => {
					// console.log(res)
					this.highqualityCartlist = res.playlists
				})
			},
			// 点击事件
			changeStatus(){
				// console.log(1)
				this.changePlayStatus(!this.isPlaying)
			},
			songslist(){
				// console.log(1)
				this.changeIsShowSongsList()
			},
			changeNewSongs(){
				const num = Math.floor(Math.random()*(this.newSongs.length - 6))
				// console.log(num)
				this.newSongsArea = num
			},
			
			// 页面跳转
			gotoNewPlayPage({item,index}){
				console.log(item)
				console.log(index)
				this.changePlayListSongs(this.sixNewSongs)
				this.changePlayListIndex(index)
				// uni.navigateTo({
				// 	url:'../../subpkg/play_page/play_page?id=' + item.id
				// })
				this.getSongDetail({id:item.id})
			},
			gotoPlayPage(){
				// console.log(this.currentSong[0].id)
				// this.changePlayListIndex(index)
				uni.navigateTo({
					url:'../../subpkg/play_page/play_page?id=' + this.currentSong[0].id
				})
				// 问题点------------------------------------为什么点进去进度条就不动了
				// this.getSongDetail({id:this.currentSong[0].id})
			}
		}
	}
</script>

<style lang="scss">
page{
	// margin: 0 10rpx;
	box-sizing: border-box;
}
	
swiper{
	height: 330rpx;
	.swiper-item,
	image{
		width: 100%;
		height: 100%;
	}
}
.newSongs{
	margin: 20rpx;
	.newSongs-title{
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
	.newSongs-list{
		.newSongs-item{
			width: 100%;
			height: 100rpx;
			// border: 1px solid #e00;
			box-sizing: border-box;
			display: flex;
			padding: 10rpx 0;
			// justify-content: space-between;
			align-items: center;
			.newSongs-img{
				height: 100%;
				border-radius: 5px;
			}
			.newSongs-placeholder{
				display: flex;
				justify-content: space-between;
				align-items: center;
				// border: 1px solid #000000;
				margin-left: 20rpx;
				box-sizing: border-box;
				.newSongs-name{
					font-size: 16px;
				}
				.gang{
					margin: 10rpx;
					font-size: 10px;
					color: gray;
				}
				.newSongs-artists{
					font-size: 10px;
					color: gray;
				}
			}
		}
		
	}	
}
.play-bar-placeholder{
	height: 45px;
	width: 100%;
}
.play-bar{
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	height: 88rpx;
	width: 100%;
	
	box-shadow: 0 -1px 5px rgba(0,0,0,0.5);
	.left{
		display: flex;
		align-items: center;
		.album{
			width: 44px;
			height: 44px;
			border-radius: 50%;
		}
		.name{
			font-size: 14px;
		}
	}
	.right{
		display: flex;
		align-items: center;
		.icon{
			width: 30px;
			height: 30px;
		}
		.play{
			width: 25px;
			height: 25px;
			margin-right: 10rpx;
		}
	}
}
@keyframes albumAnimation{
  from {
    transform: rotate(0deg);
  }

  to{
    transform: rotate(360deg);
  }
}

.album-anim{
  animation: albumAnimation 16s linear infinite;
}
</style>






