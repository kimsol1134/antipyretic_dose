## Next.js에서 쿠팡 배너가 왼쪽 아래에 생성되는 문제 해결 방법

Next.js에서 쿠팡 파트너스 배너가 의도하지 않은 위치(왼쪽 아래)에 나타나는 문제는 CSS 포지셔닝과 스크립트 삽입 방식에 관련된 일반적인 이슈입니다. 유사한 사례들과 해결 방법을 정리했습니다.

### 주요 원인

**CSS Position 속성 미지정 문제**

쿠팡 파트너스 스크립트가 생성하는 iframe이나 div 요소가 `position: fixed` 또는 `position: absolute` 속성을 가지고 있을 때, `top`, `left`, `right`, `bottom` 값이 명시되지 않으면 브라우저가 기본 위치를 임의로 지정합니다[1]. Firefox와 IE는 요소의 static 위치를 유지하지만, Safari 등 일부 브라우저는 왼쪽으로 배치하는 경우가 있습니다[1].

**Next.js의 스크립트 처리 방식**

Next.js의 `<Script>` 컴포넌트는 기본적으로 스크립트를 `<head>` 또는 `<body>` 태그로 이동시킵니다[2]. 쿠팡 배너처럼 특정 위치에 렌더링되어야 하는 스크립트의 경우, 원하는 위치에 배치되지 않을 수 있습니다[2].

**래퍼 요소 포지셔닝 누락**

배너를 감싸는 부모 요소에 `position: relative` 속성이 없으면, `absolute` 포지션을 가진 자식 요소가 페이지 전체(`<html>` 태그)를 기준으로 배치됩니다[3].

### 해결 방법

**1. 래퍼 div에 명시적 포지셔닝 추가**

쿠팡 배너를 감싸는 부모 컨테이너에 명시적인 위치 속성을 지정합니다:

```jsx
<div style={{ 
  position: 'relative',
  width: '100%',
  textAlign: 'center' // 중앙 정렬을 원하는 경우
}}>
  {/* 쿠팡 배너 스크립트 */}
</div>
```

**2. dangerouslySetInnerHTML 사용**

Next.js에서 특정 위치에 스크립트를 삽입하려면 `dangerouslySetInnerHTML`을 활용합니다[2]:

```jsx
<div 
  id="coupang-banner"
  style={{
    position: 'relative',
    margin: '0 auto',
    width: '100%'
  }}
  dangerouslySetInnerHTML={{ 
    __html: `<script src="https://ads-partners.coupang.com/g.js"></script>
             <script>
               new PartnersCoupang.G({
                 "id": YOUR_ID,
                 "template": "carousel",
                 "trackingCode": "YOUR_CODE",
                 "width": "100%",
                 "height": "150"
               });
             </script>` 
  }} 
/>
```

**3. CSS로 배너 위치 강제 조정**

생성된 iframe의 위치를 CSS로 직접 제어합니다[4][5]:

```css
/* global.css 또는 모듈 CSS */
iframe[id^="coupang"] {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  margin: 0 auto;
  display: block;
}
```

또는 특정 클래스를 추가하여:

```jsx
<div className="coupang-banner-wrapper">
  {/* 쿠팡 배너 코드 */}
</div>
```

```css
.coupang-banner-wrapper {
  position: relative;
  width: 100%;
  max-width: 680px; /* 원하는 최대 너비 */
  margin: 0 auto;
}

.coupang-banner-wrapper iframe {
  position: relative !important;
  left: 0 !important;
  transform: none !important;
}
```

**4. 배너 스크립트 수정**

쿠팡 파트너스 스크립트의 `width` 값을 조정합니다[5][6]:

```javascript
new PartnersCoupang.G({
  "id": YOUR_ID,
  "template": "carousel",
  "trackingCode": "YOUR_CODE",
  "width": "100%",  // 고정 픽셀 대신 100%로 설정
  "height": "150"
});
```

