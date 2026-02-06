import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Phone, GraduationCap, Hash, UserCircle } from 'lucide-react';
import { getUserInfo } from '@/api/auth';
import { UserResponse } from '@/types/auth';
import { getErrorMessage } from '@/lib/api';

const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getUserInfo();
        if (res.success) {
          setUserInfo(res.user);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getGenderLabel = (gender?: string) => {
    if (gender === 'M') return '남성';
    if (gender === 'F') return '여성';
    return '-';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-destructive">{error || '사용자 정보를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const infoItems = [
    { label: '이름', value: userInfo.name, icon: User },
    { label: '닉네임', value: userInfo.nickname || '-', icon: UserCircle },
    { label: '성별', value: getGenderLabel(userInfo.gender), icon: User },
    { label: '학번', value: userInfo.student_id || '-', icon: GraduationCap },
    { label: '이메일', value: userInfo.email, icon: Mail },
    { label: '전화번호', value: userInfo.phone_number || '-', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">마이 페이지</h2>
            <p className="text-muted-foreground">내 계정 정보를 확인할 수 있습니다</p>
          </div>

          {/* Profile Card */}
          <div className="bg-card rounded-md p-6 shadow-md">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{userInfo.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {userInfo.nickname ? `@${userInfo.nickname}` : ''}
                </p>
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-4">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPage;
