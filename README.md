# 🚀 브레인 어드벤처 — Netlify 배포 가이드

## 파일 구조
```
brain-adventure/
├── index.html                  ← 앱 메인
├── netlify.toml                ← Netlify 설정
├── netlify/
│   └── functions/
│       └── grade.js            ← AI 채점 서버 함수
└── README.md
```

---

## 배포 순서 (5분이면 완료)

### 1단계 — GitHub에 올리기
1. https://github.com → 로그인 → **New repository**
2. 이름 입력 (예: `brain-adventure`) → **Create repository**
3. 이 폴더 전체를 끌어다 놓거나 업로드

### 2단계 — Netlify 연결
1. https://netlify.com → 로그인 (무료)
2. **Add new site** → **Import an existing project** → GitHub 연결
3. 저장소 선택 → **Deploy site** 클릭

### 3단계 — API 키 등록 (중요!)
1. Netlify 대시보드 → **Site configuration** → **Environment variables**
2. **Add a variable** 클릭
3. Key: `ANTHROPIC_API_KEY`
4. Value: Anthropic Console (https://console.anthropic.com) 에서 복사한 API 키 붙여넣기
5. **Save** → **Trigger deploy** → **Deploy site**

### 4단계 — 완료!
- Netlify가 제공하는 URL (예: `https://brain-adventure-abc123.netlify.app`) 을 iPad Safari에서 열면 바로 사용 가능

---

## iPad 홈 화면에 추가하기 (앱처럼 사용)
1. Safari에서 사이트 열기
2. 하단 공유 버튼(□↑) 탭
3. **홈 화면에 추가** 선택
4. 이제 앱 아이콘처럼 실행됩니다!

---

## 문제 발생 시
- 채점이 안 될 때: Netlify → Functions 탭에서 로그 확인
- API 키 오류: Console에서 키 권한 및 잔액 확인
