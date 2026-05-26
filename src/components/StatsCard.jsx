import { motion } from 'framer-motion'

export default function StatsCard({
  title,
  value,
  color
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.03
      }}
      className={`rounded-3xl p-7 shadow-2xl ${color}`}
    >

      <p className="text-white/80 mb-3">
        {title}
      </p>

      <h3 className="text-4xl font-black">
        {value}
      </h3>

    </motion.div>
  )
}