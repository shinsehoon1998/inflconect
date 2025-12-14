export const UI_TEXT = {
    common: {
        loading: "잠시만 기다려주세요",
        error: "문제가 발생했어요",
        retry: "다시 시도하기",
        confirm: "확인",
        cancel: "취소",
        next: "다음",
        prev: "이전",
        close: "닫기",
    },
    auth: {
        login: {
            title: "안녕하세요",
            subtitle: "서비스 이용을 위해 로그인해주세요",
            email_placeholder: "이메일을 입력해주세요",
            password_placeholder: "비밀번호를 입력해주세요",
            action: "로그인하기",
            no_account: "계정이 없으신가요?",
            signup_link: "회원가입",
        },
        signup: {
            title: "환영합니다",
            subtitle: "어떤 분이신가요?",
            role_advertiser: "광고주 (사장님)",
            role_influencer: "인플루언서",
            action: "가입하기",
            continue_action: "회원가입 계속하기",
            have_account: "이미 계정이 있으신가요?",
            login_link: "로그인",
            role_select: {
                title: "어떤 분이신가요?",
                desc: "가입 유형을 선택해주세요",
                advertiser: "광고주 (사장님)",
                advertiser_desc: "가게 홍보가 필요해요",
                influencer: "인플루언서",
                influencer_desc: "캠페인에 참여하고 싶어요",
                continue: "계속하기"
            }
        }
    },
    advertiser: {
        dashboard: {
            active_campaigns: "사장님 가게 광고, 지금 이렇게 진행되고 있어요",
            past_results: "이전 광고 결과 요약",
            create_new: "새로운 광고 시작하기",
        },
        create: {
            step1_title: "이번 광고로 어떤 걸 늘리고 싶으세요?",
            step2_title: "어느 정도로 해볼까요?",
            step3_title: "이 예산이면 이런 결과를 기대할 수 있어요",
            summary: "이대로 시작해볼게요",
            next: "다음",
            purposes: {
                promote: "매장 홍보",
                promote_desc: "우리 가게를 사람들에게 알려요",
                menu: "신메뉴 알리기",
                menu_desc: "새로운 메뉴가 나왔어요",
                visit: "방문 유도",
                visit_desc: "손님들이 직접 찾아오게 해요"
            },
            goals: {
                test: "소규모 테스트",
                test_desc: "가볍게 시작해보고 싶어요",
                basic: "기본 진행",
                basic_desc: "적당한 규모로 진행해요",
                aggressive: "공격적 확산",
                aggressive_desc: "최대한 많은 사람에게 알려요"
            }
        }
    },
    influencer: {
        dashboard: {
            earnings: "이번 달 예상 수익",
            available_campaigns: "지금 참여할 수 있는 캠페인이 있어요",
        },
        upload: {
            title: "영상은 여기서 올려주세요",
            desc: "조금만 기다리면 확인할게요",
        }
    }
} as const;
