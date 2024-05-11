import ButtonGoogleLogin from "@/components/Button/ButtonGoogleLogin";

export default function Home() {
  return (
    <main className="container mx-auto">
      <div className="flex flex-col justify-center lg:w-1/3 mx-auto gap-4 h-screen lg:px-0 px-4">
        <div className="text-center w-full text-gray-700">
          <p className="text-sm">Start Chat with</p>
          <h3 className="font-bold text-4xl">Vhiobot</h3>
        </div>
          <ButtonGoogleLogin />
      </div>
    </main>
  );
}
