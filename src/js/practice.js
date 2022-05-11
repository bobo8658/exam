$(function () {
	function getAcquisitionCountdown(endDateStr) {
		var endDate = new Date(endDateStr.split('.')[0].replace(/\-/g, '/'))
		var nowDate = new Date();
		var totalSeconds = parseInt((endDate - nowDate) / 1000);
		var day = totalSeconds / (60 * 60 * 24);
		var days = null;
		days = day.toString().split(".")[0];
		var modulo = totalSeconds % (60 * 60 * 24);
		var hours = Math.floor(modulo / (60 * 60));
		modulo = modulo % (60 * 60);
		var minutes = Math.floor(modulo / 60);
		var seconds = modulo % 60;
		if (days != "0" && days > 0) {
			return days + "天" + "后结束";
		} else if (days == 0 && hours != 0 && hours > 0) {
			return hours + "时" + "后结束";
		} else if (hours == 0 && minutes != 0 && minutes > 0) {
			return minutes + "分" + "后结束";
		} else if (minutes == 0 && seconds != 0 && seconds > 0) {
			return seconds + "秒" + "后结束";
		} else {
			return "已结束";
		}
	}
	function createDiv() {
		var div = document.createElement('div')
		if (data.length === 0) div.innerHTML += `<h2>暂无题库</h2>`
		else data.forEach((element, index) => {
			div.innerHTML += `<div data-id="${index}" class="practice" style="border: 1px solid #5b9bd1;border-radius: 5px;margin-bottom: 10px;padding: 0 20px 15px;cursor:pointer;max-width:500px">
										<h4 id="name">${element.practicename}</h4>
										<span id="class">${element.lessonname}</span>
										<sapn id="time" style="margin-left: 10vw;">${getAcquisitionCountdown(element.finishtime)}</sapn>
								</div>`
		});
		document.body.appendChild(div)
	}
	function getPractice() {
		return $.ajax({
			url: baseUrl + '/mobile/index.php?act=studentpracticeapi&op=getPractiseCourseList',
			type: 'POST',
			data: {
				key: localStorage.getItem('key')
			}
		}).then(res => {
			data = res.datas
			createDiv()
			$('.practice').click(function () {
				var load = document.createElement('div')
				load.innerHTML = `<div class="load">
									<div style="text-align:center;position:absolute;color:white;width:93px;height:93px;">
										<div style="animation: myloading1 2s linear infinite;" class="dot-container">
											<div class="dot"></div>
										</div>
										<div style="animation: myloading2 2s linear infinite;" class="dot-container">
											<div class="dot"></div>
										</div>
										<div style="animation: myloading3 2s linear infinite;" class="dot-container">
											<div class="dot"></div>
										</div>
										<div style="animation: myloading4 2s linear infinite;" class="dot-container">
											<div class="dot"></div>
										</div>
										<div style="animation: myloading5 2s linear infinite;" class="dot-container">
											<div class="dot"></div>
										</div>
										<div style="animation: myloading6 2s linear infinite;" class="dot-container">
											<div class="dot"></div>
										</div>
									</div>
								</div>`
				document.body.appendChild(load)
				console.log(23);
				var sub = data[$('.practice').index(this)]
				console.log(sub);
				var list = {}
				$.ajax({
					url: baseUrl + '/mobile/index.php?act=studentpracticeapi&op=getStudentPractiseQuestionList',
					type: 'POST',
					data: {
						key: localStorage.getItem('key'),
						courseid: sub.courseid,
						practiseid: sub.practiseid,
						studentpractiseid: sub.id,
						teacherid: sub.teacherid,
						pagecount: sub.questioncount,
						pageindex: 1,
						practisetype: 0,
						statenum: 0,
						id: '',
						studentpractisequestioncount: sub.questioncount
					}
				}).then(res => {
					list = res.datas.questionlist
					$.ajax({
						url: baseUrl + '/mobile/index.php?act=studentpracticeapi&op=getStudentPractiseQuestionList',
						type: 'POST',
						data: {
							key: localStorage.getItem('key'),
							courseid: sub.courseid,
							practiseid: sub.practiseid,
							studentpractiseid: sub.id,
							teacherid: sub.teacherid,
							pagecount: sub.questioncount,
							pageindex: 1,
							practisetype: 1,
							statenum: 0,
							id: '',
							studentpractisequestioncount: sub.questioncount
						}
					}).then(r => {
						list.push(...r.datas.questionlist)
						localStorage.setItem('list', JSON.stringify(list))
						location.href = './subject.html'
					})

				})
			})
		})
	}
	const baseUrl = 'http://127.0.0.1:9999'
	var data = ''
	getPractice()
})