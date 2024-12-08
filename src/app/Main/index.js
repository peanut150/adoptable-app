import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router"; // Import useRouter
import { Foundation } from "@expo/vector-icons"; // Import Foundation icons
import FeedHeader from "../../components/FeedHeader"; // Import your Header component
import { usePets } from "../../components/PetContext"; // Adjust the path as needed

const Feed = () => {
  const params = useLocalSearchParams();
  const { pets } = usePets(); // Access shared pets state
  const router = useRouter(); // For navigation
  const { filteredPets } = usePets(); // Added

  // Parse the selectedImages string back into an array
  const selectedImages = params.selectedImages
    ? JSON.parse(params.selectedImages)
    : [];

  // Validate if required parameters are present
  const isPetDataValid =
    params.petName &&
    params.petGender &&
    params.petAge &&
    params.petWeight &&
    params.petPersonality &&
    params.petDescription &&
    params.petIllnessHistory &&
    typeof params.petVaccinated !== "undefined" &&
    selectedImages.length > 0;

  // Render pet item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/PetDetails",
          params: {
            ...item,
            images: JSON.stringify(item.images),
          },
        });
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      </View>
      <View style={styles.petDetailsContainer}>
        <View style={styles.nameGenderContainer}>
          <Text style={styles.name}>{item.petName}</Text>
          <View style={styles.genderContainer}>
            {item.petGender === "Female" ? (
              <Foundation name="female-symbol" size={24} color="#EF5B5B" />
            ) : (
              <Foundation name="male-symbol" size={24} color="#68C2FF" />
            )}
          </View>
        </View>
        <Text style={styles.age}>{item.petAge}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FeedHeader setFilteredPets={filteredPets}/>
      {pets.length > 0 ? (
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.container}
        />
      ) : (
        <View style={styles.noPetsContainer}>
          <Text style={styles.noPetsText}>No pets available. Add a pet to display here!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between", // Evenly distribute the cards within a row
    marginBottom: 10,
  },
  card: {
    width: "47%", // Each card occupies 48% of the row width
    marginBottom: 16, // Spacing between rows
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: 230,
    shadowColor: "#000", // Shadow color for iOS
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow images to wrap into new rows
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 20, // Top-left corner radius
    borderTopRightRadius: 20, // Top-right corner radius
    borderBottomLeftRadius: 0, // Bottom-left corner radius
    borderBottomRightRadius: 0, // Bottom-right corner radius
  },
  petDetailsContainer: {
    flex: 1,
    margin: 13,
    alignItems: "center",
  },
  nameGenderContainer: {
    flexDirection: "row", // Make name and gender appear on the same line
    alignItems: "center", // Vertically align the text and icon
    marginBottom: 5, // Optional spacing between name and gender
  },
  name: {
    fontSize: 16,
    fontFamily: "LatoBold",
    color: "black",
    marginRight: 8, // Adds spacing between name and gender icon
  },
  genderContainer: {
    flexDirection: "row", // Arrange the icon and text in a row
    alignItems: "center", // Center the icon vertically
  },
  gender: {
    fontSize: 16,
    fontFamily: "Lato",
    color: "#C2C2C2",
  },
  age: {
    fontSize: 16,
    fontFamily: "Lato",
    color: "#C2C2C2",
  },
  noPetsContainer: {
    flex: 1, // Allow the container to take full height
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  noPetsText: {
    textAlign: "center",
    fontFamily: 'Lato',
    fontSize: 16,
    color: "#999",
  },
  
});

export default Feed;