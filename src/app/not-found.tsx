import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-white px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center">

        {/* 404 Image */}
        <div className="relative w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[560px]">
          <Image
            src="https://i.ibb.co.com/fzs6TsLd/not-found.png"
            alt="404 - Page Not Found"
            width={560}
            height={400}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Oops label */}
        <div className="mt-6 flex items-center gap-3 sm:mt-8">
          <span className="h-px w-6 bg-primary sm:w-8" />
          <span className="text-sm font-semibold tracking-widest text-primary sm:text-base">
            Oops!
          </span>
          <span className="h-px w-6 bg-primary sm:w-8" />
        </div>

        {/* Heading */}
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          You&apos;ve lost your way.
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
          The page you&apos;re looking for might have been removed, renamed, or
          doesn&apos;t exist.
        </p>

        {/* Button */}
        <Button
          render={(props) => <Link href="/" {...props} />}
          size="xl"
          className="mt-8 w-full max-w-[260px] rounded-full px-8 hover:shadow-lg hover:shadow-red-500/25 sm:h-13 sm:max-w-[280px] sm:text-base"
        >
          <Home className="size-4 sm:size-5" />
          <span>Back to Homepage</span>
        </Button>
      </div>
    </section>
  );
}
