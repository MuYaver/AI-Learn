'use client';
import { useState, useCallback, useEffect } from 'react';
import { playCorrect, playWrong, playComplete } from '@/lib/sounds';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import TopBar from '@/components/layout/Navbar';

function MultipleChoice({ exercise, selectedAnswer, onSelect, showResult }) {
  const options = exercise.options || [];
  return (
    <div className="space-y-3">
      {options.map((option, i) => {
        let bgClass = 'bg-white border-duo-border hover:border-duo-green/50 hover:bg-duo-green/5';
        if (showResult && selectedAnswer === option) {
          bgClass = option === exercise.correct_answer
            ? 'bg-duo-green/10 border-duo-green'
            : 'bg-duo-red/10 border-duo-red';
        }
        if (showResult && option === exercise.correct_answer) {
          bgClass = 'bg-duo-green/10 border-duo-green';
        }

        return (
          <button
            key={i}
            onClick={() => !showResult && onSelect(option)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgClass}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-duo-text">{option}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TrueFalse({ exercise, selectedAnswer, onSelect, showResult }) {
  const options = ['true', 'false'];
  return (
    <div className="flex gap-4 justify-center">
      {options.map((option) => {
        const isCorrect = showResult && option === exercise.correct_answer;
        const isWrong = showResult && selectedAnswer === option && option !== exercise.correct_answer;
        let bgClass = 'bg-white border-duo-border hover:border-duo-green/50';
        if (isCorrect) bgClass = 'bg-duo-green/10 border-duo-green';
        if (isWrong) bgClass = 'bg-duo-red/10 border-duo-red';

        return (
          <button
            key={option}
            onClick={() => !showResult && onSelect(option)}
            disabled={showResult}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all ${bgClass}`}
          >
            <span className="block text-4xl mb-2">{option === 'true' ? '✅' : '❌'}</span>
            <span className="font-bold text-duo-text capitalize">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

function FillBlank({ exercise, selectedAnswer, onSelect, showResult }) {
  const [input, setInput] = useState(selectedAnswer || '');

  const handleSubmit = () => {
    if (input.trim() && !showResult) {
      onSelect(input.trim());
    }
  };

  let bgClass = 'border-duo-border';
  if (showResult) {
    bgClass = selectedAnswer?.toLowerCase() === exercise.correct_answer.toLowerCase()
      ? 'border-duo-green'
      : 'border-duo-red';
  }

  return (
    <div className="space-y-4">
      <div className={`border-2 rounded-xl overflow-hidden transition-all ${bgClass}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={showResult}
          className="w-full p-4 text-lg bg-duo-surface focus:outline-none text-duo-text"
          placeholder="Type your answer..."
          autoFocus
        />
      </div>
      {!showResult && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-duo-green text-white font-bold
                     hover:bg-duo-green-dark transition-all shadow-lg shadow-duo-green/20"
        >
          Check
        </button>
      )}
      {showResult && (
        <div className="p-4 rounded-xl bg-duo-surface">
          <p className="text-sm text-duo-text-secondary">Correct answer:</p>
          <p className="text-lg font-bold text-duo-green">{exercise.correct_answer}</p>
        </div>
      )}
    </div>
  );
}

function Match({ exercise, selectedAnswer, onSelect, showResult }) {
  const options = exercise.options || [];
  const pairs = options.map((o) => {
    const idx = o.indexOf(':');
    if (idx === -1) return { term: o, def: o };
    return { term: o.slice(0, idx).trim(), def: o.slice(idx + 1).trim() };
  });

  const [currentTerm, setCurrentTerm] = useState(0);
  const [shuffledDefs] = useState(() =>
    pairs.map((p) => p.def).sort(() => Math.random() - 0.5)
  );
  const [attempts, setAttempts] = useState({});

  const correctPairStr = pairs.map((p) => `${p.term}:${p.def}`).join('|');

  const handlePick = (def) => {
    const pair = `${pairs[currentTerm].term}:${def}`;
    const isCorrect = pairs[currentTerm].def === def;
    setAttempts((prev) => ({ ...prev, [currentTerm]: pair }));

    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }

    if (currentTerm < pairs.length - 1) {
      setTimeout(() => setCurrentTerm((prev) => prev + 1), 600);
    } else {
      const allPairs = Object.values({ ...attempts, [currentTerm]: pair }).join('|');
      onSelect(allPairs);
    }
  };

  const userPairs = selectedAnswer ? selectedAnswer.split('|') : [];
  const allSubmitted = showResult;

  return (
    <div className="space-y-4">
      <div className="bg-duo-surface rounded-xl p-4 text-center">
        <p className="text-xs text-duo-text-secondary mb-1">Match the term:</p>
        <p className="text-xl font-bold text-duo-text">{pairs[currentTerm].term}</p>
        {pairs.length > 1 && (
          <p className="text-xs text-duo-text-secondary mt-1">
            {currentTerm + 1} of {pairs.length}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {shuffledDefs.map((def, i) => {
          const isUsed = attempts[currentTerm - 1] && userPairs.slice(0, currentTerm).some((p) => p.endsWith(`:${def}`));
          if (isUsed) return null;

          const selectedNow = allSubmitted && userPairs[currentTerm] === `${pairs[currentTerm].term}:${def}`;
          const isCorrect = allSubmitted && pairs.some((p) => p.term === pairs[currentTerm].term && p.def === def);
          const isWrong = selectedNow && !isCorrect;

          let bgClass = 'bg-white border-duo-border hover:border-duo-green/50';
          if (allSubmitted && isCorrect) bgClass = 'bg-duo-green/10 border-duo-green';
          if (isWrong) bgClass = 'bg-duo-red/10 border-duo-red';

          return (
            <button
              key={i}
              onClick={() => !allSubmitted && handlePick(def)}
              disabled={allSubmitted}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-duo-surface flex items-center justify-center text-sm font-bold text-duo-text flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-duo-text">{def}</span>
              </div>
            </button>
          );
        })}
      </div>

      {allSubmitted && (
        <div className="bg-duo-surface rounded-xl p-4">
          <p className="text-xs text-duo-text-secondary mb-2 font-bold">Correct matches:</p>
          {pairs.map((p, i) => (
            <div key={i} className="text-sm flex gap-2 py-0.5">
              <span className="font-bold text-duo-text">{p.term}</span>
              <span className="text-duo-text-secondary">→</span>
              <span className="text-duo-green font-medium">{p.def}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function XPAnimation({ xp, onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
    >
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-4"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: 2, duration: 0.5 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold text-duo-text mb-2">+{xp} XP</h2>
        <p className="text-duo-text-secondary">Great job!</p>
      </motion.div>
    </motion.div>
  );
}

function fuzzyMatch(userAnswer, correctAnswer) {
  const a = userAnswer.toLowerCase().trim();
  const b = correctAnswer.toLowerCase().trim();
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  let d = 0;
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) if (a[i] !== b[i]) d++;
  d += Math.abs(a.length - b.length);
  return d <= 1;
}

function checkCorrect(exercise, answer) {
  if (exercise.type === 'fill_blank') return fuzzyMatch(answer, exercise.correct_answer);
  if (exercise.type === 'match') {
    if (!answer || !exercise.correct_answer) return false;
    const userPairs = answer.split('|').map((s) => s.trim()).sort();
    const options = exercise.options || [];
    const correctPairs = options.slice().sort();
    return userPairs.join('|') === correctPairs.join('|');
  }
  return answer.toLowerCase().trim() === exercise.correct_answer.toLowerCase().trim();
}

function ConfettiEffect() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#58CC02', '#1CB0F6', '#CE82FF', '#FF9600', '#FF4B4B', '#FFC800'][i % 6],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      rotate: 720 + Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, ease: 'easeIn', delay: p.delay }}
          className="absolute w-3 h-3 rounded-full"
          style={{ left: `${p.x}%`, background: p.color }}
        />
      ))}
    </div>
  );
}

export default function LessonPage() {
  const { user, loading, refreshUser } = useUser();
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [fetching, setFetching] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showXPAnim, setShowXPAnim] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const id = params?.id;
    if (!id) return;

    fetch(`/api/lessons/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setLesson(d.lesson);
        setExercises(d.exercises || []);
        setVideos(d.videos || []);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [params?.id, user]);

  const handleAnswer = useCallback((answer) => {
    if (submitted[currentIdx]) return;

    const exercise = exercises[currentIdx];
    const isCorrect = checkCorrect(exercise, answer);

    setAnswers((prev) => ({ ...prev, [currentIdx]: answer }));
    setSubmitted((prev) => ({ ...prev, [currentIdx]: true }));

    if (!isCorrect) {
      setWrongCount((prev) => prev + 1);
      playWrong();
    } else {
      playCorrect();
    }
  }, [currentIdx, exercises, submitted]);

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleReview = () => {
    setShowCompletion(false);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted({});
    setShowConfetti(false);
    setWrongCount(0);
  };

  const handleFinish = async () => {
    setCompleting(true);
    try {
      const total = exercises.length;
      const correct = Object.entries(answers).filter(([idx, answer]) => {
        const ex = exercises[parseInt(idx)];
        return checkCorrect(ex, answer);
      }).length;
      const score = Math.round((correct / total) * 100);
      const heartsLost = Math.floor(wrongCount / 2);

      playComplete();

      const res = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ lessonId: lesson.id, score, heartsLost }),
      });

      const data = await res.json();
      if (data.user) {
        setXpGained(data.xpGain);
        setShowXPAnim(true);
        setShowConfetti(true);

        setTimeout(() => {
          setShowXPAnim(false);
          setShowCompletion(true);
        }, 2000);

        await refreshUser();
      }
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-5xl animate-bounce">🦉</div>
      </div>
    );
  }

  if (!user) return null;
  if (!lesson || exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-center">
          <p className="text-duo-text-secondary text-lg">Lesson not found</p>
          <button onClick={() => router.push('/')} className="mt-4 text-duo-green font-bold">
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    const total = exercises.length;
    const correct = Object.entries(answers).filter(([idx, answer]) => {
      const ex = exercises[parseInt(idx)];
      return checkCorrect(ex, answer);
    }).length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 70;

    return (
      <div className="min-h-screen bg-duo-surface flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center"
        >
          <div className="text-6xl mb-4">{score >= 80 ? '🏆' : score >= 50 ? '👍' : '💪'}</div>
          <h2 className="text-3xl font-bold text-duo-text mb-2">{passed ? 'Lesson Complete!' : 'Almost there!'}</h2>
          <p className="text-duo-text-secondary mb-6">
            {score >= 80 ? 'Amazing job!' : score >= 50 ? 'Good effort!' : 'Keep practicing!'}
          </p>

          <div className="bg-duo-surface rounded-2xl p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-duo-text-secondary">Score</span>
              <span className={`font-bold ${passed ? 'text-duo-text' : 'text-duo-red'}`}>{score}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-duo-text-secondary">Correct</span>
              <span className="font-bold text-duo-green">{correct}/{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-duo-text-secondary">XP Earned</span>
              <span className="font-bold text-duo-blue">+{xpGained} XP</span>
            </div>
            {!passed && (
              <div className="text-center pt-2 border-t border-duo-border">
                <span className="text-xs text-duo-red font-medium">Need 70% to pass — keep trying!</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {passed ? (
              <>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3.5 rounded-xl bg-duo-green text-white font-bold text-lg
                             hover:bg-duo-green-dark transition-all shadow-lg shadow-duo-green/30"
                >
                  Continue Learning
                </button>
                <button
                  onClick={handleReview}
                  className="flex-1 py-3.5 rounded-xl bg-duo-border text-duo-text font-bold text-lg
                             hover:bg-duo-surface transition-all"
                >
                  Review
                </button>
              </>
            ) : (
              <button
                onClick={handleReview}
                className="flex-1 py-3.5 rounded-xl bg-duo-orange text-white font-bold text-lg
                           hover:bg-duo-orange/90 transition-all shadow-lg shadow-duo-orange/30"
              >
                🔁 Try Again
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const exercise = exercises[currentIdx];
  const hasAnswer = submitted[currentIdx];
  const isCorrect = hasAnswer && checkCorrect(exercise, answers[currentIdx]);

  return (
    <div className="min-h-screen bg-duo-surface">
      <TopBar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {showConfetti && <ConfettiEffect />}
        {showXPAnim && <XPAnimation xp={xpGained} onComplete={() => setShowXPAnim(false)} />}

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-duo-text-secondary hover:text-duo-text transition-colors"
          >
            ← Exit
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-duo-text-secondary font-medium">
              {currentIdx + 1} of {exercises.length}
            </span>
          </div>
          <div className="h-2 bg-duo-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-duo-green rounded-full"
              initial={{ width: `${(currentIdx / exercises.length) * 100}%` }}
              animate={{ width: `${((currentIdx + (hasAnswer ? 1 : 0)) / exercises.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {videos.length > 0 && (
          <div className="mb-6">
            <details className="bg-white rounded-2xl shadow-sm border border-duo-border overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer hover:bg-duo-surface transition-colors flex items-center gap-3">
                <span className="text-2xl">🎥</span>
                <span className="font-bold text-duo-text">Watch & Learn ({videos.length} video{videos.length > 1 ? 's' : ''})</span>
                <span className="ml-auto text-duo-text-secondary text-sm">Expand</span>
              </summary>
              <div className="px-6 pb-5 space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <p className="text-sm font-medium text-duo-text">{video.title}</p>
                    <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`bg-white rounded-2xl shadow-sm border p-6 mb-4 ${hasAnswer ? (isCorrect ? 'border-duo-green/30' : 'border-duo-red/30 animate-shake') : 'border-duo-border'}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-duo-text-secondary uppercase bg-duo-surface px-2 py-1 rounded-lg">
                  {exercise.type === 'multiple_choice' ? 'Multiple Choice' :
                   exercise.type === 'true_false' ? 'True or False' :
                   exercise.type === 'fill_blank' ? 'Fill in the Blank' :
                   exercise.type === 'match' ? 'Match' : 'Question'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-duo-text mb-6">{exercise.question}</h3>

              {exercise.type === 'multiple_choice' && (
                <MultipleChoice
                  exercise={exercise}
                  selectedAnswer={answers[currentIdx]}
                  onSelect={handleAnswer}
                  showResult={hasAnswer}
                />
              )}
              {exercise.type === 'true_false' && (
                <TrueFalse
                  exercise={exercise}
                  selectedAnswer={answers[currentIdx]}
                  onSelect={handleAnswer}
                  showResult={hasAnswer}
                />
              )}
              {exercise.type === 'fill_blank' && (
                <FillBlank
                  key={exercise.id}
                  exercise={exercise}
                  selectedAnswer={answers[currentIdx]}
                  onSelect={handleAnswer}
                  showResult={hasAnswer}
                />
              )}
              {exercise.type === 'match' && (
                <Match
                  exercise={exercise}
                  selectedAnswer={answers[currentIdx]}
                  onSelect={handleAnswer}
                  showResult={hasAnswer}
                />
              )}

              {hasAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-duo-green/5 border border-duo-green/20' : 'bg-duo-red/5 border border-duo-red/20'}`}
                >
                  <p className="font-bold text-sm mb-1">
                    {isCorrect ? '✅ Correct!' : '❌ Not quite'}
                  </p>
                  {exercise.explanation && (
                    <p className="text-sm text-duo-text-secondary">{exercise.explanation}</p>
                  )}
                </motion.div>
              )}
            </div>

            {(user?.hearts ?? 5) <= 0 && !hasAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-duo-red/10 border border-duo-red/30 rounded-2xl p-6 text-center mb-4"
              >
                <p className="text-3xl mb-2">💔</p>
                <h3 className="font-bold text-duo-red text-lg">Out of hearts!</h3>
                <p className="text-sm text-duo-text-secondary mt-1">
                  Hearts will regenerate in 1 hour, or visit the shop to refill.
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => router.push('/shop')}
                    className="flex-1 py-2.5 rounded-xl bg-duo-orange text-white font-bold text-sm
                               hover:bg-duo-orange/90 transition-all"
                  >
                    Get Hearts
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 py-2.5 rounded-xl bg-duo-border text-duo-text-secondary font-bold text-sm
                               hover:bg-duo-border/70 transition-all"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-6 py-3 rounded-xl border-2 border-duo-border text-duo-text font-semibold
                       hover:bg-duo-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          {currentIdx === exercises.length - 1 && Object.keys(submitted).length === exercises.length ? (
            <button
              onClick={handleFinish}
              disabled={completing}
              className="px-8 py-3 rounded-xl bg-duo-green text-white font-bold
                         hover:bg-duo-green-dark transition-all shadow-lg shadow-duo-green/30
                         disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
            >
              {completing ? 'Saving...' : 'Finish Lesson 🎉'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentIdx === exercises.length - 1 || !hasAnswer}
              className="px-6 py-3 rounded-xl border-2 border-duo-green text-duo-green font-semibold
                         hover:bg-duo-green/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
