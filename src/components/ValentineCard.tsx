import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  QUESTION_TEXT, 
  YES_TEXT, 
  MAYBE_TEXT, 
  DYNAMIC_TEXTS, 
  SUCCESS_MESSAGE, 
  SUCCESS_IMAGE, 
  YES_TOOLTIP,
  GIRL_NAME,
  GUY_SUCCESS_MESSAGE,
} from './../../config';
import { Confetti } from './Confetti';
import teddyHead from '/teddy-head.png';
import { ShareButton } from './ShareButton';

type ViewState = 'proposal' | 'girl-success' | 'guy-view';

export const ValentineCard = () => {
  const [viewState, setViewState] = useState<ViewState>('proposal');
  // const [accepted, setAccepted] = useState(false);
  // Starting positions offset from the center so they don't overlap the 'Yes' button initially
  const [maybePos, setMaybePos] = useState({ x: -140, y: 0 });
  const [noPos, setNoPos] = useState({ x: 140, y: 0, rotate: 0, scale: 1 });
  const [dynamicTextIndex, setDynamicTextIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if the link was shared with the status=accepted parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'accepted') {
      setViewState('guy-view');
    }
  }, []);

  /**
   * Generates a random coordinate, rotation, and scale for the teasing buttons.
   * Ensures the button stays within the visual boundaries of the card.
   */
  const getRandomPosition = useCallback((isNoButton = false) => {
    if (!cardRef.current) return { x: 0, y: 0, rotate: 0, scale: 1 };
    
    const cardRect = cardRef.current.getBoundingClientRect();
    // Use conservative dimensions to ensure the button doesn't clip the edges
    const btnWidth = isNoButton ? 150 : 100; 
    const btnHeight = 45;
    const padding = 20;

    // Bounds are relative to the center of the 'h-56' container
    const maxX = (cardRect.width / 2) - (btnWidth / 2) - padding;
    const minX = -((cardRect.width / 2) - (btnWidth / 2) - padding);

    // Vertically, keep the buttons in a tighter band so they
    // never leave the visible  h-56  area or get clipped by
    // the card's overflow.
    const maxYRaw = (cardRect.height / 2) - (btnHeight / 2) - padding;
    const maxY = Math.min(maxYRaw, 60); // clamp to a safe vertical range
    const minY = -maxY;

    // Define a "forbidden" area around the center so the teasing
    // buttons don't land underneath the main "Yes" button.
    const forbiddenHalfWidth = 120; // horizontal area to avoid around center
    const forbiddenHalfHeight = 60; // vertical area to avoid around center

    const createRandomPosition = () => ({
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
      rotate: (Math.random() - 0.5) * 25, // Playful tilt
      scale: 0.9 + Math.random() * 0.25   // Teasing size variation
    });

    // Try a few times to find a position that is not
    // directly underneath the centered "Yes" button.
    for (let i = 0; i < 60; i++) {
      const pos = createRandomPosition();
      const overlapsYes =
        Math.abs(pos.x) < forbiddenHalfWidth &&
        Math.abs(pos.y) < forbiddenHalfHeight;

      if (!overlapsYes) {
        return pos;
      }
    }

    // Fallback to whatever we got last if we somehow
    // didn't find a non-overlapping position.
    return createRandomPosition();
  }, []);

  const handleMaybeInteraction = () => {
    const pos = getRandomPosition();
    setMaybePos({ x: pos.x, y: pos.y });
  };

  const handleNoInteraction = () => {
    const pos = getRandomPosition(true);
    setNoPos(pos);
    setDynamicTextIndex((prev) => (prev + 1) % DYNAMIC_TEXTS.length);
  };

  const handleYes = () => {
    setViewState('girl-success');
  };

  const customCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' style='font-size:30px'><text y='30'>💖</text></svg>"), auto`;

  if (viewState !== 'proposal') {
    return (
      <div 
        style={{ cursor: customCursor }}
        className="animate-entrance flex flex-col items-center justify-center p-8 pt-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-100 max-w-md w-full max-h-[95vh] overflow-y-auto text-center space-y-4"
      >
        <Confetti />
        
        <h1 className="romantic-title text-4xl md:text-5xl text-pink-600 font-bold leading-tight">
          {viewState === 'girl-success'? SUCCESS_MESSAGE : GUY_SUCCESS_MESSAGE}
        </h1>
        {viewState === 'girl-success'?
        (<div className="relative flex flex-col items-center justify-center space-y-4">
          <div className="w-full aspect-square max-h-[40vh] rounded-2xl overflow-hidden shadow-inner border-4 border-pink-50">
            <img 
              src={SUCCESS_IMAGE} 
              alt="Celebration" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-pink-400 font-medium italic">I knew you'd say yes! ✨</p>
          <ShareButton />
        </div>): (
          <div className="space-y-4">
            <p className="text-pink-400 font-medium italic">Congratulations to both of you! 🥂</p>
            <p className="text-gray-400 text-sm">She shared the love with you. ✨</p>
          </div>
          )
        }
      </div>
    );
  }

  return (
    <div 
      ref={cardRef}
      style={{ cursor: customCursor }}
      className="animate-entrance relative flex flex-col items-center justify-between p-8 pb-4 bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white max-w-md w-full min-h-[400px] max-h-[75vh] text-center "
    >
      <div className="space-y-6 z-10 pointer-events-none">
        <div className="flex justify-center animate-float -mt-20">
          <div className=" p-5 rounded-full relative ">
            {/* Teddy image + small hearts around it */}
            <div className="relative w-25 h-25 -mt-5">
              <img
                src={teddyHead}
                alt="Teddy"
                className="w-[120px] h-[120px] object-contain drop-shadow-sm"
                draggable={false}
              />
              <span className="absolute -top-2 -left-2 text-pink-500 text-l">💖</span>
              <span className="absolute -top-3 right-0 text-rose-500 text-l">💗</span>
              <span className="absolute bottom-0 -left-3 text-pink-400 text-l">💞</span>
              <span className="absolute -bottom-2 right-1 text-rose-400 text-l">💘</span>
            </div>
          </div>
        </div>
        
        <h1 className="romantic-title text-3xl md:text-4xl text-pink-700/70 font-bold leading-relaxed px-2 select-none">
        {QUESTION_TEXT}, <strong className='text-6xl font-bold text-pink-700'>{GIRL_NAME}</strong>? 💖
        </h1>
      </div>

      <div className="relative w-full h-80 flex items-center justify-center mt-4">
        {/* Yes Button with Tooltip */}
        <div className="relative z-20">
          {showTooltip && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-sm py-2 px-4 rounded-full whitespace-nowrap shadow-lg animate-bounce pointer-events-none z-30">
              {YES_TOOLTIP}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-pink-600"></div>
            </div>
          )}
          <button
            onClick={handleYes}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="animate-pulse-soft bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform active:scale-90 shadow-xl"
          >
            {YES_TEXT}
          </button>
        </div>

        {/* Maybe Button */}
        <button
          onMouseEnter={handleMaybeInteraction}
          onTouchStart={handleMaybeInteraction}
          style={{
            transform: `translate(${maybePos.x}px, ${maybePos.y}px)`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'absolute'
          }}
          className="bg-pink-50 text-pink-400 border-2 border-pink-100 font-semibold py-2 px-6 rounded-full text-sm cursor-default whitespace-nowrap opacity-60 hover:opacity-100 z-10 select-none"
        >
          {MAYBE_TEXT}
        </button>

        {/* Dynamic Button - Playful teasing behavior */}
        <button
          onMouseEnter={handleNoInteraction}
          onTouchStart={handleNoInteraction}
          style={{
            transform: `translate(${noPos.x}px, ${noPos.y}px) rotate(${noPos.rotate}deg) scale(${noPos.scale})`,
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'absolute'
          }}
          className="bg-gray-50 text-gray-400 border border-gray-200 font-medium py-2 px-6 rounded-full text-sm cursor-default whitespace-nowrap opacity-80 hover:opacity-100 z-10 select-none transition-opacity hover:shadow-md"
        >
          {DYNAMIC_TEXTS[dynamicTextIndex]}
        </button>
      </div>

      <p className="text-gray-300 text-[10px] mt-4 uppercase tracking-widest select-none">
        Made with 💖 by{" "}
        <a
          href="https://x.com/Sochillion"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-pink-400 hover:text-pink-500"
          style={{ cursor: 'pointer' }}
        >
          Sochima
        </a>{" "}
        for someone special
      </p>
    </div>
  );
};