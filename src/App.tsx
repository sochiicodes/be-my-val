import { ValentineCard } from "./components/ValentineCard"


function App() {

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff5f7] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100/50 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="heart-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 85L43 78C18 55 2 41 2 24C2 11 11 2 24 2C31 2 38 6 43 12C48 6 55 2 62 2C75 2 84 11 84 24C84 41 68 55 43 78L50 85Z" fill="pink"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#heart-pattern)" />
        </svg>
      </div>
      
      <ValentineCard/>
    </div>
  )
}

export default App
