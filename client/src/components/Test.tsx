import { useEffect, useRef, useState } from "react";

const Test = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      setFooterHeight(footerHeight);
    }
  }, [divRef.current]);

  return (
    <div ref={divRef} style={{ height: "100px", width: "100px", backgroundColor: "black", color: "white" }}>
      {footerHeight}
    </div>
  );
};

export default Test;
