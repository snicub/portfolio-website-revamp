import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the context values
interface DeviceContextProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Create the context with default values
const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

// Create a custom hook to consume the context
export const useDevice = (): DeviceContextProps => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};

// Provider component to wrap around the application
interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider = ({
  children,
}: DeviceProviderProps): JSX.Element => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle screen resizing and device detection
  const updateDeviceType = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
    setIsTablet(width > 768 && width <= 1024);
    setIsDesktop(width > 1024);
  };

  useEffect(() => {
    // Initialize the device type when the component mounts
    updateDeviceType();

    // Listen for window resize events
    window.addEventListener("resize", updateDeviceType);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceProvider;
