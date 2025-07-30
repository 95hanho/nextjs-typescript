import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "./Nav";
import AppProvider from "providers/AppProvider";
import Head from "next/head";
import "@css/style.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	themeColor: "#ffffff", // 브라우저 테마 색상 (모바일 브라우저 탭 색상 등)
	colorScheme: "light", // 사용자의 다크모드/라이트모드에 따라 컬러 테마 설정
};

// 사이트맵에 대하여
// robots.txt vs meta name="robots" 차이
export const metadata: Metadata = {
	title: "Next.js 기본 세팅", // 브라우저 탭 제목 및 og:title, twitter:title 등에 반영됨
	description: "Next.js 세팅", // 검색엔진 및 소셜미디어 공유 시 요약 설명
	applicationName: "Next.js 세팅", // 웹앱 이름 (예: 안드로이드 홈화면 앱 추가시 이름)
	generator: "Next.js", // 페이지 생성 툴 정보
	keywords: ["React", "Next.js", "default", "세팅", "힌호성"], // 검색엔진이 참고할 수 있는 키워드들
	referrer: "origin-when-cross-origin", // 외부 링크 클릭 시 리퍼러 정보 보내줄지 말지 설정
	/*
		내 페이지에서 다른 페이지로 갈 때 어디서 왔는지 그쪽 서버나 브라우저에 알려주는 방식
		"no-referrer" : 아무 referrer 정보도 보내지 않음(보안이 중요할 때 사용)
		"no-referrer-when-downgrade" : 기본값, HTTPS → HTTP로 이동할 때는 referrer 안 보냄. 그 외 보냄.
		"origin" : 도메인만 보냄
		"origin-when-cross-origin" : 같은 사이트면 전체 URL referrer, 다른 사이트면 도메인만 보냄
		"same-origin" : 같은 도메인일 때만 referrer 보냄. 외부 사이트 이동 시 referrer 없음
		"strict-origin" : HTTPS → HTTP일 때 referrer 제거, 같은 프로토콜이면 도메인만 보냄
		"strict-origin-when-cross-origin" : 가장 보안 수준 높음. 같은 도메인이면 full URL, 외부엔 도메인만, HTTPS → HTTP면 referrer 제거
		"unsafe-url" : 항상 full URL referrer 보냄. 보안 취약, 권장하지 않음
		※ 보안 중시 서비스 (결제, 인증 페이지 등): no-referrer, same-origin, strict-origin-when-cross-origin
		※ 유입 경로 분석 필요하지만, 보안도 고려 : origin-when-cross-origin ← 가장 일반적이며 권장됨

	*/
	creator: "한호성포트폴리오", // 사이트 제작자
	publisher: "한호성", // 사이트 게시자
	// 전화번호, 이메일 등의 자동 포맷팅 방지 설정(자동전화걸기나 링크로 인식하는거 해제)
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	// iOS 홈화면 추가 시 동작 정의
	appleWebApp: {
		title: "Next.js 세팅", // (예 : IOS제품 홈화면 앱 추가시 이름)
		capable: true, // 모바일에서 전체화면으로 보이게 할 지 여부(위 아래 주소창과 인터넷 메뉴들이 보암)
		statusBarStyle: "default", // 상태 표시줄 배경 색상 설정
	},
	// Open Graph (페이스북, 카카오 등 공유시 사용됨)
	openGraph: {
		// title: "Next.js 세팅", // 설정안하면 기본title 따라감(fallback:대체).
		// description: "Next.js 세팅", // 설정안하면 기본description 따라감(fallback:대체).
		url: "https://test", // og:url
		siteName: "엑스퍼트컨설팅 2025 HR FAIR", // og:site_name
		images: [
			{
				url: "https://test.jpg", // og:image
				width: 800,
				height: 600,
				alt: "Next.js 세팅", // 이미지 대체 텍스트
			},
		],
		locale: "ko_KR", // 언어 및 지역
		type: "website", // 컨텐츠 타입 (웹사이트/기사/비디오 등)
	},
	twitter: {
		card: "summary", // 트위터 카드 타입 (summary, summary_large_image 등)
		// title: "Next.js 세팅", // 설정안하면 기본title 따라감(fallback:대체).
		// description: "Next.js 세팅", // 설정안하면 기본description 따라감(fallback:대체).
		images: ["https://test.jpg"], // twitter:image
		creator: "@yourhandle", // 작성자 트위터 핸들 (필요시)
	},
	// 검색엔진 크롤러의 접근 정책
	/*
		- 크롤링(Crawling) = 페이지 방문하고 읽기, 페이지를 방문해서 HTML등의 내용을 읽어오는 행위
		a 태그를 따라가거나, sitemap.xml에 등록된 페이지를 순회함.
		- 색인(Indexing) = 검색 DB에 저장. 크롤링한 데이터를 기반으로 페이지를 검색 결과에 노출될 수 있도록 등록하는 작업
		구글/네이버의 "색인(index)" 데이터베이스에 저장하는 과정
		※ 검색엔진이 초기 크롤링하려면 노출 지점이 있어야함.
		1. 다른 웹페이지의 링크를 통해 발견
		2. 검색엔진(구글, 네이버)에 사이트맵이나 URL 제출
		* 사이트맵 제출 : robots.txt에 사이트맵 위치작성, Google Search Console 또는 네이버 서치어드바이저에 직접제출
		3. 도메인 노출(홍보, 공유) : SNS, 커뮤니티, 블로그 등 공공웹상에 노출된 링크를 통해
	*/
	robots: {
		index: true, // 페이지 인덱싱(색인) 허용 : false할 시 검색안됨
		follow: true, // 링크 따라가기 허용, 해당 페이지 링크(a태그 등)은 살펴보고 색인
		/*
			로그인 페이지, 결제 완료 페이지 등은  noindex, follow 형태로 잘  씀
		*/
		// 구글 검색 엔진 크롤러 (Googlebot) 에 특화된 지시사항
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false, // 이미지도 검색결과 노출 허용
			"max-image-preview": "large", // 이미지 미리보기 크게 허용
			"max-video-preview": -1, // 동영상 미리보기 제한 없음
			"max-snippet": -1, // 텍스트 스니펫 제한 없음(제한하면 구글검색 시 설명이 짧게나옴)
		},
	},
	// 파비콘 설정
	icons: {
		icon: "/favicon.ico", // 브라우저 탭 아이콘
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<Head>
				<meta name="google" content="notranslate" />
			</Head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AppProvider>
					<div className="wrap">
						<Nav />
						{children}
					</div>
				</AppProvider>
			</body>
		</html>
	);
}
