import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { useGameHistory } from '@/hooks/useGameHistory';
import { usePsychReport } from '@/hooks/usePsychReport';
import { GameMode, GAME_COLORS, MODE_CONFIG } from '@/types/game';
import { GameLogo } from '@/components/game/GameLogo';
import { ModeCard } from '@/components/game/ModeCard';
import { ColorButton } from '@/components/game/ColorButton';
import { WordDisplay } from '@/components/game/WordDisplay';
import { ProgressBar } from '@/components/game/ProgressBar';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { ReportCard } from '@/components/game/ReportCard';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

type Screen = 'home' | 'mode-select' | 'game' | 'result';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [countdown, setCountdown] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const gameState = useGameState();
  const { addSession } = useGameHistory();
  const { generateReport } = usePsychReport();

  const handleModeSelect = (mode: GameMode) => {
    gameState.setMode(mode);
  };

  const handleStartGame = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          gameState.startGame();
          setScreen('game');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGameEnd = () => {
    const stats = gameState.getStats();
    const session = gameState.getSession();
    addSession(session, stats);
    setScreen('result');
  };

  const handlePlayAgain = () => {
    gameState.resetGame();
    setScreen('mode-select');
  };

  const handleGoHome = () => {
    gameState.resetGame();
    setScreen('home');
  };

  const handleSaveReport = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#fffdf5' });
      const link = document.createElement('a');
      link.download = '心理韧性报告.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  // 监听游戏结束
  if (gameState.phase === 'result' && screen === 'game') {
    handleGameEnd();
  }

  const stats = gameState.getStats();
  const report = gameState.mode ? generateReport(stats) : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* 首页 */}
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh] gap-8"
            >
              <GameLogo />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-xs space-y-4"
              >
                <Button
                  onClick={() => setScreen('mode-select')}
                  className="w-full h-14 text-lg rounded-2xl btn-cute"
                >
                  🎮 开始游戏
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  选择文字的<span className="text-primary font-bold">颜色</span>，而不是文字内容！
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* 模式选择 */}
          {screen === 'mode-select' && (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="py-8 space-y-6"
            >
              <h1 className="text-2xl font-bold text-center">选择模式</h1>
              <div className="space-y-4">
                {(['normal', 'stress', 'extreme'] as GameMode[]).map((mode) => (
                  <ModeCard
                    key={mode}
                    mode={mode}
                    selected={gameState.mode === mode}
                    onClick={() => handleModeSelect(mode)}
                  />
                ))}
              </div>
              <Button
                onClick={handleStartGame}
                disabled={!gameState.mode}
                className="w-full h-14 text-lg rounded-2xl btn-cute"
              >
                开始挑战！
              </Button>
              <Button variant="ghost" onClick={handleGoHome} className="w-full">
                返回首页
              </Button>
              
              {/* 倒计时 */}
              {countdown > 0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-background/90 z-50">
                  <motion.span
                    key={countdown}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-9xl font-bold text-primary"
                  >
                    {countdown}
                  </motion.span>
                </div>
              )}
            </motion.div>
          )}

          {/* 游戏界面 */}
          {screen === 'game' && gameState.mode && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`py-4 space-y-6 ${MODE_CONFIG[gameState.mode].hasFlashEffect ? 'flash-bg' : ''}`}
            >
              <ScoreDisplay score={gameState.score} combo={gameState.combo} />
              <ProgressBar
                current={gameState.currentQuestion}
                total={gameState.totalQuestions}
                timeLeft={gameState.timeLeft}
                maxTime={MODE_CONFIG[gameState.mode].timeLimit * 1000}
              />
              <WordDisplay
                word={gameState.currentWord}
                lastResult={gameState.lastResult}
                isFlashing={MODE_CONFIG[gameState.mode].hasFlashEffect}
              />
              <div className="flex justify-center gap-4">
                {GAME_COLORS.map((color) => (
                  <ColorButton
                    key={color}
                    color={color}
                    onClick={() => gameState.selectColor(color)}
                    showCombo={gameState.combo > 2}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 结果页面 */}
          {screen === 'result' && report && gameState.mode && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-8 space-y-6"
            >
              <ReportCard ref={reportRef} report={report} mode={gameState.mode} />
              <div className="space-y-3">
                <Button onClick={handleSaveReport} className="w-full h-12 rounded-2xl">
                  📷 保存报告图片
                </Button>
                <Button onClick={handlePlayAgain} variant="outline" className="w-full h-12 rounded-2xl">
                  🔄 再来一局
                </Button>
                <Button onClick={handleGoHome} variant="ghost" className="w-full">
                  返回首页
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
