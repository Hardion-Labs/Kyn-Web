export default function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-600">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-zinc-600">{description}</p>}
    </div>
  );
}
