const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString){
	// console.log(lyricString)
	const lyric = lyricString.split("\n")
	let plyricInfos = []
	for(const lineString of lyric){
		const timeResult = timeRegExp.exec(lineString)
		
		if(!timeResult) continue
		const minute = timeResult[1]*60*1000
		const second = timeResult[2]*1000
		const millsecondTime = timeResult[3]
		const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
		
		const time = minute + second + millsecond
		
		const text = lineString.replace(timeResult[0],"")
		
		plyricInfos.push({time,text})
		// plyricInfos.push({time})
		
		// console.log({time,text})
		// console.log(plyricInfos)
	}
	
	return plyricInfos
	// return lyric
}
