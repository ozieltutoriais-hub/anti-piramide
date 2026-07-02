export default function PageHeader({
  title,
  subtitle,
  action
}) {

  return (

    <div className="flex items-center justify-between mb-8">

      <div>

        <h1 className="text-4xl font-bold text-[#081120] tracking-tight">

          {title}

        </h1>

        <p className="text-zinc-500 mt-2">

          {subtitle}

        </p>

      </div>

      {action}

    </div>

  )

}