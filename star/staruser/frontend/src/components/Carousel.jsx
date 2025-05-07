"use client"

import { useState, useEffect, useRef } from "react"

const Carousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoPlayRef = useRef(null)

  useEffect(() => {
    autoPlayRef.current = nextSlide
  })

  useEffect(() => {
    const play = () => {
      autoPlayRef.current()
    }

    const interval = setInterval(play, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
      <div
        className="h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4 animate-fade-in-up">
                {slide.title}
              </h2>
              <p className="text-gray-200 text-sm md:text-lg mb-4 md:mb-6 max-w-xl animate-fade-in-up animation-delay-200">
                {slide.description}
              </p>
              {slide.button && (
                <button
                  onClick={slide.button.onClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105 shadow-lg inline-block animate-fade-in-up animation-delay-400 w-auto"
                >
                  {slide.button.text}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none"
        onClick={prevSlide}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none"
        onClick={nextSlide}
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
