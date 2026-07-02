import { motion } from 'framer-motion'

export default function StatsCard({
  title,
  value,
  colorClass
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02
      }}
      className="rounded-3xl p-7 bg-[#11192c] border border-zinc-800 shadow-xl relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${colorClass}`}></div>
      <p className="text-zinc-400 mb-3 font-medium">
        {title}
      </p>

      <h3 className="text-4xl font-black text-white">
        {value}
      </h3>

    </motion.div>
  )
}