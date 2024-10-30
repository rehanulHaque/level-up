import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <Loader className="h-12 w-12 animate-spin"/>
      </div>
      <p className="text-center font-bold mt-2">DON'T LIE TO YOUR SELF.</p>
    </div>
  )
}
