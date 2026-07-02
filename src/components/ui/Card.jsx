export default function Card({
  children,
  className = ''
}) {

  return (

    <div
      className={`
        bg-white/95
        backdrop-blur-xl
        rounded-[32px]
        border
        border-white
        shadow-[0_20px_60px_rgba(15,23,42,0.08)]
        transition-all
        duration-300
        hover:shadow-[0_20px_70px_rgba(15,23,42,0.12)]
        ${className}
      `}
    >

      {children}

    </div>

  )

}