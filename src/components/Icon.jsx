import React from "react";
import windIcon from '../assets/wind.png';
import humidityIcon from "../assets/humidity.png";
import visibilityIcon from "../assets/visibility.png";
import sunriseIcon from "../assets/Sunrise.png";
import sunsetIcon from "../assets/Sunset.png";

const Icon = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`h-8 w-8 inline-block ${className}`} />
);

export const WindIcon = () => (
  <Icon src={windIcon} alt="Wind" className="animate-icon" />
);
export const HumidityIcon = () => (
  <Icon src={humidityIcon} alt="Humidity" className="animate-icon" />
);
export const VisibilityIcon = () => (
  <Icon src={visibilityIcon} alt="Visibility" className="animate-icon" />
);
export const SunriseIcon = () => (
  <Icon src={sunriseIcon} alt="Sunrise" className="animate-icon" />
);
export const SunsetIcon = () => (
  <Icon src={sunsetIcon} alt="Sunset" className="animate-icon" />
);
