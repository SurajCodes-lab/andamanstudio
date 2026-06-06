export default function Container({
  children,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const max =
    size === "wide" ? "max-w-[1500px]" : size === "narrow" ? "max-w-3xl" : "max-w-[1240px]";
  return <div className={`mx-auto w-full ${max} px-5 sm:px-8 ${className}`}>{children}</div>;
}