**5. useEffect로 동적 조정**

클라이언트 사이드에서 배너 위치를 동적으로 조정합니다:

```jsx
'use client';

import { useEffect } from 'react';

export default function CoupangBanner() {
  useEffect(() => {
    const adjustBannerPosition = () => {
      const iframes = document.querySelectorAll('iframe[id*="coupang"]');
      iframes.forEach(iframe => {
        iframe.style.position = 'relative';
        iframe.style.left = 'auto';
        iframe.style.margin = '0 auto';
        iframe.style.display = 'block';
      });
    };

    // 스크립트 로드 후 위치 조정
    const timer = setTimeout(adjustBannerPosition, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {/* 쿠팡 배너 스크립트 */}
    </div>
  );
}
```

### 유사 사례

**티스토리 블로그에서의 동일 문제**

티스토리 사용자들도 쿠팡 배너가 사이드바나 원하는 위치에 제대로 배치되지 않는 문제를 경험했습니다[4][5][6]. 해결책으로 배너 소스 코드에서 `width` 값을 픽셀 단위에서 `100%`로 변경하거나[5], `<p align="center">` 태그로 감싸는 방법을 사용했습니다[6].

**React/Next.js의 iframe 포지셔닝 이슈**

Next.js Image 컴포넌트와 유사하게, iframe도 래퍼 div로 감싸져 포지셔닝 문제가 발생합니다[7]. 해결책은 iframe을 div로 감싸고 해당 div에 CSS 클래스를 적용하는 것입니다[7][8].

**개발 환경에서 iframe이 화면을 덮는 문제**

React 개발 환경에서 `process.env`를 잘못 사용하면 최대 z-index를 가진 iframe이 주입되어 전체 화면을 덮는 버그가 발생합니다[9]. 이는 쿠팡 배너와는 다른 이슈이지만, iframe 위치 제어의 중요성을 보여줍니다[9].

### 권장 사항

1. **래퍼 요소 사용**: 항상 배너를 `position: relative`를 가진 div로 감쌉니다
2. **너비 100% 설정**: 반응형을 위해 고정 픽셀 대신 백분율 사용합니다[5]
3. **중앙 정렬**: `margin: 0 auto`와 `text-align: center` 조합으로 중앙 배치합니다[10]
4. **테스트**: 다양한 브라우저와 화면 크기에서 배너 위치를 확인합니다

이러한 방법들을 조합하여 Next.js 프로젝트에서 쿠팡 배너가 의도한 위치에 정확히 표시되도록 할 수 있습니다.

