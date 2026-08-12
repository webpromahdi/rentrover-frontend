import Image from "next/image";

const brandLogo = "/gearup-logo.png";

const Logo = ({ inverse = false }: { inverse?: boolean }) => {
  return (
    <Image
      src={brandLogo}
      alt="GearUp"
      width={132}
      height={36}
      className={`object-contain ${inverse ? "brightness-0 invert" : ""}`}
    />
  );
};

export default Logo;
