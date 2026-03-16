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

          <View style={styles.modalHeader}>
            <Text style={{fontSize: 20, fontWeight: '700'}}>Order #</Text>
            <Text style={{fontSize: 20, fontWeight: '400'}}>{order?.id.slice(0, 6)}</Text>
            
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10}}>
            <View>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '700'}}>Recipient name:</Text>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '400'}}>{order?.username}</Text>
            </View>
            <View style={styles.text}>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '700'}}>Contact number:</Text>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '400'}}>{order?.phoneCode} {order?.phone}</Text>
            </View>
          </View>

          

          <View style={{alignSelf: 'center', paddingBottom: 10}}>
            <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '700'}}>Address for Delivery:</Text>
            <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '400'}}>{order?.address
              ? `${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}`
              : "N/A"}</Text>
             
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <View>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '700'}}>Date:</Text>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '400'}}>{formatDate(order?.createdAt)}</Text>
            </View>
            <View>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '700'}}> Status:</Text>
              <Text style={{alignSelf: 'center', fontSize: 16, fontWeight: '400'}}>{order?.status}</Text>
            </View>
          </View>

          

          <Text style={[styles.modalText, { marginTop: 10, fontSize: 20, textAlign: 'center', fontWeight: '600'}]}>Items:</Text>
          

          <ScrollView style={{ maxHeight: 300 }}>
            
            {(order?.items || []).map((item, index) => (
              
              <View key={index} style={{ marginBottom: 10 }}>
                <Text>Quantity: {item.quantity}</Text>
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
  modalHeader: { flexDirection: 'row', alignSelf: 'center', paddingBottom: 10 },
  modalText: { fontSize: 14 },
  closeBtn: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
});