출처
[1] css - position:fixed when left/top/right/bottom aren't specified https://stackoverflow.com/questions/8712047/positionfixed-when-left-top-right-bottom-arent-specified-desired-results-in
[2] Place third-party scripts inside a <div> · vercel next.js https://github.com/vercel/next.js/discussions/35428
[3] CSS Position (static, relative, absolute, fixed) - 코딩마차 https://mingeesuh.tistory.com/entry/CSS-Position-static-relative-absolute-fixed
[4] 쿠팡 파트너스 다이나믹 배너 만들기 - 알뜰살뜰 - 티스토리 https://d-knowledge.tistory.com/42
[5] 초간단! 티스토리 블로그에 쿠팡파트너스 배너 삽입하기 https://commagun.tistory.com/entry/%EC%B4%88%EA%B0%84%EB%8B%A8-%ED%8B%B0%EC%8A%A4%ED%86%A0%EB%A6%AC-%EB%B8%94%EB%A1%9C%EA%B7%B8%EC%97%90-%EC%BF%A0%ED%8C%A1%ED%8C%8C%ED%8A%B8%EB%84%88%EC%8A%A4-%EB%B0%B0%EB%84%88-%EC%82%BD%EC%9E%85%ED%95%98%EA%B8%B0
[6] 쿠팡 파트너스 다이나믹 배너 제작 방법과 티스토리에 적용하기 https://nodigitalmad.tistory.com/entry/%EC%BF%A0%ED%8C%A1-%EB%8B%A4%EC%9D%B4%EB%82%98%EB%AF%B9-%EB%B0%B0%EB%84%88-%EC%A0%9C%EC%9E%91-%ED%8B%B0%EC%8A%A4%ED%86%A0%EB%A6%AC-%EB%B2%84%EC%A6%882
[7] Positioning Image in next js [duplicate] - css https://stackoverflow.com/questions/66891398/positioning-image-in-next-js
[8] html - iframe won't absolute position https://stackoverflow.com/questions/15332036/iframe-wont-absolute-position/15332203
[9] React injecting iframe with max z-index on reload after ... https://stackoverflow.com/questions/69051008/react-injecting-iframe-with-max-z-index-on-reload-after-changes-development
[10] 쿠팡 파트너스 광고 배너 블로그에 삽입/적용하기 - MOMENTO https://thanks-momento.tistory.com/85
[11] Frontend System Design Interview: A step-by-step Guide https://www.systemdesignhandbook.com/guides/frontend-system-design-interview/
[12] 쿠팡파트너스 수익화 가장 쉽게 다이나믹 배너 자동으로 넣는 ... https://adsensefarm.kr/coupang-partners-dynamic-banner-monetization/
[13] Staff Software Engineer - (Austin, TX) https://www.linkedin.com/jobs/view/staff-software-engineer-austin-tx-at-steadily-insurance-company-4209274554
[14] STEP 2. 뉴스 컨텐츠 [배너노출위치/관리/등록/수정] - 블로그 ... https://auto-income.tistory.com/3
[15] 블로그에 쿠팡 광고 배너넣기(+배너위치조절하는법) https://blog.naver.com/seayoung707/221743285394
[16] mean stack developer nodejs angular jobs https://www.shine.com/job-search/mean-stack-developer-nodejs-angular-jobs-349?nofound=true
[17] [쿠팡 파트너스] 네이버블로그 사이드 베너 넣는방법 https://blog.naver.com/akohong/222219094848
[18] [쿠팡]<무작정 따라하기> 티스토리에 쿠팡파트너스 '다이나믹 ... https://yeongk2813.tistory.com/23
[19] 쿠팡파트너스 다이나믹 배너 설치 - 티스토리에서 가장 적절한 ... https://monetizeknowledge.tistory.com/entry/%EC%BF%A0%ED%8C%A1%ED%8C%8C%ED%8A%B8%EB%84%88%EC%8A%A4-%EB%8B%A4%EC%9D%B4%EB%82%98%EB%AF%B9-%EB%B0%B0%EB%84%88-%EC%84%A4%EC%B9%98-%ED%8B%B0%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%97%90%EC%84%9C-%EA%B0%80%EC%9E%A5-%EC%A0%81%EC%A0%88%ED%95%9C-%EC%9C%84%EC%B9%98%EC%99%80-%EC%82%AC%EC%9D%B4%EC%A6%88%EB%8A%94
[20] 쿠팡 파트너스 광고 배너 블로그 삽입하는 방법 & SEO 최적화 ... https://worldwide8888.tistory.com/2
[21] 쿠팡파트너스 광고 삼총사(링크, 배너, 검색 위젯)를 적용하는 ... https://simplyyy.tistory.com/140
[22] Next.js Styling - Footer component for some reason is not ... https://stackoverflow.com/questions/61788180/next-js-styling-footer-component-for-some-reason-is-not-at-the-bottom-of-the-s
[23] iFrames not filling or positioning in parent react component https://github.com/YIZHUANG/react-multi-carousel/issues/156
[24] Absolute, Relative, Fixed Positioning: How Do They Differ? https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/
[25] Next.js Tutorial #5 - Creating a Layout Component https://www.youtube.com/watch?v=DGn25s42NvQ
[26] Absolute Positioning like an iframe - javascript https://stackoverflow.com/questions/7754982/absolute-positioning-like-an-iframe
[27] Build X's Bottom Nav with Next.js 13 and Tailwind CSS https://www.youtube.com/watch?v=LeINM07aJ8E
[28] React + ChakraUI + iframe - positioning a custom popover ... https://coderanch.com/t/777143/languages/React-ChakraUI-iframe-positioning-custom
[29] How To Dynamically Set IFrame Height Without Content ... https://scientyficworld.org/how-to-dynamically-set-iframe-height/
[30] devIndicators - next.config.js https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators
[31] react 저장 시 iframe 강제 재생성 문제 https://www.inflearn.com/community/questions/404668/react-%EC%A0%80%EC%9E%A5-%EC%8B%9C-iframe-%EA%B0%95%EC%A0%9C-%EC%9E%AC%EC%83%9D%EC%84%B1-%EB%AC%B8%EC%A0%9C
[32] How do I get the (x,y) position of an HTML element? https://sentry.io/answers/how-do-i-get-the-position-x-y-of-an-html-element/
[33] Next.js 13 기본 골격 https://velog.io/@brgndy/Next.js-13-%EA%B8%B0%EB%B3%B8-%EA%B3%A8%EA%B2%A9
[34] Mastering the `<iframe>` Tag in React with TypeScript https://dev.to/serifcolakel/mastering-the-tag-in-react-with-typescript-a-comprehensive-guide-27m6
[35] Responsive Video Embedding: Embed Video Iframe Size ... https://cloudinary.com/guides/video-effects/responsive-video-embedding-embed-video-iframe-size-relative-to-screen-size
[36] Styling Next.js with Styled JSX https://nextjs.org/blog/styling-next-with-styled-jsx
[37] Best practices for React iframes https://blog.logrocket.com/best-practices-react-iframes/
[38] overscroll-behavior - CSS - MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
[39] Layout fill in nextjs 10.0.1 doesn't respect any height, width ... https://github.com/vercel/next.js/discussions/18739
[40] Load a third-party script in different routes in next js https://stackoverflow.com/questions/78648442/load-a-third-party-script-in-different-routes-in-next-js
[41] 애드센스가 나오지 않을 때 자동으로 쿠팡 파트너스 배너를 표시 ... https://bits.elantory.com/%EC%95%A0%EB%93%9C%EC%84%BC%EC%8A%A4%EA%B0%80-%EB%82%98%EC%98%A4%EC%A7%80-%EC%95%8A%EC%9D%84-%EB%95%8C-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EC%BF%A0%ED%8C%A1-%ED%8C%8C%ED%8A%B8%EB%84%88%EC%8A%A4/
[42] CSS의 fixed position으로 메뉴바 상단 고정 https://www.daleseo.com/css-position-fixed-navigation/
[43] NextJS Core Web Vitals - fix third party scripts https://www.corewebvitals.io/pagespeed/nextjs-fix-third-pary-scripts
[44] [CSS] position 정리 - OpenDev - 티스토리 https://opendeveloper.tistory.com/entry/CSS-position-%EC%A0%95%EB%A6%AC
[45] Optimizing third-party script loading in Next.js | Blog https://developer.chrome.com/blog/script-component
[46] 쿠팡파트너스 배너 수정 방법 / 배너 HTML 편집하기 ... https://blog.naver.com/n_job_life/222927457095
[47] [CSS] position(relative, absolute, fixed)에 대한 간단 정리 https://habitual-history.tistory.com/195
[48] Guides: Third Party Libraries https://nextjs.org/docs/app/guides/third-party-libraries
[49] [CSS]영역과 위치 잡기 - position편 https://kangdanne.tistory.com/97
[50] Issues with third-party scripts : r/nextjs https://www.reddit.com/r/nextjs/comments/1b7deec/issues_with_thirdparty_scripts/
[51] How to load and optimize scripts https://nextjs.org/docs/app/guides/scripts
