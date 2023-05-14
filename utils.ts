export function isValidEmail(email) {
  // Regular expression to validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
  // Regular expression to validate phone number format
  const phoneRegex = /^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

export function hasDecimalPart(num: number) {
  return num % 1 !== 0;
}

export function getRandomColor() {
  let color = "#";
  while (color.length < 7) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.5) {
    return color;
  } else {
    return getRandomColor();
  }
}
