import { BlurFade } from "./ui/blur-fade"

export function BlurFadeDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <BlurFade delay={0.25} inView>
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
            Welcome to ShowWork! 👋
          </h1>
        </BlurFade>
        
        <BlurFade delay={0.5} inView>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Experience smooth, professional animations with our BlurFade component
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <BlurFade key={item} delay={0.7 + index * 0.1} inView>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Feature {item}
                </h3>
                <p className="text-gray-300">
                  This card demonstrates the BlurFade animation with a delay of {0.7 + index * 0.1}s
                </p>
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={1.5} inView>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}