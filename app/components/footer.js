export default function Footer() {
    //Function to get current year
    function getCurrentYear() {
        return new Date().getFullYear();
    }
  return (
    <footer className="bg-gray-800 p-4 text-white mt-auto">
      <div className="container mx-auto text-center">
        &copy; {getCurrentYear()} TuneBuddy — Built with Next.js & Firebase
      </div>
    </footer>
  );
}
