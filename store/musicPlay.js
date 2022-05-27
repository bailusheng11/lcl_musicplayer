import {audioContext} from "./store.js"
import {parseLyric} from "../utils/parseLyric.js"

export default {
	namespaced: true,
	
	state : {
		name:'lcl',
		id:'',
		currentSong:{},
		durationTime:0,
		currentTime:0,
		lyric:{},
		currentLyricIndex:0,
		
		isPlaying:true,
		playMode:'',
		playListSongs:[],
		playListIndex:0,
		
		playModeIndex:0,
		
		isShowSongsList:false
	},
	actions : {
		getSongDetail(context,{id,isRefresh = false}){
			console.log(isRefresh)
			if(context.id == id && !isRefresh) {
				console.log('进来了')
			    context.commit('changePlayStatus', true)
			    return
			}
				console.log('没进来了')
			context.isPlaying = true
			context.lyric = []
			context.currentSong = {}
			context.durationTime = 0
			context.currentTime = 0
			context.currentLyricIndex = 0
			
			context.id = id
			uni.$http.get('/song/detail?ids='+id).then(res => {
				// console.log(res)
				context.commit('saveSongDetail',res.data.songs)
			})
			uni.$http.get('/lyric?id='+id).then(res => {
				// console.log(res.data.lrc)
				context.commit('saveLyric',res.data.lrc)
			})
			audioContext.autoplay = true
			audioContext.src =  `https://music.163.com/song/media/outer/url?id=${id}.mp3`
			
			context.commit('setupAudioContextListenerAction')
			// const currentTime = audioContext.currentTime
			// console.log(currentTime)
			// context.dispatch('log1')
		},
		// 控制栏
		changeMusicSongs(s,isPre = true){
			
			let index = s.state.playListIndex
			console.log(this)
			// console.log(s.playListIndex)
			switch(s.state.playModeIndex){
				case 0:
					index = isPre ? index - 1 : index + 1
					if(index === -1) index = s.state.playListSongs.length - 1
					if(index === s.state.playListSongs.length) index = 0
					break
				case 1:
					break
				case 2:
					index = Math.floor(Math.random()*s.state.playListSongs.length)
					break
			}
			console.log(index)
			const currentSong = s.state.playListSongs[index]
			console.log(currentSong)
			      if(!currentSong) {
			        currentSong = s.currentSong
			      }else{
			        s.commit('changeIndex',index)
			      }
			// getSongDetail({id:currentSong.id, isRefresh : true})
			s.dispatch('getSongDetail',{id:currentSong.id, isRefresh : true})
			// this.dispatch('m_player/log1')
			
		},
		log1(s){
			console.log(5)
		},
	},
	mutations:{
		setupAudioContextListenerAction(state){
			audioContext.onCanplay(() => {
			    audioContext.play()
			})
					  
			audioContext.onTimeUpdate(() => {
				// console.log('onTimeUpdate')
			    const currentTime = audioContext.currentTime*1000
								
			    state.currentTime = currentTime
			
				
				// 3.歌词
				if(!state.lyric.length) return
				let i = 0
				for(; i < state.lyric.length; i++){
				  const lyricInfo = state.lyric[i]
				  if(currentTime < lyricInfo.time){
				    break
				  }
				}
				// console.log(i)
				const currentIndex = i - 1
				if(currentIndex !== state.currentLyricIndex){
				  //   const currentLyricInfo = state.lyric[currentIndex]
				  //   state.currentLyricText = currentLyricInfo.text
				    state.currentLyricIndex = currentIndex
				}
			})
			audioContext.onPlay(() => {
			  state.isPlaying = true
			})
								
			audioContext.onPause(() => {
			  state.isPlaying = false
			})
		},
		// 保存歌曲数据
		saveSongDetail(state,data){
			state.currentSong = data
			state.durationTime = data[0].dt
		},
		// 保存歌词
		saveLyric(state,data){
			// console.log(data.lyric)
			const res =  parseLyric(data.lyric)
			// console.log(res)
			// console.log(parseLyric(data.lyric))
			// console.log(typeof(res))
			state.lyric = res
		},
		// 获取歌曲列表
		changePlayListSongs(s,playlist){
			s.playListSongs = playlist
		},
		// 获取当前歌曲索引
		changePlayListIndex(s,songIndex){
			console.log('songIndex:' + songIndex)
			s.playListIndex = songIndex
		},
		// 修改播放状态
		changePlayStatus(state,isPlaying = true){
			state.isPlaying = isPlaying
			state.isPlaying?audioContext.play():audioContext.pause()
		},
		// 修改当前时间
		changeCurrentTime(s,value){
			console.log('value:' + value)
			const currentTime = value*s.durationTime/100
			s.currentTime = currentTime
			console.log('currentTime:'+currentTime)
		},
		// 修改播放模式
		changePlayModeIndex(s){
			s.playModeIndex += 1
			if(s.playModeIndex === 3) s.playModeIndex = 0
		},
		// 当前歌词索引
		changeCurrentLyricIndex(s,value){
			s.currentLyricIndex = value
		},
		
		//
		changeIndex(s,index){
			s.playListIndex = index
		},
		changeIsShowSongsList(s){
			s.isShowSongsList = !s.isShowSongsList
		}
	}
}

