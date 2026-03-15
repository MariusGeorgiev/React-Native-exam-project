import * as Location from "expo-location";

export async function pickLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.LocationAccuracy.BestForNavigation,
  });

  const address = await Location.reverseGeocodeAsync(location.coords);

  const street = address[0].street;
  const streetNumber = address[0].streetNumber || "";

  let streetAndNumber = "";

  if (street && streetNumber) {
    streetAndNumber = `${street} ${streetNumber}`;
  } else if (street) {
    streetAndNumber = street;
  }

  let formattedAddress = address[0].formattedAddress || "";

  if (formattedAddress) {
    const toRemove = [
      address[0].postalCode,
      address[0].city,
      address[0].country,
    ].filter(Boolean);

    toRemove.forEach((part) => {
      const regex = new RegExp(`\\b${part}\\b`, "gi");
      formattedAddress = formattedAddress.replace(regex, "");
    });

    formattedAddress = formattedAddress
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .join(", ");
  }

  const streetOrFormatAddress = streetAndNumber || formattedAddress || "";

  return {
    street: streetOrFormatAddress,
    city: address[0].city,
    country: address[0].country,
    postalCode: address[0].postalCode,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}