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
      className="rounded-2xl p-6 bg-white border border-zinc-200 shadow-sm relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${colorClass}`}></div>
      <p className="text-zinc-500 mb-2 font-medium text-sm">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-slate-800">
        {value}
      </h3>

    </motion.div>
  )
}