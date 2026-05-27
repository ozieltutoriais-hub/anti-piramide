import { motion } from 'framer-motion'

export default function StatsCard({
  title,
  value,
  icon,
  color = 'bg-green-100',
  iconColor = 'text-green-600',
  trend = '',
  trendPositive = true
}) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -4
      }}
      className="
        bg-white
        rounded-[28px]
        border
        border-[#e4e9f2]
        shadow-[0_10px_40px_rgba(15,23,42,0.06)]
        p-6
        transition-all
        duration-300
      "
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-zinc-500 font-medium">

            {title}

          </p>

          <h2 className="text-4xl font-bold text-[#081120] mt-4">

            {value}

          </h2>

          {
            trend && (

              <div
                className={`
                  mt-4
                  text-sm
                  font-semibold
                  ${trendPositive
                    ? 'text-green-600'
                    : 'text-red-500'}
                `}
              >

                {trend}

              </div>

            )
          }

        </div>

        <div
          className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            ${color}
          `}
        >

          <div className={iconColor}>

            {icon}

          </div>

        </div>

      </div>

    </motion.div>

  )

}