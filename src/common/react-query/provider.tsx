import { keepPreviousData, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MINUTE, SECOND } from "../date/time";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      // 재시도 관련 옵션
      retry: true, // infinite retry (기존 설정)
      // retry: 3, // 3번만 재시도
      // retry: (failureCount, error) => failureCount < 3, // 조건부 재시도

      retryDelay: (attemptIndex) => Math.min(2 ** attemptIndex * SECOND, 30 * MINUTE), // 기존 설정
      // retryDelay: 1000, // 고정 지연시간 (1초)

      // 캐시 관련 옵션
      staleTime: 0, // 데이터가 stale 상태가 되는 시간 (0 = 즉시 stale)
      // staleTime: 5 * MINUTE, // 5분 후 stale
      // staleTime: Infinity, // 절대 stale 되지 않음

      gcTime: 5 * MINUTE, // 가비지 컬렉션 시간 (기본값: 5분)
      // gcTime: 10 * MINUTE, // 10분 후 메모리에서 제거
      // gcTime: Infinity, // 절대 제거하지 않음

      // 데이터 fetching 옵션
      placeholderData: keepPreviousData, // 기존 설정
      // placeholderData: undefined, // placeholder 없음
      // placeholderData: (previousData) => previousData, // 함수형 placeholder

      refetchOnMount: true, // 컴포넌트 마운트 시 refetch (기본값: true)
      // refetchOnMount: false, // 마운트 시 refetch 안함
      // refetchOnMount: "always", // 항상 refetch

      refetchOnWindowFocus: true, // 윈도우 포커스 시 refetch (기본값: true)
      // refetchOnWindowFocus: false, // 포커스 시 refetch 안함
      // refetchOnWindowFocus: "always", // 항상 refetch

      refetchOnReconnect: true, // 네트워크 재연결 시 refetch (기본값: true)
      // refetchOnReconnect: false, // 재연결 시 refetch 안함
      // refetchOnReconnect: "always", // 항상 refetch

      refetchInterval: false, // 자동 refetch 간격 (기본값: false)
      // refetchInterval: 30 * SECOND, // 30초마다 자동 refetch
      // refetchInterval: (data) => data?.shouldRefresh ? 5000 : false, // 조건부 간격

      refetchIntervalInBackground: false, // 백그라운드에서도 interval refetch
      // refetchIntervalInBackground: true, // 백그라운드에서도 실행

      // 네트워크 관련 옵션
      networkMode: "online", // 네트워크 모드 (기본값: "online")
      // networkMode: "always", // 항상 실행 (오프라인에서도)
      // networkMode: "offlineFirst", // 오프라인 우선

      // 기타 옵션
      enabled: true, // 쿼리 활성화 여부 (기본값: true)
      // enabled: false, // 쿼리 비활성화
      // enabled: (query) => !!query.state.data, // 조건부 활성화

      // 메타데이터
      // meta: {
      //   errorMessage: "데이터를 불러오는데 실패했습니다",
      //   persist: false
      // }
    },
    mutations: {
      // 뮤테이션 재시도 옵션
      retry: false, // 뮤테이션은 기본적으로 재시도 안함
      // retry: 1, // 1번 재시도
      // retry: (failureCount, error) => error.status !== 401, // 조건부 재시도

      retryDelay: (attemptIndex) => Math.min(2 ** attemptIndex * SECOND, 30 * MINUTE),
      // retryDelay: 1000, // 고정 지연시간

      // 네트워크 관련 옵션
      networkMode: "online", // 네트워크 모드 (기본값: "online")
      // networkMode: "always", // 항상 실행

      // 메타데이터
      // meta: {
      //   successMessage: "성공적으로 저장되었습니다",
      //   errorMessage: "저장에 실패했습니다"
      // }
    },
  },
});

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
