import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Target, Heart, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const Landing = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      toast.info('이미 로그인 된 상태입니다', {
        duration: 5000,
      });
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: '정밀한 매칭',
      description: '24개 질문으로 생활 패턴을 분석하여 최적의 룸메이트를 찾아드립니다',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'GIST 학생 전용',
      description: 'GIST 기숙사 생활에 특화된 매칭 알고리즘을 사용합니다',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: '가중치 설정',
      description: '본인에게 중요한 항목에 더 높은 가중치를 설정할 수 있습니다',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '안전한 매칭',
      description: '서로 동의한 경우에만 연락처가 공개됩니다',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              GIST 학생을 위한 룸메이트 매칭
            </div>
            
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="G-Match" className="h-16 md:h-20 w-auto" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              완벽한 룸메이트,
              <br />
              <span className="text-primary">G-Match</span>가 찾아드립니다
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              생활 패턴, 공간 관리, 성격까지 분석하여
              <br className="hidden md:block" />
              나와 가장 잘 맞는 룸메이트를 추천해드립니다
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => navigate('/match')}
                  className="group"
                >
                  매칭하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={handleAuthClick}
                    className="group"
                  >
                    시작하기
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={handleAuthClick}
                  >
                    로그인
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: '500+', label: '매칭 완료' },
              { value: '95%', label: '만족도' },
              { value: '24', label: '분석 항목' },
              { value: '3분', label: '설문 소요' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              왜 G-Match인가요?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              과학적인 분석과 GIST 맞춤형 알고리즘으로 최적의 룸메이트를 찾아드립니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-md p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
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
              onClick={isLoggedIn ? () => navigate('/match') : handleAuthClick}
              className="group"
            >
              {isLoggedIn ? '매칭하기' : '무료로 시작하기'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 G-Match. GIST 학생을 위한 룸메이트 매칭 서비스</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
