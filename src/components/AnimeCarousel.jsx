


import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import { Link } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { PlayIcon, BookmarkIcon } from '@heroicons/react/24/outline'



function AnimeCarousel({ animeData }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="relative bg-black w-full">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        showIndicators={true}
        interval={5000}
        swipeable={!isMobile}
        emulateTouch={!isMobile}
        className="carousel-container"
        renderArrowPrev={(clickHandler, hasPrev) =>
          !isMobile && hasPrev && (
            <button
              onClick={clickHandler}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/75"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )
        }
        renderArrowNext={(clickHandler, hasNext) =>
          !isMobile && hasNext && (
            <button
              onClick={clickHandler}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/75"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )
        }
      >
        {animeData.map((anime) => (
          <div key={anime.id} className="relative">
            {/* Mobile View */}
            <div className="block md:hidden relative w-full" style={{ height: '65vh' }}>
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="absolute bottom-12 left-0 right-0 px-4 space-y-3 text-sm">
                  <h1 className="text-lg font-bold text-white leading-tight">
                    {anime.title}
                  </h1>
                  <p className="text-xs text-white/90">{anime.subtitle}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      to={`/anime/${anime.id}`}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-2 font-medium"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>START BROWSING</span>
                    </Link>
                    <button className="bg-transparent p-1">
                      <BookmarkIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block relative w-full" style={{ height: '85vh' }}>
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="absolute bottom-32 left-12 max-w-2xl space-y-4">
                  <h1 className="text-5xl font-bold text-white leading-tight">
                    {anime.title}
                  </h1>
                  <p className="text-xl text-white/90">{anime.subtitle}</p>
                  <p className="text-lg text-white/80 line-clamp-2">
                    {anime.description}
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      to={`/anime/${anime.id}`}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-sm flex items-center gap-3 font-medium"
                    >
                      <PlayIcon className="w-6 h-6" />
                      <span>START WATCHING</span>
                    </Link>
                    <button className="bg-transparent p-2">
                      <BookmarkIcon className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <style jsx>{`
        .carousel .control-dots {
          bottom: 16px;
          text-align: center;
          width: 100%;
        }
        .carousel .control-dots .dot {
          background: #fff;
          border-radius: 2px;
          height: 4px;
          margin: 0 4px;
          opacity: 0.3;
          width: 24px;
          transition: opacity 0.25s;
        }
        .carousel .control-dots .dot.selected {
          background: #ff6d00;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default AnimeCarousel;

