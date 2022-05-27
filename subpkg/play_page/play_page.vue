<template>
	<view class="currentpage">
		<image class="bg-pic" mode="aspectFill" :src="currentSong[0].al.picUrl"></image>
		<view class="bg-cover"></view>
		<nav-bar >
			<view class="nav-bar-center" slot="center">
				<view class="cLeft">歌曲</view>
				<view class="cCenter">|</view>
				<view class="cRight">歌词</view>
			</view>
		</nav-bar>
		<swiper class="content" :style="{height:currentHeight + 'px'}">
			<!-- 歌曲页 -->
			<swiper-item class="music" >
				<view class="cover">
					<image class="image" :src="currentSong[0].al.picUrl" mode="aspectFill"></image>
				</view>
				<!-- 歌曲信息 -->
				<view class="song-info">
					<view class="songName">{{currentSong[0].name}}</view>
					<view class="artistalbum">
						<view class="artist">{{currentSong[0].ar[0].name}}</view>
						<view class="album">{{currentSong[0].al.name}}</view>
					</view>
				</view>
				<!-- 歌词 -->
				<view class="currentLyric">{{lyric[currentLyricIndex].text}}</view>
				<!-- 进度条 -->
				<view class="progress">
					<slider class="slider"
							:value="autoValue" 
							@change="slideChange" 
							@changing="slideChanging"
							block-size="12"/>
					<view class="time">
					    <view class="current">{{showCurrentTime}}</view>
					    <view class="duration">{{showDurationTime}}</view>
					</view>
				</view>
				<!-- 控制区 -->
				<view class="operation">
				    <image class="btn btn-mode"
						   @click="changeMode"
						   :src="getPlayMode" ></image>
				    <image class="btn btn-prev"
						   @click="preSong"
						   src="/static/player/play_prev.png" ></image>
				    <image @click="changeStatus" class="btn btn-pause" :src="getPlayStatus" ></image>
				    <image class="btn btn-next"
						   @click="nextSong"
						   src="/static/player/play_next.png" ></image>
				    <image class="btn btn-music" 
						   @click="songslist"
						   src="/static/player/play_music.png"></image>
				</view> 
				
			</swiper-item>
			<!-- 歌词页 -->
			<swiper-item >
				<scroll-view scroll-y="true" class="lyric-list" scroll-with-animation :scroll-top="currentLyricIndex*35">
					<block   v-for="(item,index) in lyric">
						<view class="perLyric "
						:class="[index === currentLyricIndex ? 'active' : ''] "
							  :style="{'padding-top':(index === 0 ? currentHeight/2-80  : 0) + 'px',
									   'padding-bottom':(index === lyric.length - 1 ? currentHeight/2-80 : 0) + 'px'}"
								@click="itemLyric(index)"
						>
							  {{item.text}}
						</view>
					</block>
				</scroll-view>
			</swiper-item>
		</swiper>
		<all-song-list class="" :songs-list="playListSongs"	v-show="isShowSongsList"></all-song-list>
	</view>
