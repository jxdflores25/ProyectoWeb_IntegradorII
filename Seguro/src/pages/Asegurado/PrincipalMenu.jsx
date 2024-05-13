import PropTypes from "prop-types";

export default function PrincipalMenu({ Data }) {
  return (
    <div className="flex-1 p-4 flex flex-col justify-center items-center">
    <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
      Bienvenido Asegurado: &nbsp;
      <span className="bg-gradient-to-r from-verde to-celeste text-transparent bg-clip-text">
        {Data.nombre + " " + Data.apellido}
      </span>
    </h1>
  
    <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
      En MediSalud, nuestra pasión es impulsar un estilo de vida saludable y
      feliz a través de productos y servicios que inspiran, nutren y
      revitalizan cuerpo y mente. Descubre cómo nuestra innovación y
      compromiso transforman tu bienestar en una experiencia extraordinaria y
      sostenible.
    </p>
  </div>
  );
}

PrincipalMenu.propTypes = {
  Data: PropTypes.object.isRequired,
};
