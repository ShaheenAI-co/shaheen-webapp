export default function CurvedBanner({color}) {
  return (
    <div className="absolute bottom-[-200px]  w-[2000px]">
      <svg
        viewBox="0 0 1000 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
          <filter id="bannerBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
            {/* stdDeviation="40" for an 80px blur */}
          </filter>
        </defs>
        {/* The path element applies the filter and blend mode *to itself* */}
        <path
          d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
          fill="#8A2BE2"
          style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
        />
      </svg>
    </div>
  );
}