</template>
<script>
	import { mapState, mapMutations, mapActions } from "vuex"
	import {formatTime} from '../../utils/fromat.js'
	import {audioContext} from "../../store/store.js"
	
	const playMode = ['order', 'repeat', 'random']
	export default {
		computed:{
			...mapState('m_player', ['name','currentSong','isPlaying',
						'durationTime','currentTime','lyric','currentLyricIndex',
						'playListSongs','playListIndex','playModeIndex','isShowSongsList']),
			getPlayStatus(){return this.playStatus = this.isPlaying?'/static/player/play_pause.png':'/static/player/play_resume.png'},
			getPlayMode(){return "/static/player/play_" + playMode[this.playModeIndex] + ".png" },
			showDurationTime(){return formatTime(this.durationTime)},
			showCurrentTime(){return formatTime(this.currentTime)},
			autoValue(){return this.currentTime/this.durationTime*100}
		},
		data() {
			return {
				id:'',
				songUrl:'',
				currentHeight:0,
				playStatus:'',
				
				
			}
		},
		onLoad(o) {
			this.id = o.id
			this.getSongUrl()
			// this.getSongDetail({id:this.id})
			this.getScreenHeight()
		},
		methods: {
			...mapActions('m_player',['getSongDetail','changeMusicSongs']),
			...mapMutations('m_player',['changePlayStatus','changeCurrentTime',
			'changeCurrentLyricIndex','changePlayModeIndex','changeIsShowSongsList']),
			// 网络请求 
			getSongUrl(){
				uni.$http.get('/song/url?id=' + this.id).then(({data:res}) => {
					// console.log(res.data)
					this.songUrl = res.data
				})
			},
			
			// 获取屏高
			getScreenHeight(){
					uni.getSystemInfo({
						success:(res) =>{
							// console.log(res)
							// console.log(this)
							const statusBarHeight = res.statusBarHeight
							const screenHeight = res.screenHeight
							this.currentHeight = screenHeight - statusBarHeight - 44
						}	
				})
			},
			
			// 点击事件
			// 开始/暂停
			changeStatus(){
				// console.log(1)
				this.changePlayStatus(!this.isPlaying)
			},
			// 循环/随机
			changeMode(){
				this.changePlayModeIndex()
			},
			// 拖动进度条
			slideChange(e){
				// console.log('e.detail.value:' + e.detail.value)
				const value = e.detail.value
				audioContext.pause()
				const currentTime = value*this.durationTime/100
				audioContext.seek(currentTime/1000)
				// console.log('slideChange')
			},
			// 正在拖动
			slideChanging(e){
				// console.log(e.detail.value)
				audioContext.pause()
				// console.log('slideChanging')
				const value = e.detail.value
				this.changeCurrentTime(value)
			},
			// 点击歌词快进
			itemLyric(index){
				console.log(index)
				this.changeCurrentLyricIndex(index)
				audioContext.seek(this.lyric[this.currentLyricIndex].time/1000)
			},
			// 上一首
			preSong(){
				this.changeMusicSongs()
			},
			// 下一首
			nextSong(){
				this.changeMusicSongs(false)
			},
			// 歌曲列表
			songslist(){
				console.log(1)
				this.changeIsShowSongsList()
			}
		}
	}
</script>

<style lang="scss">
	.currentpage{
		position: relative;
	}
.nav-bar-center{
	display: flex;
	justify-content: center;
	align-items: center;
	.cCenter{
		margin:0 10rpx;
	}
}
.bg-pic,.bg-cover{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
}
.bg-cover{
	background-color: rgba(0,0,0,.5);
	backdrop-filter:blur(50px);
}
.content{
	margin-top: 124rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 30rpx 60rpx;
	// background-color: #efefef;
	.music{
		display: flex;
		flex-direction: column;
		color: #fff;
		.cover{
			display: flex;
			align-items: center;
			flex: 4;
			.image{
				width: 100%;
				// height: 100%;
				border-radius: 12rpx;
			}
		}
		.song-info{
			display: flex;
			flex: 2;
			flex-direction: column;
			.songName{
				margin: 20rpx 0;
				font-size: 24px;
			}
			.artistalbum{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 90rpx;
				.artist{
					font-size: 14px;
				}
				.album{
					font-size: 13px;
				}
			}
		}
		.currentLyric{
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			color: #0f0;
			margin: 20rpx 0;
		}	
		.progress{
			// display: flex;
			// align-items: center;
			flex: 1;
			// background-color: green;
			.slider{
				// width: 100%;
			}
			.time{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
		.operation{
			display: flex;
			flex: 2;
			justify-content: space-around;
			align-items: center;
			// background-color: #e00;
			.btn{
				width: 60rpx;
				height: 60rpx;
			}
			.btn-pause{
				width: 80rpx;
				height: 80rpx;
			}
		}
	}  
	.lyric-list {
	  height: 100%;
	  box-sizing: border-box;
	  overflow: hidden;
		.perLyric{
			  height: 35px;
			  line-height: 35px;
			  font-size: 28rpx;
			  text-align: center;
			  color: #989898;
			  white-space: nowrap;
			  overflow: hidden;
			  text-overflow: ellipsis;
			  // background-color: #007AFF;
			  // border: 1px solid #e00;
		}
	
	  .active{
		  color: #139c2c;
		  font-size: 36rpx;
	  }
	}
	
}

</style>
