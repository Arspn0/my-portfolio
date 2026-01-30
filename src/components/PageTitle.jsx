import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Aris Sopian | Portfolio";
        break;
      case "/about":
        document.title = "About | Aris Sopian";
        break;
      case "/projects":
        document.title = "Projects | Aris Sopian";
        break;
      case "/contact":
        document.title = "Contact | Aris Sopian";
        break;
      default:
        document.title = "Aris Sopian";
    }
  }, [location.pathname]);

  return null;
}