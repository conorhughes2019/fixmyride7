export const blackTheme = {
  primaryBackground: "rgba(28, 28, 30, 1)",
  secondaryBackground: "rgba(44, 44, 46, 1)",
  tertiaryBackground: "rgba(51, 51, 54, 1)",
  primaryText: "rgba(242, 242, 247, 1)",
  secondaryText: "rgba(176, 176, 179, 1)",
  accent: "rgba(109, 117, 230, 1)",
  accentLight: "rgba(136, 146, 255, 1)",
  accentSuperLight: "rgba(136, 146, 255, 0.1)",
  error: "rgba(255, 69, 58, 1)",
  warning: "rgba(255, 214, 10, 1)",
  success: "rgba(52, 199, 89, 1)",
  disabled: "rgba(122, 122, 126, 1)",
  divider: "rgba(60, 60, 67, 1)",
};

export const purpleTheme = {
  primaryBackground: "rgba(13, 7, 26, 1)",
  secondaryBackground: "rgba(22, 14, 41, 1)",
  tertiaryBackground: "rgba(34, 23, 61, 1)",
  primaryText: "rgba(242, 242, 247, 1)",
  secondaryText: "rgba(176, 176, 179, 1)",
  accent: "rgba(156, 58, 240, 1)",
  accentLight: "rgba(189, 87, 255, 1)",
  accentSuperLight: "rgba(189, 87, 255, 0.1)",
  error: "rgba(255, 69, 58, 1)",
  warning: "rgba(255, 214, 10, 1)",
  success: "rgba(52, 199, 89, 1)",
  disabled: "rgba(122, 122, 126, 1)",
  divider: "rgba(82, 82, 89, 1)",
};

export const blueTheme = {
  primaryBackground: "rgba(23, 32, 36, 1)",
  secondaryBackground: "rgba(24, 51, 71, 1)",
  tertiaryBackground: "rgba(30, 73, 104, 1)",
  primaryText: "rgba(242, 242, 247, 1)",
  secondaryText: "rgba(176, 176, 179, 1)",
  accent: "rgba(0, 121, 191, 1)",
  accentLight: "rgba(94, 168, 221, 1)",
  accentSuperLight: "rgba(94, 168, 221, 0.1)",
  error: "rgba(255, 69, 58, 1)",
  warning: "rgba(255, 214, 10, 1)",
  success: "rgba(52, 199, 89, 1)",
  disabled: "rgba(122, 122, 126, 1)",
  divider: "rgba(82, 82, 89, 1)",
};

export const lightModeColors = {
  primaryBackground: "rgba(255, 255, 255, 1)",
  secondaryBackground: "rgba(204, 204, 204, 1)",
  tertiaryBackground: "rgba(182, 182, 182, 1)",
  primaryText: "rgba(28, 28, 30, 1)",
  secondaryText: "rgba(44, 44, 46, 1)",
  accent: "rgba(74, 144, 226, 1)",
  accentLight: "rgba(100, 181, 246, 1)",
  accentSuperLight: "rgba(100, 181, 246, 0.1)",
  error: "rgba(255, 69, 58, 1)",
  warning: "rgba(255, 214, 10, 1)",
  success: "rgba(52, 199, 89, 1)",
  disabled: "rgba(174, 174, 178, 1)",
  divider: "rgba(232, 232, 236, 1)",
};

export const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

export const mapStyleSilver = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];
