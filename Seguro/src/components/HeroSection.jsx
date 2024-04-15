import medicina1 from "../assets/medicina1.mp4";
import medicina2 from "../assets/medicina2.mp4";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Soluciones para tu
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          salud y bienestar
        </span>
      </h1>
      <p className="mt-10 tex-lg text-center tex-neutral-500 max-w-4xl">
        En MediSalud, nuestra pasión es impulsar un estilo de vida saludable y
        feliz a través de productos y servicios que inspiran, nutren y
        revitalizan cuerpo y mente. Descubre cómo nuestra innovación y
        compromiso transforman tu bienestar en una experiencia extraordinaria y
        sostenible.
      </p>
      <div className="flex mt-10 justify-center">
        <video autoPlay loop muted className="rounded-lg w-1/2 border border-orange-700 shadow-orange-500 mx-2 my-4">
            <source src={medicina1} type="video/mp4"/>
        </video>
        <video autoPlay loop muted className="rounded-lg w-1/2 border border-orange-700 shadow-orange-500 mx-2 my-4">
            <source src={medicina2} type="video/mp4"/>
        </video>
      </div>
    </div>
  );
};
export default HeroSection;
