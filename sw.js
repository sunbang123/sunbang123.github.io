self.addEventListener('fetch', function(event) {
  // 브라우저가 '앱 설치' 버튼을 띄우기 위한 최소 요건입니다.
  // 나중에 오프라인 모드를 구현하고 싶다면 여기에 캐싱 로직을 넣으면 됩니다.
  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response('인터넷 연결이 필요합니다.');
    })
  );
});