다이나믹 배너
개요
Coupang Partners 다이나믹 위젯의 태그는 HTML 코드 조각이며, 실제로는 스크립트 태그라서 모든 웹 기술과 함께 사용할 수 있습니다. WebView로 웹사이트 내 페이지 혹은 어플리케이션에 태그를 삽입할 수 있습니다. 본 가이드의 목적은 웹 페이지나 WebView에 태그를 어떻게 추가하는지 설명하는 것입니다.

태그 샘플
Coupang Partners 다이나믹 위젯의 태그는아래와 같습니다.

<script src="https://ads-partners.coupang.com/g.js"></script>
<script>
    new PartnersCoupang.G({
        id: 1
    });
</script>
다이나믹 배너 메뉴를 통해 https://partners.coupang.com 에서 태그를 추가할 수 있습니다.

Dynamic Widget Management

웹 페이지에서 활용
웹 페이지에 코드를 붙여넣기 전에 해당 페이지를 완전히 컨트롤할 수 있어야 합니다. 즉, 타겟 페이지의 HTML 소스 코드를 수정할 수 있어야 합니다. 단 네이버 블로그는 스크립트 태그를 지원하지 않습니다. 타겟 페이지에 지정된 광고 영역이 있는 경우 간편하게 태그 코드를 복사해서 입력하면 됩니다. 아니면 Container 요소로 해당 태그를 포장(예를 들어 위치/크기 등을 명시)할 수 있으나, 이는 선택 사항입니다. 페이지가 렌더링되면 쿠팡 파트너스 태그에서 광고 렌더링을 위한 iframe을 생성하며, iframe이 <script> 자체의 previous sibling으로 삽입됩니다. 웹 페이지의 소스 코드를 저장하고 최종 효과를 확인해주세요. 다이나믹 위젯은 반응형(Responsive)이라 모든 크기에 맞출 수 있습니다. (최소 80x80에서 최대 2,000x2,000) 최종 위젯의 모습은 아래와 같고 다양한 크기로 등록됩니다.

Parent Container의 크기는 위젯에 맞춰야 하며 위젯 인스턴스를 생성할 때는 아래에 보시는 것처럼 해당 위젯의 크기를 명시해야 합니다.

커스터마이징 가이드
다이나믹 배너에서 생성 태그는 다음과 같습니다.

<script src="https://ads-partners.coupang.com/g.js"></script>
<script>
    new PartnersCoupang.G({
        id: 1
    });
</script>
위와 같이 오직 id만 파라미터로 명시되어 있고,폭,높이, 경계선과 같은 기타 파라미터는 서버 사이드에서 가져오며, id를 통해 추출할 수 있습니다. 그러나 필요한 경우, 기타 파라미터를 오버라이드할 수 있으며, 오버라이드 가능한 파라미터는 다음과 같습니다.

width, 위젯의 가로 픽셀, 배율 값도 사용 가능
height, 위젯의 세로 픽셀
bordered, 위젯의 경계선 표시 여부, 해당 값은 true 또는 false로만 설정
subId, 이 파라미터는 네트워크 업체만 해당합니다. 대부분 사용자의 경우 이 값이 필요하지 않습니다
deviceId, 이 파라미터는 고객 관심 기반 배너를 이용 할 때 모바일 기기의 adid/idfa를 사용합니다.
isApp, 이 파라미터는 다이나믹 배너가 앱에서 구현되는지 여부를 표시합니다. 앱에서 구현되는 경우 true, 일반 웹 페이지인 경우 false로 설정
태그 예시

<script src="https://ads-partners.coupang.com/g.js"></script>
<script>
     new PartnersCoupang.G({
         id: 1,
         width: '100%',
         height: 120,
         bordered: false,
         subId: '12345678',
         deviceId: 'beaab7f6-4bd3-11ea-b4d9-1c36bbeced53',
         isApp: true
     });
</script>




<script src="https://ads-partners.coupang.com/g.js"></script>
<script>
    new PartnersCoupang.G({"id":936910,"trackingCode":"AF3034941","subId":null,"template":"carousel","width":"320","height":"100"});
</script>
