import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from '@react-native-picker/picker';
import * as Location from "expo-location";
import { usePets } from './PetContext';  // Import the context

const FeedHeader = ({ setFilteredPets }) => {
  // State for dropdown and filter options
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState([]);
  const [vaccinated, setVaccinated] = useState(null);
  const [location, setLocation] = useState(null);

  // Get pet context values
  const { pets, applyFilters } = usePets();  // Get applyFilters from context

  // Function to fetch the user's current location
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    };

    getLocation();
  }, []);

  // Handle filter button click
  const handleFilterClick = () => {
    setModalVisible(true);
  };

  // Apply filters using the context function
  const applyFiltersToPets = () => {
    const filters = {
      gender: selectedGender,
      age: selectedAge,
      weight: selectedWeight,
      personality: selectedPersonality,
      vaccinated: vaccinated,
    };

    applyFilters(filters);  // Call applyFilters from context

    setModalVisible(false);  // Close modal after applying filters
  };

  return (
    <View style={styles.headerContainer}>
      {/* Location Info */}
      <View style={styles.locationContainer}>
        <Icon name="location-on" size={20} color="#EF5B5B" />
        <Text style={styles.locationText}>
          {location
            ? 'Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}'
            : "Loading location..."}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Discover Pets Looking for Homes</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={24} color="#444444" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#C2C2C2"
        />
        <TouchableOpacity onPress={handleFilterClick} style={styles.filterButton}>
          <Icon name="filter-list" size={24} color="#444" />
        </TouchableOpacity>
      </View>

      {/* Modal for Filter Options */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filter Pets</Text>

          {/* Gender Filter */}
          <Text style={styles.modalText}>Gender</Text>
          <Picker
            selectedValue={selectedGender}
            onValueChange={(itemValue) => setSelectedGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>

          {/* Other Filters (Age, Weight, Personality, Vaccinated) */}
          <Text style={styles.modalText}>Age (years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Age"
            keyboardType="numeric"
            value={selectedAge}
            onChangeText={(text) => setSelectedAge(text)}
          />

          <Text style={styles.modalText}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Weight"
            keyboardType="numeric"
            value={selectedWeight}
            onChangeText={(text) => setSelectedWeight(text)}
          />

          <Text style={styles.modalText}>Personality</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Personality Traits (comma separated)"
            value={selectedPersonality.join(", ")}
            onChangeText={(text) =>
              setSelectedPersonality(text.split(",").map((item) => item.trim()))
            }
          />

          <Text style={styles.modalText}>Vaccinated</Text>
          <Picker
            selectedValue={vaccinated}
            onValueChange={(itemValue) => setVaccinated(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Vaccinated Status" value={null} />
            <Picker.Item label="Yes" value={true} />
            <Picker.Item label="No" value={false} />
          </Picker>

          {/* Apply and Close Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonStyle} onPress={applyFiltersToPets}>
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonStyle, { backgroundColor: "#68C2FF" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Lato",
    marginLeft: 10,
    color: "#C2C2C2",
  },
  title: {
    fontSize: 26,
    fontFamily: "Lilita",
    color: "#68C2FF",
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#444",
    paddingHorizontal: 10,
  },
  filterButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Lato", 
  },
  modalText: {
    fontFamily: "LatoBold", 
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: "Lato", 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonStyle: {
    justifyContent: "center",
    width: "40%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
    height: 40,
    marginRight: 10,
    backgroundColor: "#68C2FF",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Lato", 
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedHeader;