# 자동 동기화 연결하기

현재 사이트의 문제 풀이와 기기 내 임시 저장은 바로 사용할 수 있습니다. 휴대폰·컴퓨터 자동 동기화에는 아래 설정이 한 번 필요합니다.

## 1. Supabase 프로젝트 만들기

https://supabase.com/dashboard 에 로그인하고 새 프로젝트를 만듭니다. 사용 가능한 요금제와 한도는 계정에서 확인하세요.

## 2. 답안 저장 공간 만들기

Supabase의 SQL Editor에서 이 저장소의 `supabase/setup.sql` 내용을 실행합니다. 한 번만 실행하세요. 이 SQL은 본인 계정의 답안만 읽고 쓸 수 있도록 Row Level Security를 설정합니다. PDF를 저장하는 공간은 만들지 않습니다.

## 3. 이메일 로그인 주소 설정

Authentication → URL Configuration에서 다음을 설정합니다.

- Site URL: `https://rani0380.github.io/jungccom/`
- Redirect URLs: `https://rani0380.github.io/jungccom/`

Authentication에서 Email 로그인을 켭니다. 개인 계정으로 먼저 가입한 뒤 필요하면 신규 가입 허용을 끌 수 있습니다. 메일 제한 또는 전송 오류가 있으면 Supabase 대시보드의 메일 설정과 허용 사용자를 확인하세요.

## 4. 공개 연결 정보 등록

프로젝트 Connect 또는 API 설정에서 Project URL과 Publishable key를 확인합니다. 기존 프로젝트는 anon key도 사용할 수 있습니다.

GitHub 저장소 Settings → Secrets and variables → Actions → Variables에 두 변수를 추가합니다.

- `VITE_SUPABASE_URL`: Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Publishable key 또는 anon key

이 두 값은 브라우저에서 사용하는 공개 연결 값입니다. **service_role, secret key, 데이터베이스 비밀번호를 등록하면 안 됩니다.** 접근 권한은 위의 RLS 정책과 사용자 로그인으로 제한됩니다.

## 5. 다시 배포하고 시험하기

GitHub Actions → Publish study room → Run workflow를 실행합니다.

1. 사이트의 '동기화 연결'을 눌러 이메일 로그인 링크를 받습니다.
2. 2회 A형 1쪽에 짧은 테스트 답안을 작성합니다.
3. '계정에 저장됨'을 확인합니다.
4. 다른 기기에서 같은 이메일로 로그인하고 같은 문제지 쪽에서 답안을 확인합니다.
5. 실제 교재는 다른 기기에서도 PDF 선택 버튼으로 연결합니다.

다른 계정의 기록이 보이지 않는지도 확인하세요. 연결 전에는 사이트에 자동 동기화가 꺼져 있다고 표시됩니다.

## GitHub Pages 설정

저장소 Settings → Pages → Source를 GitHub Actions로 지정합니다. 비공개 저장소에서 Pages를 사용할 수 있는지는 GitHub 요금제에 따라 다릅니다. 사이트가 공개되어도 저장소의 교재·개인 답안을 노출하지 않도록 이 프로젝트에는 해당 파일을 포함하지 않았습니다. 저장소 공개 여부는 사용자가 선택합니다.

공식 문서:
- https://supabase.com/docs/guides/auth/quickstarts/react
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
