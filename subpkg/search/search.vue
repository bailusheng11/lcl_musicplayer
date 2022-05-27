<template>
	<view class="search">
		<!-- 搜索框 -->
		<view class="nav-search-box">
			<uni-search-bar  
			:value="searchValue" 
			@input="input" 
			@click="getSerachList()" 
			:radius="100" />
		</view>
		<!-- 建议列表 -->
		<view class="sugg-list" v-if="searchList.length !== 0">
			<view class="sugg-item" v-for="(item, index) in searchList" :key="index"
					@click="gotoPlayPage(item)">
				<view class="goods-name">
					<view class="">{{item.name}}</view>
					<view class="artists">
						<view class="artist" v-for="(item2, index2) in item.artists" :key="index2">
							<view class="">{{item2.name}}</view>
						</view>
					</view>
				</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" 
							v-for="(item, index) in histories" 
							:key="index"
							@click="gotoHistory(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				timer:null,
				kw : '',
				searchValue:'',
				searchList:[],
				historyList:[],
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw' || []))
		},
		computed:{
			histories(){
				return [...this.historyList].reverse()
			}
		},
		methods:{
			input(e){
				// console.log(e) 210049
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e
					this.getSerachList()
				},500)
				
			},
			async getSerachList(){
				if(this.kw.length === 0){
					this.searchList = []
					return
				}
				const {data:res} = await uni.$http.get('/search',{keywords:this.kw})
					console.log(res)
				this.searchList = res.result.songs
				this.saveSearchHistory()
			},
			saveSearchHistory(){
				const set = new Set(this.historyList)
				
				set.delete(this.kw)
				
				set.add(this.kw)
				
				this.historyList = Array.from(set)
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
			},
			gotoPlayPage(item){
				uni.navigateTo({
					url:'../play_page/play_page?id=' + item.id
					
				})
			},
			gotoHistory(item){
				this.searchValue = item
			},
			clean(){
				uni.setStorageSync('kw','[]')
				this.historyList = []
			}
		}
	}
</script>

<style lang="scss">
	.nav-search-box{
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #e00000;
	}
	.sugg-list{
		padding: 0 5px;
		.sugg-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 15px;
			border-bottom: 1px solid #efefef;
			
			.goods-name{
				// 单行文本
				white-space: nowrap;
				overflow: hidden;
				// 文字溢出用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
				.artists{
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 10px;
					margin-top: 5px;
					.artist{
						margin-left: 5px;
					}
				}
			}
		}
	}
	.history-box{
		padding:0 5px;
		.history-title{
			display: flex;
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		.history-list{
			display: flex;
			flex-wrap: wrap;
			.uni-tag{
				margin-top: 5px;
				margin-right: 5px;
			}
			
		}
	}
</style>
