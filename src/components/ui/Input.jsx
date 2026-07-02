export default function Input({
  placeholder,
  type = 'text',
  className = '',
  ...props
}) {

  return (

    <input
      type={type}
      placeholder={placeholder}
      className={`
        w-full
        h-12
        px-4
        rounded-xl
        border
        border-[#d8dee9]
        bg-white
        outline-none
        transition-all
        text-[15px]
        text-zinc-700
        placeholder:text-zinc-400
        focus:ring-4
        focus:ring-green-500/20
        focus:border-green-500
        ${className}
      `}
      {...props}
    />

  )

}