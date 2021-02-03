//创建变量保存索引
//1.<video元素> 控制栏
const media = document.querySelector('video');
const controls = document.querySelector('.controls');
//2.播放 暂停 快退 快进按钮
const play = document.querySelector('.play');
const stop = document.querySelector('.stop');
const rwd = document.querySelector('.rwd');
const fwd = document.querySelector('.fwd');
//3.进度条外面的<div> 数字计时器的<span> 内部<div>随着视频播放逐渐变宽
const timeWrapper = document.querySelector('.timer');
const timer = document.querySelector('.timer span');
const timerBar = document.querySelector('.timer div');

//视频中删除默认浏览器控件，并自定义控件可见
media.removeAttribute('controls');
controls.style.visibility = 'visible';

//实现播放和暂停按钮
play.addEventListener('click',playPauseMedia);
function playPauseMedia() {
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);

    if(media.paused){
        play.setAttribute('data-icon','u');
        media.play();
    }else {
        play.setAttribute('data-icon','P');
        media.pause();
    }
}
//视频暂停的方法
stop.addEventListener('click',stopMedia);
play.addEventListener('ended',stopMedia);//视频播放完毕时，触发运行函数
function stopMedia() {
    /*HTMLMEDIAELEMENT API没有stop()方法，等效的方法是先用pause()暂停视频，然后设置
    currentTime的值将立刻使视频跳到该位置，将图标设置为“播放”图标。
     */
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    clearInterval(intervalRwd);

    media.pause();
    media.currentTime = 0;
    play.setAttribute('data-icon','P');
}
//探索快进和快退
rwd.addEventListener('click',mediaBackward);
fwd.addEventListener('click',mediaForward);

let intervalFwd;
let intervalRwd;
function mediaBackward() {
    clearInterval(intervalFwd);
    //
    fwd.classList.remove('active');

    if(rwd.classList.contains('active')){
        rwd.classList.remove('active');
        clearInterval(intervalRwd);
        media.play();
    }else {
        rwd.classList.add('active');
        media.pause();
        intervalRwd = setInterval(windBackward,200);
    }
}
function mediaForward() {
    clearInterval(intervalRwd);
    rwd.classList.remove('active');

    if(fwd.classList.contains('active')){
        fwd.classList.remove('active');
        clearInterval(intervalFwd);
        media.play();
    }else {
        fwd.classList.add('active');
        media.pause();
        intervalFwd = setInterval(windForward,200);
    }
}
function windBackward() {
    //如果倒退三秒将使其视频的开始，会导致奇怪的行为，则通过stopMedia()停止视频的播放
    if(media.currentTime <= 3){
        rwd.classList.remove('active');
        clearInterval(intervalRwd);
        stopMedia();
    }else {
        media.currentTime -= 3;
    }
}
function windForward() {
        if(media.currentTime >= media.duration -3){
        fwd.classList.remove('active');
        clearInterval(intervalFwd);
        stopMedia();
    }else {
        media.currentTime += 3; //事实上使每个200ms快进一次
    }
}
//更新时间显示
media.addEventListener('timeupdate',setTime);
function setTime() {
    let minutes = Math.floor(media.currentTime /60);
    let seconds = Math.floor(media.currentTime-minutes*60);
    let  minuteValue;
    let secondValue;
    //统一时间显示的格式
    if(minutes < 10){
        minuteValue = '0' +minutes;
    }else {
        minuteValue = minutes;
    }
    if(seconds < 10){
        secondValue = '0' +seconds;
    }else {
        secondValue = seconds;
    }
    timer.textContent = minuteValue + ':' + secondValue;
    let barlength = timeWrapper.clientWidth *(media.currentTime/media.duration);
    timerBar.style.width = barlength +'px';
}