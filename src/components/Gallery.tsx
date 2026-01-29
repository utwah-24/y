import React from 'react';
import Masonry from './Masonry';
import img1 from '@/assets/gallery/img-1.jpeg';
import img2 from '@/assets/gallery/img-2.jpeg';
import img3 from '@/assets/gallery/img-3.jpeg';
import img4 from '@/assets/gallery/img-4.jpeg';
import img5 from '@/assets/gallery/img-5.jpeg';
import img6 from '@/assets/gallery/img-6.jpeg';
import img7 from '@/assets/gallery/img-7.jpeg';
import img8 from '@/assets/gallery/img-8.jpeg';
import img9 from '@/assets/gallery/img-9.jpeg';
import img10 from '@/assets/gallery/img-10.jpeg';
import img11 from '@/assets/gallery/img-11.jpeg';
import img12 from '@/assets/gallery/img-12.jpeg';
import img13 from '@/assets/gallery/img-13.jpeg';

const Gallery = () => {
  const items = [
    {
      id: "1",
      img: img1,
      height: 400,
    },
    {
      id: "2",
      img: img2,
      height: 350,
    },
    {
      id: "3",
      img: img3,
      height: 500,
    },
    {
      id: "4",
      img: img4,
      height: 300,
    },
    {
      id: "5",
      img: img5,
      height: 450,
    },
    {
      id: "6",
      img: img6,
      height: 380,
    },
    {
      id: "7",
      img: img7,
      height: 420,
    },
    {
      id: "8",
      img: img8,
      height: 360,
    },
    {
      id: "9",
      img: img9,
      height: 480,
    },
    {
      id: "10",
      img: img10,
      height: 340,
    },
    {
      id: "11",
      img: img11,
      height: 410,
    },
    {
      id: "12",
      img: img12,
      height: 390,
    },
    {
      id: "13",
      img: img13,
      height: 440,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black font-quicksand mb-4" style={{ fontSize: 'clamp(2rem, 6vw, 60px)' }}>
            Gallery
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Explore our stunning collection of yacht experiences
          </p>
        </div>
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>
    </section>
  );
};

export default Gallery;
