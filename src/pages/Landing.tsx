import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Landing = () => {
  const navigate = useNavigate();
  const { isLoggedIn, checkAuth } = useAuthStore();

  // 마운트 시 B/E에 세션 유효성 검증
  // localStorage에 isLoggedIn=true가 남아있어도 실제 세션이 만료되었을 수 있음
  useEffect(() => {
    if (isLoggedIn) {
      checkAuth();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="relative z-10 border-b border-border/50">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="G-Match" className="h-8 w-auto" />
            <span className="text-lg font-bold text-foreground">G-Match</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              완벽한 룸메이트,
              <br />
              <span className="text-primary">G-Match</span>가 찾아드립니다
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              생활 패턴, 공간 관리, 성격까지 분석하여
              <br />
              나와 가장 잘 맞는 룸메이트를 추천해드립니다
            </p>

            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate('/match/profile')}
              className="group"
            >
              시작하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              3단계로 완료
            </h2>
            <p className="text-muted-foreground text-lg">
              간단한 설문으로 나만의 룸메이트를 찾으세요
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: '기본 정보', desc: '학번, 입주 기간, 기숙사 동 선택' },
              { step: '02', title: '생활 패턴', desc: '24개 질문으로 생활 스타일 분석' },
              { step: '03', title: '매칭 확인', desc: '유사도 높은 후보자 리스트 확인' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex-1 text-center"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              3분이면 충분합니다. 나와 찰떡궁합인 룸메이트를 만나보세요.
            </p>
            <Button
              variant="heroOutline"
              size="xl"
              onClick={() => navigate('/match/profile')}
              className="group"
            >
              시작하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#1a1f2e] text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 G-Match. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm hover:text-foreground transition-colors">
                이용약관
              </a>
              <a href="#" className="text-sm hover:text-foreground transition-colors">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
