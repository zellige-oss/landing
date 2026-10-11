import { wordmark } from "./brand";

/** The moodboard wordmark in porcelain, with its gold stars. */
export function Wordmark({ className, alt = "", lazy }: { className?: string; alt?: string; lazy?: boolean }) {
  return <img src={wordmark} width="1480" height="730" alt={alt} loading={lazy ? "lazy" : undefined} className={className} />;
}
