const music = document.getElementById('music');
music.load();
music.oncanplaythrough = function() {
	music.play();
};

export default function() {
	return music.currentTime;
}
