import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useMatchStore } from '@/store/matchStore';
import { getMatchStatus } from '@/api/match';
import { MatchStatus } from '@/types/match';
import MatchHome from './MatchHome';
import MatchWaiting from './MatchWaiting';
import MatchResult from './MatchResult';
import MatchApproval from './MatchApproval';
import MatchContact from './MatchContact';
import MatchResultFailed from './MatchResultFailed';
import MatchContactFailed from './MatchContactFailed';

const MatchRouter = () => {
  const { matchStatus, setMatchStatus, setLoading, isLoading } = useMatchStore();
  const [initialLoad, setInitialLoad] = useState(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getMatchStatus();
      if (res.success) {
        setMatchStatus(res.match_status);
      }
    } catch {
      // 에러 시 기본 상태 유지
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchStatus();
  }, []);

  // IN_QUEUE 상태일 때 5초마다 폴링
  useEffect(() => {
    const clearPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

    if (matchStatus === MatchStatus.IN_QUEUE) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await getMatchStatus();
          if (res.success) {
            setMatchStatus(res.match_status);
            if (res.match_status !== MatchStatus.IN_QUEUE) {
              clearPolling();
            }
          }
        } catch {
          // 에러 발생 시 폴링 계속
        }
      }, 5000);
    } else {
      clearPolling();
    }

    return () => {
      clearPolling();
    };
  }, [matchStatus, setMatchStatus]);

  if (initialLoad || isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">매칭 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  switch (matchStatus) {
    case MatchStatus.NOT_STARTED:
      return <MatchHome onRefresh={fetchStatus} />;
    case MatchStatus.IN_QUEUE:
      return <MatchWaiting onRefresh={fetchStatus} />;
    case MatchStatus.MATCHED:
      return <MatchResult onRefresh={fetchStatus} />;
    case MatchStatus.MY_APPROVED:
      return <MatchApproval onRefresh={fetchStatus} />;
    case MatchStatus.BOTH_APPROVED:
      return <MatchContact onRefresh={fetchStatus} />;
    case MatchStatus.PARTNER_REJECTED:
      return <MatchResultFailed onRefresh={fetchStatus} />;
    case MatchStatus.PARTNER_REMATCHED:
      return <MatchContactFailed onRefresh={fetchStatus} />;
    default:
      return <MatchHome onRefresh={fetchStatus} />;
  }
};

export default MatchRouter;
