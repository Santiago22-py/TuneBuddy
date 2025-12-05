import Navbar from "../components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-black items-center justify-center text-center">
        <h1 className="mb-6 text-2xl font-semibold text-green-300">
          Welcome to the Log in Page
        </h1>
      </div>
    </div>
  );
}
