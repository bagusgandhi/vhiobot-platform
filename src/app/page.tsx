import ButtonGoogleLogin from '@/components/Button/ButtonGoogleLogin';
import { Divider } from 'antd';

export default function Home() {
  return (
    <main className="container mx-auto">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/img/bg.webp')", // Replace with your image path
          opacity: 0.08, // Adjust the opacity as needed
          zIndex: -1, // Ensure the background stays behind the content
        }}
      />
      <div className="flex flex-col justify-center lg:w-1/3 mx-auto gap-4 h-screen lg:px-0 px-4">
        <div className="text-center w-full text-gray-700 gap-4 flex flex-col">
          <h3 className="font-bold text-2xl">
            Selamat Datang di Vhiobot! <br />
            Asisten Hosting Anda
          </h3>
          <p className="pb-8">
            Sedang mencari paket solusi hosting yang tepat? Vhiobot siap
            membantu Anda! Baik Anda ingin membuat situs web baru, mengelola
            konfigurasi server, atau mengeksplorasi paket hosting dan promo
            kami, Vhiobot akan menemani Anda di setiap langkah.
          </p>
        </div>

        <ButtonGoogleLogin />
      </div>
    </main>
  );
}
