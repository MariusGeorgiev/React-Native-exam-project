import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

import FurnitureCard from "./FurnitureCard";

export default function OrderDetailsModal({ visible, order, onClose, navigation, formatDate }) {
  if (!order) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer}>

          <Text style={styles.modalHeader}>
            Order #{order?.id.slice(0, 6)}
          </Text>

          <Text style={styles.text}>
            Recipient name: {order?.username}
          </Text>

          <Text style={styles.text}>
            Contact phone number: {order?.phoneCode} {order?.phone}
          </Text>

          <Text style={styles.text}>
            Address for Delivery: {order?.address
              ? `${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}`
              : "N/A"}
          </Text>

          <Text style={styles.modalText}>
            Date: {formatDate(order?.createdAt)}
          </Text>

          <Text style={styles.modalText}>
            Status: {order?.status}
          </Text>

          <Text style={[styles.modalText, { marginTop: 10 }]}>Items:</Text>

          <ScrollView style={{ maxHeight: 300 }}>
            {(order?.items || []).map((item, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                {item.furniture ? (
                  <FurnitureCard
                    furniture={item.furniture}
                    onPress={() => {
                      onClose();

                      navigation.navigate("FurnitureDetails", {
                        furnitureId: item.productId,
                      });
                    }}
                  />
                ) : (
                  <Text>Item data not found</Text>
                )}

                <Text>Quantity: {item.quantity}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: "white", textAlign: "center" }}>
              Close
            </Text>
          </TouchableOpacity>

        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  text: { fontSize: 14, marginBottom: 2 },
  itemText: { fontSize: 14, marginBottom: 2, color: "#007bff" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalText: { fontSize: 14 },
  closeBtn: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
});