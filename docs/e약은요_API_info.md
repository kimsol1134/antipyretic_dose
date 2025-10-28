
참고 url : https://www.data.go.kr/data/15075057/openapi.do

서비스정보

참고문서	(복구중)_IROS_239_의약품개요정보(e약은요) 서비스_v1.0.docx
데이터포맷	JSON+XML
End Point	https://apis.data.go.kr/1471000/DrbEasyDrugInfoService
API 환경 또는 API 호출 조건에 따라 인증키가 적용되는 방식이 다를 수 있습니다.
포털에서 제공되는 Encoding/Decoding 된 인증키를 적용하면서 구동되는 키를 사용하시기 바랍니다.
* 향후 포털에서 더 명확한 정보를 제공하기 위해 노력하겠습니다.
일반 인증키
(Encoding)	
rFe1ivbjepgpnw9ju5YNhyLSXDSRrVk1NZ1yMQ51o2Lt8SBd2McziDv2zonvOsxTXrKYdEunfQR%2FGvOAQHIaUw%3D%3D
일반 인증키
(Decoding)	
rFe1ivbjepgpnw9ju5YNhyLSXDSRrVk1NZ1yMQ51o2Lt8SBd2McziDv2zonvOsxTXrKYdEunfQR/GvOAQHIaUw==




요청변수(Request Parameter)

항목명(국문)	항목명(영문)	항목크기	항목구분	샘플데이터	항목설명
인증키	ServiceKey	100	필수	인증키(url encode)	공공데이터포털에서 받은 인증키
페이지 번호	pageNo	5	옵션	1	페이지번호
한 페이지 결과 수	numOfRows	3	옵션	3	한 페이지 결과 수
업체명	entpName	4000	옵션		업체명
제품명	itemName	4000	옵션		제품명
품목기준코드	itemSeq	4000	옵션		품목기준코드
문항1(효능)	efcyQesitm	4000000000	옵션		이 약의 효능은 무엇입니까?
문항2(사용법)	useMethodQesitm	4000000000	옵션		이 약은 어떻게 사용합니까?
문항3(주의사항경고)	atpnWarnQesitm	4000000000	옵션		이 약을 사용하기 전에 반드시 알아야 할 내용은 무엇입니까?
문항4(주의사항)	atpnQesitm	4000000000	옵션		이 약의 사용상 주의사항은 무엇입니까?
문항5(상호작용)	intrcQesitm	4000000000	옵션		이 약을 사용하는 동안 주의해야 할 약 또는 음식은 무엇입니까?
문항6(부작용)	seQesitm	4000000000	옵션		이 약은 어떤 이상반응이 나타날 수 있습니까?
문항7(보관법)	depositMethodQesitm	4000000000	옵션		이 약은 어떻게 보관해야 합니까?
공개일자	openDe	8	옵션		공개일자
수정일자	updateDe	8	옵션		수정일자
데이터 포맷	type	4	옵션	xml	응답데이터 형식(xml/json) Default:xml
출력결과(Response Element)

항목명(국문)	항목명(영문)	항목크기	항목구분	샘플데이터	항목설명
결과코드	resultCode	4	필수	00	결과코드
결과메시지	resultMsg	50	필수	NORMAL SERVICE	결과메시지
한 페이지 결과 수	numOfRows	3	옵션	3	한 페이지 결과 수
페이지 번호	pageNo	5	옵션	1	페이지번호
전체 결과 수	totalCount	7	옵션	1	전체 결과 수
업체명	entpName	4000	옵션		업체명
제품명	itemName	4000	옵션		제품명
품목기준코드	itemSeq	4000	옵션		품목기준코드
문항1(효능)	efcyQesitm	4000000000	옵션		이 약의 효능은 무엇입니까?
문항2(사용법)	useMethodQesitm	4000000000	옵션		이 약은 어떻게 사용합니까?
문항3(주의사항경고)	atpnWarnQesitm	4000000000	옵션		이 약을 사용하기 전에 반드시 알아야 할 내용은 무엇입니까?
문항4(주의사항)	atpnQesitm	4000000000	옵션		이 약의 사용상 주의사항은 무엇입니까?
문항5(상호작용)	intrcQesitm	4000000000	옵션		이 약을 사용하는 동안 주의해야 할 약 또는 음식은 무엇입니까?
문항6(부작용)	seQesitm	4000000000	옵션		이 약은 어떤 이상반응이 나타날 수 있습니까?
문항7(보관법)	depositMethodQesitm	4000000000	옵션		이 약은 어떻게 보관해야 합니까?
공개일자	openDe	8	옵션		공개일자
수정일자	updateDe	8	옵션		수정일자
낱알이미지	itemImage	3000	옵션		낱알이미지




/* NodeJs 12 샘플 코드 */


var request = require('request');

var url = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=서비스키'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('3'); /* */
queryParams += '&' + encodeURIComponent('entpName') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('itemName') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('itemSeq') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('efcyQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('useMethodQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('atpnWarnQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('atpnQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('intrcQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('seQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('depositMethodQesitm') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('openDe') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('updateDe') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('xml'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
});