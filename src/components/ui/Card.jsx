export default function Card({
  children,
  className = ''
}) {

  return (

    <div
      className={`
        bg-white
        rounded-[28px]
        border
        border-[#e4e9f2]
        shadow-[0_10px_40px_rgba(15,23,42,0.06)]
        transition-all
        duration-300
        ${className}
      `}
    >

      {children}

    </div>

  )

}