import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  if (localStorage.getItem("usuario")) {
    alert(
      "El usuario: " +
        localStorage.getItem("usuario") +
        " ya se encuentra logueado"
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
      </div>
    </>
  );
}
