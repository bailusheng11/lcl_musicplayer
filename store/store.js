import Vue from "vue"
import Vuex from "vuex"

import modulePlayer from  '@/store/musicPlay.js'

Vue.use(Vuex)

const audioContext = uni.createInnerAudioContext()

const store = new Vuex.Store({
	modules:{
		"m_player":modulePlayer
	}
})

export default store

export {
	audioContext
}