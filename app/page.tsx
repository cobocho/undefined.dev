import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-blue-500">
      <Image src="/path/to/image.jpg" alt="Image" width={200} height={200} />
    </div>
  );
}
