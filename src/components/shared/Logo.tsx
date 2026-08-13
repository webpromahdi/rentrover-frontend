import Image from "next/image";

const lightLogo = "/rent-rover.png";
const darkLogo = "/rent-rover-dark.png";

const Logo = ({ inverse = false }: { inverse?: boolean }) => {
  return (
    <Image
      src={inverse ? darkLogo : lightLogo}
      alt="RentRover Logo"
      width={300}
      height={100}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '132px'
      }}
      className="object-contain"
    />
  );
};

export default Logo;
