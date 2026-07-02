export default function Button({
  children,
  className = '',
  ...props
}) {

  return (

    <button
      className={`
        h-12
        px-6
        rounded-xl
        bg-gradient-to-b
        from-green-500
        to-green-600
        hover:from-green-400
        hover:to-green-500
        text-white
        font-semibold
        shadow-lg
        transition-all
        duration-300
        flex
        items-center
        justify-center
        gap-3
        ${className}
      `}
      {...props}
    >

      {children}

    </button>

  )

}