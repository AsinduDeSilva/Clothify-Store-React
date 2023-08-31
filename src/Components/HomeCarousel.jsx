import { Carousel } from "@material-tailwind/react";
import swiper1 from "../assets/swiper1.jpg"
import swiper2 from "../assets/swpier2.jpg"
import swiper3 from "../assets/swiper3.jpg"
import swiper4 from "../assets/swiper4.jpg"

 
export function HomeCarousel() {
  return (
    <Carousel
      autoplay
      loop
      className="z-10"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {window.innerWidth > 700 ? (
        <img
          src={swiper4}
          alt="image 1"
          className="h-[500px] sm:h-[74vh] w-full sm:object-cover object-left "
        />
      ): null}
      <img
        src={swiper2}
        alt="image 2"
        className="h-[500px] sm:h-[74vh] w-full object-cover object-left"
      />
      <img
        src={swiper3}
        alt="image 3"
        className="h-[500px] sm:h-[74vh] w-full object-cover object-left-top"
      />
      <img
        src={swiper1}
        alt="image 3"
        className="h-[500px] sm:h-[74vh] w-full object-cover object-left-top"
      />
    </Carousel>
  );
}